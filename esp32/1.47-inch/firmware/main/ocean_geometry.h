// SPDX-License-Identifier: GPL-3.0-or-later
#pragma once
#include <stdbool.h>
#include <math.h>
#define MINI_BOB 2
#define MINI_GAP 4
#define MINI_SWIM_TOP 23
#define MINI_SCROLL_SPEED 3.6f
#define MINI_SWIM_BOTTOM 145
// Conservative inset for the panel's rounded corners, estimated from the board photo.
#define MINI_SAFE_X 12
#define MINI_SAFE_Y 8
static inline bool mini_content_pixel(int x,int y) {return x>=MINI_SAFE_X&&x<320-MINI_SAFE_X&&y>=MINI_SAFE_Y&&y<172-MINI_SAFE_Y;}
static inline int mini_ground_y(float world_x) {return 152+(int)floorf(sinf(world_x/42.0f)*3+0.5f);}
static inline int mini_screen_x(float world_x,float scroll) {return (int)floorf(world_x-scroll+0.5f);}
static inline bool mini_band_fits(int y,int height) {return y>=MINI_SWIM_TOP&&y+height+MINI_BOB<=MINI_SWIM_BOTTOM;}
static inline bool mini_bands_clear(float y,int height,float other_y,int other_height) {
    return y+height+MINI_BOB+MINI_GAP<=other_y-MINI_BOB || other_y+other_height+MINI_BOB+MINI_GAP<=y-MINI_BOB;
}
