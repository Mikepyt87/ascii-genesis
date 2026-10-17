// SPDX-License-Identifier: GPL-3.0-or-later
#pragma once
#include <stdbool.h>
#include <stdint.h>
typedef enum { NET_SETUP, NET_CHECK, NET_INSTALL, NET_CLOSE_SETUP } net_command_t;
typedef struct {
    bool online, setup, busy, available;
    int progress;
    char message[54], version[24], ssid[33], ap_name[33], ap_password[17];
} net_status_t;
void network_start(void);
void network_command(net_command_t command);
void network_status(net_status_t *out);
