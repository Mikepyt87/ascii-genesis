// SPDX-License-Identifier: GPL-3.0-or-later
#include "board.h"
#include "touch_packet.h"
#include <string.h>
#include "freertos/FreeRTOS.h"
#include "freertos/semphr.h"
#include "freertos/task.h"
#include "driver/gpio.h"
#include "driver/spi_master.h"
#include "driver/i2c_master.h"
#include "esp_heap_caps.h"
#include "esp_log.h"
#include "esp_lcd_panel_io.h"
#include "esp_lcd_panel_ops.h"
#include "esp_lcd_jd9853.h"
static esp_lcd_panel_handle_t panel;
static i2c_master_dev_handle_t touch;
static SemaphoreHandle_t sent;
static uint16_t *transfer;
static bool transfer_done(esp_lcd_panel_io_handle_t io,esp_lcd_panel_io_event_data_t *event,void *user) {
    (void)io;(void)event;(void)user;BaseType_t wake=pdFALSE;xSemaphoreGiveFromISR(sent,&wake);return wake==pdTRUE;
}
void board_init(void) {
    sent=xSemaphoreCreateBinary();assert(sent);
    transfer=heap_caps_malloc(320*8*2,MALLOC_CAP_DMA|MALLOC_CAP_INTERNAL);assert(transfer);
    spi_bus_config_t bus={.sclk_io_num=38,.mosi_io_num=39,.miso_io_num=-1,.quadwp_io_num=-1,.quadhd_io_num=-1,.max_transfer_sz=320*8*2};
    ESP_ERROR_CHECK(spi_bus_initialize(SPI2_HOST,&bus,SPI_DMA_CH_AUTO));
    esp_lcd_panel_io_handle_t io;
    esp_lcd_panel_io_spi_config_t cfg={.cs_gpio_num=21,.dc_gpio_num=45,.spi_mode=0,.pclk_hz=40000000,.trans_queue_depth=1,.on_color_trans_done=transfer_done,.lcd_cmd_bits=8,.lcd_param_bits=8};
    ESP_ERROR_CHECK(esp_lcd_new_panel_io_spi((esp_lcd_spi_bus_handle_t)SPI2_HOST,&cfg,&io));
    esp_lcd_panel_dev_config_t dev={.reset_gpio_num=40,.rgb_ele_order=LCD_RGB_ELEMENT_ORDER_RGB,.bits_per_pixel=16};
    ESP_ERROR_CHECK(esp_lcd_new_panel_jd9853(io,&dev,&panel));ESP_ERROR_CHECK(esp_lcd_panel_reset(panel));ESP_ERROR_CHECK(esp_lcd_panel_init(panel));
    ESP_ERROR_CHECK(esp_lcd_panel_invert_color(panel,true));
    ESP_ERROR_CHECK(esp_lcd_panel_swap_xy(panel,true));ESP_ERROR_CHECK(esp_lcd_panel_mirror(panel,true,false));ESP_ERROR_CHECK(esp_lcd_panel_set_gap(panel,0,34));
    ESP_ERROR_CHECK(esp_lcd_panel_disp_on_off(panel,true));gpio_set_direction(46,GPIO_MODE_OUTPUT);gpio_set_level(46,1);
    gpio_set_direction(47,GPIO_MODE_OUTPUT);gpio_set_level(47,0);vTaskDelay(pdMS_TO_TICKS(200));gpio_set_level(47,1);vTaskDelay(pdMS_TO_TICKS(300));
    i2c_master_bus_config_t ic={.i2c_port=I2C_NUM_0,.sda_io_num=42,.scl_io_num=41,.clk_source=I2C_CLK_SRC_DEFAULT,.glitch_ignore_cnt=7,.flags.enable_internal_pullup=true};
    i2c_master_bus_handle_t ib;ESP_ERROR_CHECK(i2c_new_master_bus(&ic,&ib));
    i2c_device_config_t td={.dev_addr_length=I2C_ADDR_BIT_LEN_7,.device_address=0x63,.scl_speed_hz=400000};ESP_ERROR_CHECK(i2c_master_bus_add_device(ib,&td,&touch));
    ESP_ERROR_CHECK(i2c_master_probe(ib,0x63,100));
    gpio_set_direction(48,GPIO_MODE_INPUT);
    ESP_LOGI("touch", "AXS5106L ready: SDA42 SCL41, landscape 320x172");
}
void board_frame(const uint16_t *pixels) {
    for(int y=0;y<172;y+=8) {
        int rows=172-y<8?172-y:8;
        for(int i=0;i<320*rows;i++){uint16_t p=pixels[y*320+i];transfer[i]=(p>>8)|(p<<8);}
        ESP_ERROR_CHECK(esp_lcd_panel_draw_bitmap(panel,0,y,320,y+rows,transfer));
        if(xSemaphoreTake(sent,pdMS_TO_TICKS(1000))!=pdTRUE)ESP_ERROR_CHECK(ESP_ERR_TIMEOUT);
    }
}
bool board_touch(int *x,int *y) {
    static bool was_pressed;
    static uint32_t last_warning;
    uint8_t reg=1,data[14]={0};
    // Match Waveshare: STOP after selecting the register, then a separate read.
    esp_err_t err=i2c_master_transmit(touch,&reg,1,100);
    if(err==ESP_OK)err=i2c_master_receive(touch,data,sizeof(data),100);
    if(err!=ESP_OK){
        uint32_t now=esp_log_timestamp();
        if(now-last_warning>=5000){ESP_LOGW("touch","Read failed: %s",esp_err_to_name(err));last_warning=now;}
        was_pressed=false;
        return false;
    }
    bool pressed=touch_packet_decode(data,sizeof(data),x,y);
    if(pressed&&!was_pressed)ESP_LOGI("touch","Press x=%d y=%d",*x,*y);
    was_pressed=pressed;
    return pressed;
}
