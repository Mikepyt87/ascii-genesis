#include <assert.h>
#include <stdio.h>
#include "../firmware/main/touch_packet.h"
static void packet(uint8_t data[14],int x,int y) {
    data[1]=1;data[2]=(x>>8)&15;data[3]=x&255;data[4]=(y>>8)&15;data[5]=y&255;
}
int main(void) {
    uint8_t data[14]={0};int x=-1,y=-1;
    assert(!touch_packet_decode(data,14,&x,&y));
    data[1]=0x10;assert(!touch_packet_decode(data,14,&x,&y));
    const int corners[4][2]={{0,0},{171,0},{0,319},{171,319}};
    for(int i=0;i<4;i++){
        packet(data,corners[i][0],corners[i][1]);
        assert(touch_packet_decode(data,14,&x,&y));
        assert(x==corners[i][1]&&y==corners[i][0]);
    }
    packet(data,155,265);data[1]=0x81;data[2]|=0x80;
    assert(touch_packet_decode(data,14,&x,&y)&&x==265&&y==155);
    packet(data,172,100);assert(!touch_packet_decode(data,14,&x,&y));
    packet(data,100,320);assert(!touch_packet_decode(data,14,&x,&y));
    packet(data,100,100);assert(!touch_packet_decode(data,5,&x,&y));
    assert(!touch_packet_decode(NULL,14,&x,&y));
    puts("PASS: AXS5106L landscape corners, button coordinates, count flags, release and invalid packets");
}
