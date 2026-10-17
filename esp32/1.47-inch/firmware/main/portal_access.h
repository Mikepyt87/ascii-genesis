// SPDX-License-Identifier: GPL-3.0-or-later
#pragma once
#include <stdbool.h>
#include <stdint.h>
#include <string.h>
#ifdef ESP_PLATFORM
#include "lwip/sockets.h"
#else
#include <sys/socket.h>
#include <netinet/in.h>
#endif

// ESP-IDF's dual-stack HTTP server can report IPv4 connections as IPv6 mapped
// addresses. Keep the interface restriction for both representations.
static inline bool portal_address_matches(const struct sockaddr_storage *local,
                                         socklen_t len, uint32_t ap_address) {
    if (!ap_address || len < sizeof(struct sockaddr)) return false;
    if (local->ss_family == AF_INET && len >= sizeof(struct sockaddr_in)) {
        struct sockaddr_in address;
        memcpy(&address, local, sizeof(address));
        return address.sin_addr.s_addr == ap_address;
    }
#if !defined(ESP_PLATFORM) || CONFIG_LWIP_IPV6
    if (local->ss_family == AF_INET6 && len >= sizeof(struct sockaddr_in6)) {
        struct sockaddr_in6 address;
        static const uint8_t mapped[12] = {0,0,0,0,0,0,0,0,0,0,0xff,0xff};
        memcpy(&address, local, sizeof(address));
        const uint8_t *bytes = (const uint8_t *)&address.sin6_addr;
        return !memcmp(bytes, mapped, sizeof(mapped)) && !memcmp(bytes + 12, &ap_address, 4);
    }
#endif
    return false;
}
