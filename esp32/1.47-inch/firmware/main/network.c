// SPDX-License-Identifier: GPL-3.0-or-later
#include "network.h"
#include "update_policy.h"
#include "portal_access.h"
#include <stdlib.h>
#include <string.h>
#include <time.h>
#include "lwip/sockets.h"
#include "freertos/FreeRTOS.h"
#include "freertos/task.h"
#include "freertos/queue.h"
#include "freertos/semphr.h"
#include "esp_app_desc.h"
#include "esp_crt_bundle.h"
#include "esp_event.h"
#include "esp_log.h"
#include "esp_http_client.h"
#include "esp_http_server.h"
#include "esp_netif.h"
#include "esp_netif_sntp.h"
#include "esp_ota_ops.h"
#include "esp_random.h"
#include "esp_system.h"
#include "esp_timer.h"
#include "esp_wifi.h"
#include "nvs.h"
#include "mbedtls/sha256.h"
#include "cJSON.h"

static SemaphoreHandle_t lock;
static QueueHandle_t commands;
static net_status_t status;
static httpd_handle_t portal;
static char ssid[33], password[65], pending_ssid[33], pending_password[65], token[17];
static bool credentials_pending;
static int64_t portal_until;
typedef struct {char version[24], url[256], sha[65]; uint32_t size;} manifest_t;
static manifest_t candidate;

static void message(const char *s) {xSemaphoreTake(lock,portMAX_DELAY);strlcpy(status.message,s,sizeof(status.message));xSemaphoreGive(lock);}
void network_status(net_status_t *out) {xSemaphoreTake(lock,portMAX_DELAY);*out=status;xSemaphoreGive(lock);}
void network_command(net_command_t cmd) {xQueueSend(commands,&cmd,0);}
static void wifi_event(void *arg,esp_event_base_t base,int32_t id,void *data) {
    (void)arg;(void)data;
    xSemaphoreTake(lock,portMAX_DELAY);
    if(base==IP_EVENT && id==IP_EVENT_STA_GOT_IP)status.online=true;
    if(base==WIFI_EVENT && id==WIFI_EVENT_STA_DISCONNECTED)status.online=false;
    xSemaphoreGive(lock);
}
static void connect_saved(void) {
    if(!ssid[0]) {message("Offline aquarium - open Settings for Wi-Fi");return;}
    wifi_config_t cfg={0};
    strlcpy((char*)cfg.sta.ssid,ssid,sizeof(cfg.sta.ssid));
    strlcpy((char*)cfg.sta.password,password,sizeof(cfg.sta.password));
    cfg.sta.pmf_cfg.capable=true;
    esp_wifi_disconnect();
    if(esp_wifi_set_config(WIFI_IF_STA,&cfg)==ESP_OK)esp_wifi_connect();
}
// Decodes a form field without accepting truncation or embedded NUL bytes.
static bool decode(const char *src,char *dst,size_t cap) {
    size_t n=0;
    for(;*src;++src) {
        unsigned char c=*src;
        if(c=='+') c=' ';
        else if(c=='%') {
            if(!src[1]||!src[2])return false;
            char hex[3]={src[1],src[2],0},*end; long value=strtol(hex,&end,16);
            if(*end||value==0)return false;
            c=(unsigned char)value;src+=2;
        }
        if(c<32||n+1>=cap)return false;
        dst[n++]=(char)c;
    }
    dst[n]=0;return true;
}
static bool portal_on_setup_network(httpd_req_t *req) {
    struct sockaddr_storage local = {0};socklen_t len=sizeof(local);
    esp_netif_ip_info_t ap_ip;
    esp_netif_t *ap=esp_netif_get_handle_from_ifkey("WIFI_AP_DEF");
    if(!ap || esp_netif_get_ip_info(ap,&ap_ip)!=ESP_OK)return false;
    if(getsockname(httpd_req_to_sockfd(req),(struct sockaddr*)&local,&len)!=0)return false;
    return portal_address_matches(&local,len,ap_ip.ip.addr);
}
static esp_err_t portal_get(httpd_req_t *req) {
    if(!portal_on_setup_network(req))return httpd_resp_send_err(req,HTTPD_403_FORBIDDEN,"Join the device setup network first");
    char page[1800];
    snprintf(page,sizeof(page),
      "<!doctype html><meta name='viewport' content='width=device-width,initial-scale=1'>"
      "<title>ASCII Genesis - Mini Wi-Fi</title><style>body{font:20px system-ui;max-width:28em;margin:2em auto;padding:1em}"
      "label,input,button{display:block;margin:1em 0;width:100%%;font:inherit;box-sizing:border-box;padding:.5em}</style>"
      "<h1>Connect your aquarium</h1><p>Choose your 2.4 GHz home network. The aquarium also works offline.</p>"
      "<form method='post' action='/wifi'><input type='hidden' name='token' value='%s'>"
      "<label>Wi-Fi name<input name='ssid' maxlength='32' required autocomplete='off'></label>"
      "<label>Wi-Fi password<input name='password' type='password' maxlength='64' autocomplete='off'></label>"
      "<button>Save and connect</button></form>",token);
    httpd_resp_set_hdr(req,"Cache-Control","no-store");
    httpd_resp_set_hdr(req,"Content-Security-Policy","default-src 'none'; style-src 'unsafe-inline'; form-action 'self'; frame-ancestors 'none'");
    return httpd_resp_sendstr(req,page);
}
static esp_err_t portal_post(httpd_req_t *req) {
    if(!portal_on_setup_network(req))return httpd_resp_send_err(req,HTTPD_403_FORBIDDEN,"Join the device setup network first");
    if(req->content_len<=0||req->content_len>512)return httpd_resp_send_err(req,HTTPD_400_BAD_REQUEST,"Invalid form");
    char body[513],raw[256],name[33],pass[65],submitted_token[17];int used=0;
    while(used<req->content_len) {int n=httpd_req_recv(req,body+used,req->content_len-used);if(n<=0)return ESP_FAIL;used+=n;}
    body[used]=0;
    if(httpd_query_key_value(body,"token",submitted_token,sizeof(submitted_token))!=ESP_OK || strcmp(token,submitted_token)
       || httpd_query_key_value(body,"ssid",raw,sizeof(raw))!=ESP_OK || !decode(raw,name,sizeof(name)) || !name[0])
        return httpd_resp_send_err(req,HTTPD_400_BAD_REQUEST,"Invalid setup form");
    if(httpd_query_key_value(body,"password",raw,sizeof(raw))!=ESP_OK || !decode(raw,pass,sizeof(pass)))
        return httpd_resp_send_err(req,HTTPD_400_BAD_REQUEST,"Invalid password");
    size_t len=strlen(pass);
    if(len && (len<8 || (len>63 && len!=64)))return httpd_resp_send_err(req,HTTPD_400_BAD_REQUEST,"Password must be 8-63 characters, or empty for an open network");
    if(len==64) for(int i=0;i<64;i++) if(!((pass[i]>='0'&&pass[i]<='9')||(pass[i]>='a'&&pass[i]<='f')||(pass[i]>='A'&&pass[i]<='F')))
        return httpd_resp_send_err(req,HTTPD_400_BAD_REQUEST,"A 64-character key must be hexadecimal");
    xSemaphoreTake(lock,portMAX_DELAY);
    strlcpy(pending_ssid,name,sizeof(pending_ssid));strlcpy(pending_password,pass,sizeof(pending_password));credentials_pending=true;
    xSemaphoreGive(lock);
    httpd_resp_set_hdr(req,"Cache-Control","no-store");
    return httpd_resp_sendstr(req,"Saved for connection. Rejoin your usual Wi-Fi and check the aquarium screen. If connection fails, reopen Wi-Fi setup on the aquarium.");
}
static void close_portal(void) {
    if(portal){httpd_stop(portal);portal=NULL;}
    esp_wifi_set_mode(WIFI_MODE_STA);
    xSemaphoreTake(lock,portMAX_DELAY);status.setup=false;memset(status.ap_password,0,sizeof(status.ap_password));xSemaphoreGive(lock);
    memset(token,0,sizeof(token));
}
static void open_portal(void) {
    close_portal();
    wifi_config_t ap={0};uint32_t random=esp_random();
    char ap_name[33],ap_pass[17];
    snprintf(ap_name,sizeof(ap_name),"ASCII-Genesis-Mini-%04lx",(unsigned long)(random&65535));
    snprintf(ap_pass,sizeof(ap_pass),"%08lx%08lx",(unsigned long)esp_random(),(unsigned long)esp_random());
    snprintf(token,sizeof(token),"%08lx%08lx",(unsigned long)esp_random(),(unsigned long)esp_random());
    strlcpy((char*)ap.ap.ssid,ap_name,sizeof(ap.ap.ssid));strlcpy((char*)ap.ap.password,ap_pass,sizeof(ap.ap.password));
    ap.ap.authmode=WIFI_AUTH_WPA2_PSK;ap.ap.max_connection=1;
    ESP_ERROR_CHECK(esp_wifi_set_mode(WIFI_MODE_APSTA));ESP_ERROR_CHECK(esp_wifi_set_config(WIFI_IF_AP,&ap));
    httpd_config_t cfg=HTTPD_DEFAULT_CONFIG();cfg.stack_size=6144;cfg.recv_wait_timeout=5;cfg.lru_purge_enable=true;
    if(httpd_start(&portal,&cfg)!=ESP_OK){close_portal();message("Wi-Fi setup could not start");return;}
    httpd_uri_t get={.uri="/",.method=HTTP_GET,.handler=portal_get};
    httpd_uri_t post={.uri="/wifi",.method=HTTP_POST,.handler=portal_post};
    ESP_ERROR_CHECK(httpd_register_uri_handler(portal,&get));ESP_ERROR_CHECK(httpd_register_uri_handler(portal,&post));
    xSemaphoreTake(lock,portMAX_DELAY);status.setup=true;strlcpy(status.ap_name,ap_name,sizeof(status.ap_name));strlcpy(status.ap_password,ap_pass,sizeof(status.ap_password));xSemaphoreGive(lock);
    portal_until=esp_timer_get_time()+600000000LL;message("Phone: join setup Wi-Fi, open 192.168.4.1");
}
static const char *json_string(cJSON *root,const char *name) {cJSON *v=cJSON_GetObjectItemCaseSensitive(root,name);return cJSON_IsString(v)?v->valuestring:NULL;}
static esp_http_client_handle_t https_open(const char *url) {
    // GitHub redirects assets to signed URLs longer than the default 512-byte
    // transmit buffer. The receive buffer does not change this request limit.
    esp_http_client_config_t cfg={.url=url,.crt_bundle_attach=esp_crt_bundle_attach,.timeout_ms=12000,.buffer_size=4096,.buffer_size_tx=4096,.max_redirection_count=5,.user_agent="ASCII-Genesis-147"};
    esp_http_client_handle_t h=esp_http_client_init(&cfg);if(!h)return NULL;
    // esp_http_client_perform follows HTTPS redirects; streaming reads below need explicit handling.
    for(int redirects=0;redirects<=5;redirects++) {
        if(esp_http_client_open(h,0)!=ESP_OK)break;
        if(esp_http_client_fetch_headers(h)<0)break;
        int code=esp_http_client_get_status_code(h);
        if(code==200)return h;
        if(code!=301&&code!=302&&code!=303&&code!=307&&code!=308)break;
        if(esp_http_client_set_redirection(h)!=ESP_OK)break;
        if(esp_http_client_get_transport_type(h)!=HTTP_TRANSPORT_OVER_SSL)break;
        esp_http_client_close(h);
    }
    esp_http_client_cleanup(h);return NULL;
}
static void check_update(void) {
    net_status_t s;network_status(&s);
    if(!s.online){message("Offline - aquarium keeps running");return;}
    if(time(NULL)<1704067200 && esp_netif_sntp_sync_wait(pdMS_TO_TICKS(10000))!=ESP_OK){message("Clock not ready - try updates again shortly");return;}
    xSemaphoreTake(lock,portMAX_DELAY);status.available=false;status.busy=true;xSemaphoreGive(lock);
    message("Checking ESP32 updates...");memset(&candidate,0,sizeof(candidate));
    esp_http_client_handle_t h=https_open(CHANNEL_URL);char body[2048];int used=0;bool complete=false,connected=h!=NULL;
    if(h) {
        while(used<(int)sizeof(body)-1) {int n=esp_http_client_read(h,body+used,sizeof(body)-1-used);if(n<0)break;if(n==0){complete=esp_http_client_is_complete_data_received(h);break;}used+=n;}
        esp_http_client_cleanup(h);
    }
    body[used]=0;cJSON *root=complete?cJSON_Parse(body):NULL;
    const char *version=json_string(root,"version"),*board=json_string(root,"board"),*url=json_string(root,"url"),*sha=json_string(root,"sha256");
    cJSON *size=cJSON_GetObjectItemCaseSensitive(root,"size");
    if(!connected)message("Update server connection failed - try again");
    else if(!complete)message("Update download incomplete - try again");
    else if(!root)message("Update server returned invalid data");
    else if(root && cJSON_IsNumber(size) && size->valuedouble>=256 && size->valuedouble<=MAX_FIRMWARE_SIZE
       && size->valuedouble==(uint32_t)size->valuedouble
       && valid_manifest_identity(board,version,url,sha,(uint32_t)size->valuedouble)) {
        ESP_LOGI("updates","Manifest received: v%s, %lu bytes",version,(unsigned long)size->valuedouble);
        if(newer_version(version,esp_app_get_description()->version)){
            strlcpy(candidate.version,version,sizeof(candidate.version));strlcpy(candidate.url,url,sizeof(candidate.url));strlcpy(candidate.sha,sha,sizeof(candidate.sha));candidate.size=(uint32_t)size->valuedouble;
            xSemaphoreTake(lock,portMAX_DELAY);status.available=true;strlcpy(status.version,version,sizeof(status.version));xSemaphoreGive(lock);message("Update ready - tap Install to restart");
        }else message("You have the current version");
    } else message("No compatible release available");
    cJSON_Delete(root);xSemaphoreTake(lock,portMAX_DELAY);status.busy=false;xSemaphoreGive(lock);
}
static void install_update(void) {
    net_status_t s;network_status(&s);
    if(!s.available||!s.online||!valid_manifest(BOARD_ID,candidate.version,candidate.url,candidate.sha,candidate.size,esp_app_get_description()->version)) {message("Check for an update while online first");return;}
    xSemaphoreTake(lock,portMAX_DELAY);status.busy=true;status.progress=0;xSemaphoreGive(lock);
    message("Downloading - keep power connected");
    const esp_partition_t *part=esp_ota_get_next_update_partition(NULL);
    esp_http_client_handle_t h=https_open(candidate.url);esp_ota_handle_t ota=0;bool begun=false,okay=false;
    mbedtls_sha256_context hash;mbedtls_sha256_init(&hash);
    uint32_t received=0;unsigned char digest[32];char hex[65];uint8_t chunk[4096];
    if(!h||!part||candidate.size>part->size)goto done;
    if(esp_http_client_get_content_length(h)!=(int64_t)candidate.size)goto done;
    if(esp_ota_begin(part,candidate.size,&ota)!=ESP_OK)goto done;
    begun=true;
    if(mbedtls_sha256_starts(&hash,0)!=0)goto done;
    while(received<candidate.size) {
        int n=esp_http_client_read(h,(char*)chunk,sizeof(chunk));
        if(n<=0||(uint32_t)n>candidate.size-received)goto done;
        if(mbedtls_sha256_update(&hash,chunk,n)!=0||esp_ota_write(ota,chunk,n)!=ESP_OK)goto done;
        received+=n;xSemaphoreTake(lock,portMAX_DELAY);status.progress=(int)(received*100ULL/candidate.size);xSemaphoreGive(lock);
        vTaskDelay(1);
    }
    if(mbedtls_sha256_finish(&hash,digest)!=0)goto done;
    for(int i=0;i<32;i++)snprintf(hex+i*2,3,"%02x",digest[i]);
    if(strcmp(hex,candidate.sha))goto done;
    {esp_err_t err=esp_ota_end(ota);begun=false;if(err!=ESP_OK)goto done;}
    // Validate embedded version and project identity too, before changing the boot slot.
    esp_app_desc_t app;
    if(esp_ota_get_partition_description(part,&app)!=ESP_OK||strcmp(app.version,candidate.version)||strcmp(app.project_name,"ascii_genesis_147"))goto done;
    if(esp_ota_set_boot_partition(part)!=ESP_OK)goto done;
    okay=true;
done:
    if(begun)esp_ota_abort(ota);
    if(h)esp_http_client_cleanup(h);
    mbedtls_sha256_free(&hash);
    if(okay){message("Verified - restarting aquarium");vTaskDelay(pdMS_TO_TICKS(1500));esp_restart();}
    message("Update failed - current version kept");xSemaphoreTake(lock,portMAX_DELAY);status.busy=false;status.progress=0;xSemaphoreGive(lock);
}
static void network_task(void *arg) {
    (void)arg;connect_saved();int64_t next_check=esp_timer_get_time()+45000000LL,next_connect=0;
    while(true) {
        net_command_t cmd;
        if(xQueueReceive(commands,&cmd,pdMS_TO_TICKS(250))) {
            switch(cmd){case NET_SETUP:open_portal();break;case NET_CLOSE_SETUP:close_portal();break;case NET_CHECK:check_update();break;case NET_INSTALL:install_update();break;}
        }
        bool pending;
        xSemaphoreTake(lock,portMAX_DELAY);pending=credentials_pending;credentials_pending=false;
        if(pending){strlcpy(ssid,pending_ssid,sizeof(ssid));strlcpy(password,pending_password,sizeof(password));memset(pending_password,0,sizeof(pending_password));}
        xSemaphoreGive(lock);
        if(pending) {
            nvs_handle_t nvs;esp_err_t err=nvs_open("wifi147",NVS_READWRITE,&nvs);
            if(err==ESP_OK){err=nvs_set_str(nvs,"ssid",ssid);if(err==ESP_OK)err=nvs_set_str(nvs,"password",password);if(err==ESP_OK)err=nvs_commit(nvs);nvs_close(nvs);}
            if(err==ESP_OK){vTaskDelay(pdMS_TO_TICKS(1500));close_portal();message("Connecting to home Wi-Fi...");connect_saved();}
            else message("Could not save Wi-Fi - try setup again");
        }
        int64_t now=esp_timer_get_time();net_status_t s;network_status(&s);
        if(s.setup&&now>portal_until){close_portal();message("Setup timed out - aquarium stays offline-ready");}
        if(!s.online&&ssid[0]&&now>next_connect){esp_wifi_connect();next_connect=now+15000000LL;}
        if(s.online&&now>next_check&&!s.setup){check_update();next_check=now+86400000000LL;}
    }
}
void network_start(void) {
    lock=xSemaphoreCreateMutex();commands=xQueueCreate(4,sizeof(net_command_t));assert(lock&&commands);
    message("Offline aquarium ready");
    nvs_handle_t nvs;if(nvs_open("wifi147",NVS_READONLY,&nvs)==ESP_OK){size_t n=sizeof(ssid);nvs_get_str(nvs,"ssid",ssid,&n);n=sizeof(password);nvs_get_str(nvs,"password",password,&n);nvs_close(nvs);}
    ESP_ERROR_CHECK(esp_netif_init());ESP_ERROR_CHECK(esp_event_loop_create_default());
    esp_netif_create_default_wifi_sta();esp_netif_create_default_wifi_ap();
    wifi_init_config_t cfg=WIFI_INIT_CONFIG_DEFAULT();ESP_ERROR_CHECK(esp_wifi_init(&cfg));
    ESP_ERROR_CHECK(esp_event_handler_register(WIFI_EVENT,ESP_EVENT_ANY_ID,wifi_event,NULL));ESP_ERROR_CHECK(esp_event_handler_register(IP_EVENT,IP_EVENT_STA_GOT_IP,wifi_event,NULL));
    ESP_ERROR_CHECK(esp_wifi_set_storage(WIFI_STORAGE_RAM));ESP_ERROR_CHECK(esp_wifi_set_mode(WIFI_MODE_STA));ESP_ERROR_CHECK(esp_wifi_start());
    esp_sntp_config_t clock_config=ESP_NETIF_SNTP_DEFAULT_CONFIG("pool.ntp.org");ESP_ERROR_CHECK(esp_netif_sntp_init(&clock_config));
    if(xTaskCreate(network_task,"wifi_updates",16384,NULL,3,NULL)!=pdPASS)ESP_ERROR_CHECK(ESP_ERR_NO_MEM);
}
