// SPDX-License-Identifier: GPL-3.0-or-later
#pragma once
#include <stdbool.h>
#include <stdint.h>
void board_init(void);
void board_frame(const uint16_t *pixels);
bool board_touch(int *x,int *y);
