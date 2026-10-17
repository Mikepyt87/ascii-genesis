// SPDX-License-Identifier: GPL-3.0-or-later
#pragma once
#include <stdbool.h>
#include <stdint.h>
#include <stdio.h>
#include <string.h>
#define BOARD_ID "waveshare-esp32-s3-touch-lcd-1.47"
#define RELEASE_PREFIX "https://github.com/Mikepyt87/ascii-genesis/releases/download/esp32-147-v"
#define CHANNEL_URL "https://github.com/Mikepyt87/ascii-genesis/releases/download/esp32-147-stable/manifest.json"
#define MAX_FIRMWARE_SIZE 0x600000u

static inline bool version_parts(const char *s, unsigned v[3]) {
    char tail;
    if (!s || strlen(s) > 23 || sscanf(s, "%u.%u.%u%c", &v[0], &v[1], &v[2], &tail) != 3) return false;
    for (const char *p=s; *p; ++p) if ((*p<'0'||*p>'9') && *p!='.') return false;
    return v[0] <= 65535 && v[1] <= 65535 && v[2] <= 65535;
}
static inline bool newer_version(const char *candidate, const char *current) {
    unsigned a[3], b[3]; if (!version_parts(candidate,a) || !version_parts(current,b)) return false;
    for (int i=0;i<3;++i) if(a[i]!=b[i]) return a[i]>b[i];
    return false;
}
static inline bool valid_manifest(const char *board, const char *version, const char *url,
                                  const char *sha, uint32_t size, const char *current) {
    if (!board||!url||!sha || strcmp(board,BOARD_ID) || !newer_version(version,current)
        || size < 256 || size > MAX_FIRMWARE_SIZE || strlen(sha)!=64) return false;
    for(int i=0;i<64;++i) if(!((sha[i]>='0'&&sha[i]<='9')||(sha[i]>='a'&&sha[i]<='f'))) return false;
    char expected[256];
    snprintf(expected,sizeof(expected),RELEASE_PREFIX "%s/ascii-genesis-147.bin",version);
    return strcmp(url,expected)==0;
}
