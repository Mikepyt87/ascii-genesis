#include <assert.h>
#include <stdio.h>
#include "../firmware/main/portal_access.h"
int main(void) {
    uint32_t ap=htonl(0xc0a80401);
    struct sockaddr_storage local={0};
    struct sockaddr_in v4={.sin_family=AF_INET,.sin_addr={.s_addr=ap}};
    memcpy(&local,&v4,sizeof(v4));
    assert(portal_address_matches(&local,sizeof(v4),ap));
    assert(!portal_address_matches(&local,sizeof(v4),htonl(0xc0a80101)));
    assert(!portal_address_matches(&local,sizeof(v4)-1,ap));
    struct sockaddr_in6 v6={.sin6_family=AF_INET6};
    uint8_t *bytes=(uint8_t *)&v6.sin6_addr;
    bytes[10]=bytes[11]=0xff;memcpy(bytes+12,&ap,4);
    memset(&local,0,sizeof(local));memcpy(&local,&v6,sizeof(v6));
    assert(portal_address_matches(&local,sizeof(v6),ap));
    assert(!portal_address_matches(&local,sizeof(v6),htonl(0xc0a80101)));
    assert(!portal_address_matches(&local,sizeof(v6)-1,ap));
    bytes[0]=0x20;memcpy(&local,&v6,sizeof(v6));
    assert(!portal_address_matches(&local,sizeof(v6),ap));
    memset(&local,0,sizeof(local));
    assert(!portal_address_matches(&local,sizeof(local),ap));
    assert(!portal_address_matches(&local,0,ap));
    assert(!portal_address_matches(&local,sizeof(local),0));
    puts("PASS: setup IPv4 and mapped IPv6 accepted; home interface, native IPv6 and truncated addresses rejected");
}
