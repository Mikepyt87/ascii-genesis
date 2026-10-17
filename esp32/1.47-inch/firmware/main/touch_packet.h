// SPDX-License-Identifier: GPL-3.0-or-later
#pragma once
#include <stdbool.h>
#include <stddef.h>
#include <stdint.h>

// AXS5106L packet starting at register 0x01; Waveshare's 90-degree mapping.
static inline bool touch_packet_decode(const uint8_t *data, size_t length, int *x, int *y) {
    if (!data || length < 14 || !x || !y || (data[1] & 0x0f) == 0) return false;
    int raw_x = ((data[2] & 0x0f) << 8) | data[3];
    int raw_y = ((data[4] & 0x0f) << 8) | data[5];
    if (raw_x >= 172 || raw_y >= 320) return false;
    *x = raw_y;
    *y = raw_x;
    return true;
}
