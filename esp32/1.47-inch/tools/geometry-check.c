#include <assert.h>
#include <stdio.h>
#include "../firmware/main/ocean_geometry.h"
#include "../firmware/main/assets.h"
int main(void){
    assert((mini_font['_'*5]&0x40)!=0);
    assert(mini_bands_clear(23,24,55,40));
    assert(mini_bands_clear(55,40,103,40));
    assert(!mini_bands_clear(20,40,40,40));
    assert(!mini_band_fits(17,140));
    assert(!mini_band_fits(10,24));
    for(int i=0;i<54;i++){
        int h=mini_sprites[i].height*8;bool can_enter=false;
        for(int y=MINI_SWIM_TOP;mini_band_fits(y,h);y++)can_enter=true;
        assert(can_enter);
    }
    for(int world=-500;world<10000;world+=7){
        int ground=mini_ground_y(world);
        assert(ground>=149&&ground<=155);
        assert(ground+8<=172-MINI_SAFE_Y);
        assert(mini_screen_x(world,246)==mini_screen_x(world,240)-6);
    }
    for(int y=0;y<172;y++)for(int x=0;x<320;x++)if(mini_content_pixel(x,y)){
        float cx=fminf(fmaxf(x+0.5f,24),296),cy=fminf(fmaxf(y+0.5f,24),148);
        float dx=x+0.5f-cx,dy=y+0.5f-cy;
        assert(dx*dx+dy*dy<=24*24);
    }
    assert(!mini_content_pixel(5,2));
    assert(mini_content_pixel(20,8));
    puts("PASS: native creature clearances, sprite heights, terrain, camera and rounded-panel safe area");
}
