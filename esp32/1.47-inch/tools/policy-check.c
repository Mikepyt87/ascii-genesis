#include <assert.h>
#include "../firmware/main/update_policy.h"
int main(void) {
    const char *sha="0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef";
    const char *url=RELEASE_PREFIX "0.2.0/ascii-genesis-147.bin";
    assert(valid_manifest(BOARD_ID,"0.2.0",url,sha,1000000,"0.1.0"));
    assert(!valid_manifest("raspberry-pi","0.2.0",url,sha,1000000,"0.1.0"));
    assert(!valid_manifest(BOARD_ID,"0.2.0","http://github.com/firmware",sha,1000000,"0.1.0"));
    assert(!valid_manifest(BOARD_ID,"0.2.0",url,"bad",1000000,"0.1.0"));
    assert(!valid_manifest(BOARD_ID,"0.2.0",url,sha,MAX_FIRMWARE_SIZE+1,"0.1.0"));
    assert(!valid_manifest(BOARD_ID,"0.2.0",url,sha,0,"0.1.0"));
    assert(!valid_manifest(BOARD_ID,"0.2.0",url,sha,1000000,"0.2.0"));
    assert(!valid_manifest(BOARD_ID,"0.2.0",url,sha,1000000,"1.0.0"));
    assert(!newer_version("0.2.0-beta","0.1.0"));
    assert(newer_version("0.10.0","0.9.9"));
    puts("PASS: firmware update policy, board separation, versions, HTTPS URL, size and digest format");
}
