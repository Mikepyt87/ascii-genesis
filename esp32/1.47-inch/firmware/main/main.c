// SPDX-License-Identifier: GPL-3.0-or-later
#include <math.h>
#include <stdio.h>
#include <string.h>
#include "freertos/FreeRTOS.h"
#include "freertos/task.h"
#include "esp_app_desc.h"
#include "esp_heap_caps.h"
#include "esp_ota_ops.h"
#include "esp_psram.h"
#include "esp_random.h"
#include "esp_task_wdt.h"
#include "esp_timer.h"
#include "nvs_flash.h"
#include "board.h"
#include "network.h"
#include "assets.h"
#include "ocean_geometry.h"
static uint16_t *fb;
static float time_s,controls_until=8;
static bool paused;
static int screen; // 0 ocean, 1 settings, 2 phone setup
typedef struct {int art,dir;float x,y,speed,phase;bool active;} swimmer_t;
static swimmer_t fish[3];
static int pending_art=-1,pending_dir;
static float bubble_x[4],bubble_y[4];
static uint16_t rgb(unsigned c){return ((c>>8)&0xf800)|((c>>5)&0x07e0)|((c>>3)&31);}
static void pixel(int x,int y,uint16_t c){if(x>=0&&x<320&&y>=0&&y<172)fb[y*320+x]=c;}
static void rect(int x,int y,int w,int h,uint16_t c){for(int j=y;j<y+h;j++)for(int i=x;i<x+w;i++)pixel(i,j,c);}
static void glyph(char ch,int x,int y,uint16_t c){unsigned n=(unsigned char)ch;if(n<32||n>126)return;for(int col=0;col<5;col++)for(int row=0;row<8;row++)if(mini_font[n*5+col]&(1<<row))pixel(x+col,y+row,c);}
static void text(const char *s,int x,int y,uint16_t c){for(int i=0;s[i]&&x+i*6<320;i++)glyph(s[i],x+i*6,y,c);}
static void text_large(const char *s,int x,int y,uint16_t c){
    for(int i=0;s[i]&&x+i*12<320;i++){unsigned n=(unsigned char)s[i];if(n<32||n>126)continue;
        for(int col=0;col<5;col++)for(int row=0;row<8;row++)if(mini_font[n*5+col]&(1<<row))rect(x+i*12+col*2,y+row*2,2,2,c);}
}
static float rnd(void){return (float)(esp_random()&65535)/65536.0f;}
static void spawn(int slot,int index,int dir,float x,float y){fish[slot]=(swimmer_t){.art=(index&~1)+(dir<0),.dir=dir,.x=x,.y=y,.speed=3+rnd()*3,.phase=rnd()*6.28f,.active=true};}
static void new_world(void){time_s=0;pending_art=-1;spawn(0,6,1,28,20);spawn(1,2,-1,156,56);spawn(2,38,-1,180,108);for(int i=0;i<4;i++){bubble_x[i]=20+rnd()*280;bubble_y[i]=20+rnd()*135;}paused=false;}
static int free_y(int height){
    int chosen=-1,count=0;
    for(int y=17;mini_band_fits(y,height);y++){
        bool clear=true;
        for(int i=0;i<3;i++)if(fish[i].active&&!mini_bands_clear(y,height,fish[i].y,mini_sprites[fish[i].art].height*8)){clear=false;break;}
        if(clear&&esp_random()%(++count)==0)chosen=y;
    }
    return chosen;
}
static void simulate(float dt){
    if(paused)return;
    time_s+=dt;
    for(int i=0;i<3;i++){
        swimmer_t *f=&fish[i];if(!f->active)continue;f->x+=f->dir*f->speed*dt;const mini_sprite_t *s=&mini_sprites[f->art];
        if(f->x>328||f->x+s->width*6<-8)f->active=false;
    }
    for(int i=0;i<3;i++)if(!fish[i].active){
        if(pending_art<0){pending_art=(esp_random()%27)*2;pending_dir=rnd()<.5f?-1:1;}
        const mini_sprite_t *a=&mini_sprites[pending_art];int y=free_y(a->height*8);
        if(y>=0){spawn(i,pending_art,pending_dir,pending_dir>0?-a->width*6-2:322,y);pending_art=-1;}
        break;
    }
    for(int i=0;i<4;i++){bubble_y[i]-=dt*5;if(bubble_y[i]<16){bubble_y[i]=158;bubble_x[i]=15+rnd()*290;}}
}
static void draw_ocean(bool controls){
    const uint16_t pale=rgb(0xbde9e6),muted=rgb(0x54858d),sand=rgb(0x80715a);
    for(int i=0;i<320*172;i++)fb[i]=rgb(0x020c14);
    text("ASCII GENESIS - MINI",5,2,pale);
    static const char *habitats[]={"KELP MEADOW","ROCKY REEF","OPEN SAND","CORAL GARDEN","SEAGRASS BED","WRECK DEPTHS"};
    const char *habitat=habitats[((int)(time_s/45))%6];text(habitat,315-strlen(habitat)*6,2,muted);
    float scroll=time_s*1.8f;
    for(int i=(int)floorf(scroll/6)-1;i*6<scroll+326;i++){float world_x=i*6;int x=mini_screen_x(world_x,scroll),ground=mini_ground_y(world_x);glyph(i%4==0?':':'.',x,ground+1,sand);glyph('_',x,ground-6,sand);}
    for(int p=(int)floorf((scroll-22)/57)-1;p*57+22<scroll+332;p++){
        float world_x=p*57+22;int x=mini_screen_x(world_x,scroll),ground=mini_ground_y(world_x),height=2+((p%3+3)%3);
        for(int row=0;row<height;row++){int sway=row==0?0:lroundf(sinf(time_s*.7f+row+p)*2*row/(height-1));glyph(row==0?'|':row%2?')':'(',x+sway,ground-row*8-6,rgb(0x56ab91));
            if(((int)(time_s/45))%6==3&&row==1)text("\\|/",x-6,ground-14,rgb(0xcd8d99));}
    }
    if(((int)(time_s/45))%6==1||((int)(time_s/45))%6==5)for(int rock=(int)floorf((scroll-82)/233)-1;rock*233+82<scroll+320;rock++){float world_x=rock*233+82;text("/__\\",mini_screen_x(world_x,scroll),mini_ground_y(world_x)-6,muted);}
    for(int i=0;i<4;i++)glyph('o',bubble_x[i],bubble_y[i],muted);
    for(int i=0;i<3;i++){swimmer_t *f=&fish[i];if(!f->active)continue;const mini_sprite_t *s=&mini_sprites[f->art];int bob=lroundf(sinf(time_s*.55f+f->phase)*2);
        for(int r=0;r<s->height;r++)for(int col=0;s->rows[r][col];col++){char ch=s->rows[r][col];if(ch==' ')continue;int m=col<(int)strlen(s->masks[r])?s->masks[r][col]-'1':0;if(m<0||m>6)m=0;
            int y=(int)lroundf(f->y)+r*8+bob;if(y>=12)glyph(ch,lroundf(f->x)+col*6,y,rgb(s->palette[m]));}}
    if(controls){rect(0,140,320,32,rgb(0x102631));text(paused?"RESUME":"PAUSE",35,153,pale);text("NEW WORLD",130,153,pale);text("SETTINGS",244,153,pale);}
}
static void draw_settings(net_status_t *n){
    const uint16_t c=rgb(0xbde9e6),m=rgb(0x73c9ff);char line[54];
    for(int i=0;i<320*172;i++)fb[i]=rgb(0x020c14);
    if(screen==2){text("CONNECT WITH YOUR PHONE",8,6,c);if(n->setup){text("Join this Wi-Fi network:",8,24,c);text_large(n->ap_name,8,40,m);text("Password:",8,64,c);text_large(n->ap_password,8,78,m);text("Open http://192.168.4.1",8,108,c);text("Setup closes after 10 minutes",8,124,c);}else text(n->message,8,44,c);}
    else {text("SETTINGS",8,6,c);snprintf(line,sizeof(line),"v%s  %s",esp_app_get_description()->version,n->online?"Wi-Fi online":"Offline");text(line,8,22,m);text(n->message,8,38,c);
      rect(0,58,320,32,rgb(0x102631));text("SET UP WI-FI WITH PHONE",10,70,c);
      rect(0,98,320,32,rgb(0x102631));
      if(n->busy){snprintf(line,sizeof(line),"PLEASE WAIT  %d%%",n->progress);text(line,10,110,c);}
      else if(n->available){snprintf(line,sizeof(line),"INSTALL v%s & RESTART",n->version);text(line,10,110,c);}
      else text("CHECK FOR UPDATES",10,110,c);
    }
    rect(0,140,320,32,rgb(0x102631));text("BACK TO OCEAN",118,153,c);
}
void app_main(void){
    esp_err_t err=nvs_flash_init();if(err==ESP_ERR_NVS_NO_FREE_PAGES||err==ESP_ERR_NVS_NEW_VERSION_FOUND){ESP_ERROR_CHECK(nvs_flash_erase());err=nvs_flash_init();}ESP_ERROR_CHECK(err);
    fb=heap_caps_malloc(320*172*2,MALLOC_CAP_SPIRAM);assert(fb&&esp_psram_is_initialized());
    board_init();new_world();network_start();
    ESP_ERROR_CHECK(esp_task_wdt_add(NULL));
    int64_t start=esp_timer_get_time(),last=start,last_press=0;bool held=false,validated=false;
    while(true){int64_t now=esp_timer_get_time();float dt=fminf((now-last)/1000000.0f,.1f);last=now;simulate(dt);float uptime=(now-start)/1000000.0f;
        net_status_t n;network_status(&n);int x,y;bool pressed=board_touch(&x,&y);
        if(pressed&&!held&&now-last_press>350000){last_press=now;
            if(screen){if(y>=140){if(n.setup)network_command(NET_CLOSE_SETUP);screen=0;}else if(!n.busy&&screen==1){if(y>=58&&y<90){network_command(NET_SETUP);screen=2;}else if(y>=98&&y<130)network_command(n.available?NET_INSTALL:NET_CHECK);}}
            else if((uptime<controls_until||paused)&&y>=140){if(x<107)paused=!paused;else if(x<214)new_world();else screen=1;}
            controls_until=uptime+8;
        }
        held=pressed;
        if(screen)draw_settings(&n);else draw_ocean(uptime<controls_until||paused);
        board_frame(fb);ESP_ERROR_CHECK(esp_task_wdt_reset());
        // A new image is accepted only after display transfers, touch probe, PSRAM and the running loop succeed.
        if(!validated&&uptime>=30){esp_ota_img_states_t state;const esp_partition_t *p=esp_ota_get_running_partition();if(esp_ota_get_state_partition(p,&state)==ESP_OK&&state==ESP_OTA_IMG_PENDING_VERIFY)ESP_ERROR_CHECK(esp_ota_mark_app_valid_cancel_rollback());validated=true;}
        vTaskDelay(pdMS_TO_TICKS(80));
    }
}
