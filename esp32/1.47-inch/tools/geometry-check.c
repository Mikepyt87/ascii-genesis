#include <assert.h>
#include <stdio.h>
#include "../firmware/main/ocean_geometry.h"
#include "../firmware/main/assets.h"
int main(void){
    assert((mini_font['_'*5]&0x40)!=0);
    assert(mini_bands_clear(20,24,56,40));
    assert(mini_bands_clear(56,40,108,40));
    assert(!mini_bands_clear(20,40,40,40));
    assert(!mini_band_fits(17,140));
    assert(!mini_band_fits(10,24));
    for(int i=0;i<54;i++){
        int h=mini_sprites[i].height*8;bool can_enter=false;
        for(int y=17;mini_band_fits(y,h);y++)can_enter=true;
        assert(can_enter);
    }
    for(int world=-500;world<10000;world+=7){
        int ground=mini_ground_y(world);
        assert(ground>=157&&ground<=163);
        assert(mini_screen_x(world,246)==mini_screen_x(world,240)-6);
    }
    puts("PASS: native creature clearances, all sprite heights, terrain bounds and camera translation");
}
