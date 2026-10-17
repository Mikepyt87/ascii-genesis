/* Browser simulation of Wi-Fi provisioning and OTA. No network requests or real credentials.
 * SPDX-License-Identifier: GPL-3.0-or-later
 */
(function(root){
  class MiniNetwork {
    constructor(){this.screen='ocean';this.online=false;this.version='0.1.0';this.previous='0.1.0';this.available=false;this.phase='idle';this.progress=0;this.timer=0;this.message='Offline aquarium ready';this.scenario='success';}
    get busy(){return ['checking','download','boot','rollback'].includes(this.phase);}
    setScenario(value){if(this.busy||!['success','bad-download','bad-boot'].includes(value))return;this.scenario=value;this.version='0.1.0';this.previous='0.1.0';this.available=false;this.message='Test selected - check for updates';}
    open(){if(this.screen==='ocean')this.screen='settings';}
    setup(){if(this.busy)return;this.screen='setup';this.phase='setup';this.timer=0;this.message='Phone setup active';}
    connect(){if(this.phase!=='setup')return;this.online=true;this.screen='settings';this.phase='idle';this.timer=0;this.message='Connected to demo home Wi-Fi';}
    check(){if(this.busy)return;if(!this.online){this.message='Offline - aquarium keeps running';return;}this.available=false;this.phase='checking';this.timer=0;this.message='Checking ESP32 updates...';}
    install(){if(this.busy||!this.available||!this.online)return;this.previous=this.version;this.phase='download';this.progress=0;this.timer=0;this.message='Downloading - keep power connected';}
    action(x,y){
      if(y>=140){this.screen='ocean';if(this.phase==='setup')this.phase='idle';return;}
      if(this.screen==='settings'&&!this.busy){if(y>=58&&y<90)this.setup();else if(y>=98&&y<130){if(this.available)this.install();else this.check();}}
    }
    step(dt){
      this.timer+=Math.max(0,dt);
      if(this.phase==='setup'&&this.timer>=600){this.phase='idle';this.screen='settings';this.message='Setup timed out - aquarium stays ready';}
      else if(this.phase==='checking'&&this.timer>=2){this.phase='idle';this.available=this.version!=='0.2.0';this.message=this.available?'Update ready - tap Install to restart':'You have the current version';}
      else if(this.phase==='download'){
        this.progress=Math.min(100,Math.floor(this.timer/4*100));
        if(this.timer>=4){this.timer=0;
          if(this.scenario==='bad-download'){this.phase='idle';this.message='Update failed - current version kept';}
          else {this.phase='boot';this.message='Verified - restarting aquarium';}}
      }
      else if(this.phase==='boot'&&this.timer>=2){this.timer=0;
        if(this.scenario==='bad-boot'){this.phase='rollback';this.message='Boot failed - restoring previous version';}
        else {this.version='0.2.0';this.phase='idle';this.available=false;this.message='Update complete - aquarium ready';}}
      else if(this.phase==='rollback'&&this.timer>=2){this.version=this.previous;this.phase='idle';this.message='Previous version restored';}
    }
  }
  function draw(ctx,net,font){
    function text(s,x,y,color='#bde9e6',scale=1){ctx.fillStyle=color;for(let i=0;i<s.length;i++)for(let col=0;col<5;col++){const bits=font[s.charCodeAt(i)*5+col]||0;for(let row=0;row<8;row++)if(bits&(1<<row))ctx.fillRect(x+(i*6+col)*scale,y+row*scale,scale,scale);}}
    ctx.fillStyle='#020c14';ctx.fillRect(0,0,320,172);
    if(net.screen==='setup'){
      text('CONNECT WITH YOUR PHONE',8,6);text('Join this Wi-Fi network:',8,24);text('ASCII-Genesis-Mini-DEMO',8,40,'#73c9ff',2);
      text('Demo password:',8,64);text('preview-only',8,78,'#73c9ff',2);text('Open http://192.168.4.1',8,108);text('Setup closes after 10 minutes',8,124);
    }else{
      text('SETTINGS',8,6);text('v'+net.version+'  '+(net.online?'Wi-Fi online':'Offline'),8,22,'#73c9ff');text(net.message,8,38);
      ctx.fillStyle='#102631';ctx.fillRect(0,58,320,32);text('SET UP WI-FI WITH PHONE',10,70);
      ctx.fillStyle='#102631';ctx.fillRect(0,98,320,32);
      text(net.busy?'PLEASE WAIT  '+net.progress+'%':net.available?'INSTALL v0.2.0 & RESTART':'CHECK FOR UPDATES',10,110);
    }
    ctx.fillStyle='#102631';ctx.fillRect(0,140,320,32);text('BACK TO OCEAN',118,153);
  }
  root.MiniNetwork={MiniNetwork,draw};
})(globalThis);
