/* Original ASCII Genesis whole-fish celebrations. GPL-3.0-or-later. */
(function(root){
 const names=['balance angelfish','steadfast marlin','spark wrasse'];
 const colors=[['#75d8ca','#c9fff0'],['#dfb96c','#fff1b8'],['#b79ae0','#ffc18a']];
 function points(kind,age,x,y,scale=1,w=120,h=40){
   if(kind<0||kind>2||age<0||age>=3)return [];
   const out=[];
   for(let i=0;i<24;i++){
     const gap=(14+age*2+3*Math.sin(i*2.4+age*(kind+1)*2))*scale;
     const hw=w/2+gap,hh=h/2+gap,perimeter=4*(hw+hh);
     let d=((i/24+age*[.025,-.02,.05][kind]+1)%1)*perimeter,dx,dy;
     if(d<2*hw){dx=-hw+d;dy=-hh;}else if((d-=2*hw)<2*hh){dx=hw;dy=-hh+d;}
     else if((d-=2*hh)<2*hw){dx=hw-d;dy=hh;}else{d-=2*hw;dx=-hw;dy=hh-d;}
     const r=8*scale,px=Math.abs(dx)-(hw-r),py=Math.abs(dy)-(hh-r);
     if(px>0&&py>0){const length=Math.hypot(px,py);dx=Math.sign(dx)*(hw-r+px*r/length);dy=Math.sign(dy)*(hh-r+py*r/length);}
     if(age>2.55&&i%2)continue;
     out.push({x:Math.round(x+dx),y:Math.round(y+dy),color:colors[kind][(i+Math.floor(age*4))%2],size:age<2.1?2:1});
   }return out;
 }
 class Tracker {
   constructor(){this.seen=new WeakSet();this.ids=new Set();this.effects=[];}
   step(items,dt,width,height){
     this.effects=this.effects.flatMap(e=>{const f=items.find(f=>f.key===e.key);return f&&e.age+dt<3?[{...e,age:e.age+dt,x:f.x+f.w/2,y:f.y+f.h/2,w:f.w,h:f.h}]:[];});
     for(const item of items){
       const kind=names.indexOf(item.name),{x,y,w,h,key}=item;
       // Wait for the full drawing, so this reads as a surrounding celebration.
       if(kind<0||x<24||x+w>width-24)continue;
       const set=typeof key==='object'?this.seen:this.ids;if(set.has(key))continue;set.add(key);
       this.effects.push({kind,key,age:0,x:x+w/2,y:y+h/2,w,h});
     }this.effects=this.effects.slice(-3);
   }
   pixels(width,height,blocked,scale=1){return this.effects.flatMap(e=>points(e.kind,e.age,e.x,e.y,scale,e.w,e.h)).filter(p=>p.x>=13&&p.x+4<width-12&&p.y>=23&&p.y+4<height-34&&!blocked.some(b=>p.x+4>=b.x-4&&p.x-2<=b.x+b.w+4&&p.y+4>=b.y-4&&p.y-2<=b.y+b.h+4));}
 }
 root.GenesisCelebrations={names,points,Tracker};
})(globalThis);

(() => {
  'use strict';
  const core=window.AquariumCore, canvas=document.getElementById('tank'), ctx=canvas.getContext('2d');
  const screenW=canvas.width, screenH=canvas.height;
  const fishArt=window.AsciiquariumSprites;
  let quiet=false;
  try{quiet=localStorage.getItem('ascii-genesis-quiet')==='true';}catch{}
  let sim, running=true, aiBusy=false;
  // Body, fins, eye, mouth, tail and gills retain the original artwork masks.
  const fishPalettes=[
    ['#e6bb72','#d9a65f','#f0cf91','#fff3d4','#d99568','#d9a65f','#e8ce9b'],
    ['#84bce7','#6097cf','#a7d2ec','#f5edcf','#d5aa83','#6097cf','#c0def0'],
    ['#d69dbe','#b87fa8','#e5bdd1','#fff1d8','#dfa685','#b87fa8','#edcedd'],
    ['#e5e0bc','#b9c6c5','#f0edce','#fff8df','#d7ae7d','#a2b7c3','#e9e4c9'],
    ['#e5a183','#cb7e70','#f0bda0','#fff2d1','#edca88','#cb7e70','#f1cbbb'],
    ['#a9c38b','#86a679','#c7d8a5','#fff3d4','#d7b576','#86a679','#d8e2be'],
    ['#b7a5df','#9184c3','#d3c3ed','#fff0db','#dba58b','#9184c3','#ded1f0'],
    ['#84ccc1','#61a79e','#afe0cd','#fff3d4','#e0b88a','#61a79e','#c5e8d8']
  ];
  function spriteColor(ch,mask,palette){
    if(mask>='1'&&mask<='7')return palette[Number(mask)-1];
    if(ch==='o'||ch==='O')return palette[3];
    if(ch==='>'||ch==='<')return palette[4];
    return palette[0];
  }
  // Rasterize each directional fish once; Pi 4 frames only composite cached sprites.
  const fishFont=Number(canvas.dataset.fishFont)||16;
  ctx.font=fishFont+'px "Courier New", monospace';
  const advance=ctx.measureText('M').width;
  let clockMode='cycle';try{clockMode=localStorage.getItem('ascii-genesis-clock')==='local'?'local':'cycle';}catch{}
  const worldOptions={art:fishArt,font:fishFont,advance,width:screenW,height:screenH,quiet,clockMode};
  sim=core.world(GenesisSeed(),fishArt.length/2,worldOptions);
  const spriteCache=fishArt.map((art,index)=>{
    const image=document.createElement('canvas');
    image.width=Math.ceil(Math.max(...art.rows.map(row=>row.length))*advance);
    image.height=art.rows.length*fishFont;
    const paint=image.getContext('2d');paint.font=ctx.font;paint.textBaseline='top';
    const palette=art.original?art.palette:fishPalettes[Math.floor(index/2)%fishPalettes.length];
    art.rows.forEach((row,y)=>[...row].forEach((ch,x)=>{
      if(ch===' ')return;
      paint.fillStyle=spriteColor(ch,art.masks[y]?.[x]||' ',palette);
      paint.fillText(ch,x*advance,y*fishFont);
    }));
    // Align the crawler's visible feet, rather than the font's transparent line padding.
    if(['shore crab','reef lobster','peacock mantis shrimp','violet octopus'].includes(art.name)&&typeof paint.getImageData==='function'){
      const pixels=paint.getImageData(0,0,image.width,image.height).data;
      let lastInk=image.height-1;
      outer:for(let y=image.height-1;y>=0;y--)for(let x=0;x<image.width;x++)if(pixels[(y*image.width+x)*4+3]){lastInk=y;break outer;}
      sim.profiles[index].footInset=image.height-1-lastInk;
    }
    return image;
  });
  // Original diver art: two gentle flipper poses, cached in both directions.
  const diverRows=[
    ['        .----.    .---.  ',
     '        |____|    |[o]|  ',
     '   _____/====\\____( _ )  ',
     ' _/    /    _____/ \\ \\__',
     '<_____/ \\__/        \\___)',
     '        \\ \\__           ',
     '         \\___>          '],
    ['        .----.    .---.  ',
     '        |____|    |[o]|  ',
     '   _____/====\\____( _ )  ',
     '  \\   /    _____/ \\ \\__',
     '   >__/ \\__/        \\___)',
     '       / /               ',
     '     <__/                ']
  ];
  const mirror={'/':'\\','\\':'/','<':'>','>':'<','(':')',')':'(','[':']',']':'['};
  const diverCache=diverRows.flatMap(rows=>{
    const width=Math.max(...rows.map(r=>r.length));
    const colors=rows.map((r,y)=>[...r.padEnd(width)].map((c,x)=>
      x>=18&&y<3?'#e6c995':y<2?'#a2b8b5':c==='>'||c==='<'?'#8bafd1':'#87abc6'));
    return [{rows,colors,width},{rows:rows.map(r=>[...r.padEnd(width)].reverse().map(c=>mirror[c]||c).join('')),
      colors:colors.map(r=>[...r].reverse()),width}];
  }).map(({rows,colors,width})=>{
    const image=document.createElement('canvas');image.width=Math.ceil(width*advance);image.height=rows.length*fishFont;
    const paint=image.getContext('2d');paint.font=ctx.font;paint.textBaseline='top';
    rows.forEach((row,y)=>[...row].forEach((c,x)=>{if(c===' ')return;paint.fillStyle=colors[y][x];paint.fillText(c,x*advance,y*fishFont);}));
    return image;
  });
  function scenerySprite(rows,color){
    const image=document.createElement('canvas');image.width=Math.ceil(Math.max(...rows.map(r=>r.length))*advance);image.height=rows.length*fishFont;
    const paint=image.getContext('2d');paint.font=ctx.font;paint.textBaseline='top';paint.fillStyle=color;
    rows.forEach((row,y)=>paint.fillText(row,0,y*fishFont));return image;
  }
  const groundGlyph=scenerySprite(['_'],'#36575a'),groundPaint=groundGlyph.getContext('2d');let groundInk=0;
  if(typeof groundPaint.getImageData==='function'){
    const pixels=groundPaint.getImageData(0,0,groundGlyph.width,groundGlyph.height).data;
    outer:for(let y=0;y<groundGlyph.height;y++)for(let x=0;x<groundGlyph.width;x++)if(pixels[(y*groundGlyph.width+x)*4+3]){groundInk=y;break outer;}
    for(const p of sim.profiles)if(['shore crab','reef lobster','peacock mantis shrimp','violet octopus'].includes(p.name))p.footInset=(p.footInset||0)+groundInk;
  }
  worldOptions.footInsets=sim.profiles.map(p=>p.footInset||0);
  const wreckImage=scenerySprite([
    '                    |',
    '               _____|_____',
    '              /___________\\',
    '       _______|  []   []  |________',
    '  ____/  [] [] |__________| [] []   \\___',
    '  \\             [_______]            /',
    '   \\______                  _______/',
    '          \\________________/',
    '            /_/        /_/'
  ],'#64888b');
  let wreckFootInset=0;const wreckPaint=wreckImage.getContext('2d');
  if(typeof wreckPaint.getImageData==='function'){
    const pixels=wreckPaint.getImageData(0,0,wreckImage.width,wreckImage.height).data;
    outer:for(let y=wreckImage.height-1;y>=0;y--)for(let x=0;x<wreckImage.width;x++)if(pixels[(y*wreckImage.width+x)*4+3]){wreckFootInset=wreckImage.height-1-y;break outer;}
  }
  const coralImage=scenerySprite(['  \\ | /',' _/\\|/\\_','    ||','   _||_'],'#b8869e');
  const coralClusters=[coralImage,
    scenerySprite(['   /|   |\\',' _/ |\\ /| \\_','    | Y |','  __|_|_|__'],'#a786b9'),
    scenerySprite(['     _/\\_','  __/ /\\ \\__',' /_/\\ || /\\_\\','      ||','    __||__'],'#b9967c')];
  const rocks=[
    scenerySprite(['    ____',' __/ .  \\_','/___..____\\'],'#52666a'),
    scenerySprite(['     ___',' ___/   \\','/ .  __  \\_','\\___/  \\___/'],'#5a626b'),
    scenerySprite(['   ______',' _/ .  . \\_','/__________\\'],'#596c69')];
  const creviceImage=scenerySprite(['   ___      ___',' _/   \\    /   \\_','/______\\__/______\\'],'#4d6266');
  const anchorImage=scenerySprite(['    O','    |','  --+--',' \\  |  /','  \\_|_/'],'#6f7b80');
  const debrisImages=[scenerySprite(['   __|___',' _/[] __/',' \\__/__/'],'#576d72'),
    scenerySprite(['  __    __',' /_/\\__/ /',' \\__[]__/'],'#56666d'),
    scenerySprite([' __/___','/__/__/','  /_/'],'#5e6c6d')];
  const eelImage=scenerySprite([' __    __','/  \\__/ o>','\\_______/'],'#ad9b77');
  const whaleRows=['          ___','    _____/   \\________________',' __/                         o \\__','<__    _________________________  >','   \\__/     \\____/       \\_____/'];
  const whaleImages=[scenerySprite(whaleRows,'#426573'),scenerySprite(whaleRows.map(r=>[...r.padEnd(36)].reverse().map(c=>mirror[c]||c).join('')),'#426573')];
  function GenesisSeed(){return (Date.now() ^ 0xA51A2026)>>>0;}
  function drawSeabed(){
    const font=Number(canvas.dataset.fishFont)||14, pitch=font*.6;
    ctx.font=font+'px "Courier New", monospace';ctx.textBaseline='top';
    const floorAt=x=>core.terrainAt(sim.travel+x/screenW*core.W)/core.H*screenH;
    // A distant ridge has its own slower camera; foreground roots and ground still match.
    const distantCamera=sim.travel*.35*screenW/core.W,ridgePitch=pitch*2;
    ctx.fillStyle='#14262d';
    for(let column=Math.floor(distantCamera/ridgePitch)-1;column<=Math.ceil((distantCamera+screenW)/ridgePitch);column++){
      const worldPixel=column*ridgePitch,x=worldPixel-distantCamera;
      const y=screenH*(.76+.035*Math.sin(worldPixel*.009)+.018*Math.sin(worldPixel*.023));
      ctx.fillText('_',x,y);
    }
    // Sample fixed world columns, then translate them with the same camera as the plants.
    const cameraPixels=sim.travel*screenW/core.W;
    const firstColumn=Math.floor(cameraPixels/pitch)-1;
    const lastColumn=Math.ceil((cameraPixels+screenW)/pitch)+1;
    for(let column=firstColumn;column<=lastColumn;column++){
      const worldPixel=column*pitch,x=worldPixel-cameraPixels;
      const y=core.terrainAt(worldPixel/screenW*core.W)/core.H*screenH;
      ctx.fillStyle='#36575a';ctx.fillText('_',x,y);
      ctx.fillStyle='#203b40';
      for(let depth=font;depth<screenH-y;depth+=font)if((column+depth/font)%5===0)ctx.fillText('.',x,y+depth);
      if(core.habitatAt(worldPixel/screenW*core.W).name==='Open sand'&&column%4===0){ctx.fillStyle='#28464a';ctx.fillText('~',x,y+font);}
    }
    // Sparse kelp clumps sway slowly; they are scenery, not additional animals.
    const kelpGreens=['#438b55','#62b878','#82c76b','#4fa66b','#a0cd78'];
    // Plants belong to fixed ocean coordinates, so they enter and leave at the edges.
    for(let slot=Math.floor(sim.travel/4)-1;slot<=Math.ceil((sim.travel+core.W)/4)+1;slot++){
      const plant=core.plantAt(slot,sim.seed);
      if(!plant.present)continue;
      const {hash,worldX,habitat,height}=plant;
      const base=(worldX-sim.travel)/core.W*screenW;
      if(base<-pitch*3||base>screenW+pitch*3)continue;
      const shade=hash%kelpGreens.length;
      const bottom=floorAt(base)-font;
      for(let n=0;n<height;n++){
        // Roots stay fixed in the seabed; only the upper fronds sway.
        const sway=Math.sin(sim.tick*.045+n*.65+worldX)*pitch*.65*n/Math.max(1,height-1);
        ctx.fillStyle=kelpGreens[(shade+(n%4===0?1:0))%kelpGreens.length];
        ctx.fillText(habitat.name==='Seagrass bed'?(n%2?'/':'|'):(n%2?'(':')'),base+sway,bottom-n*font);
        if(habitat.name==='Seagrass bed'&&n<height-1){ctx.fillText('/',base+sway-pitch,bottom-n*font);ctx.fillText('|',base+sway+pitch,bottom-n*font);}
        if(n>0&&n%2===0)ctx.fillText('/',base+sway+pitch,bottom-n*font);
      }
    }
    // Sparse landmarks belong to permanent world slots, so they never pop into the middle.
    for(let slot=Math.floor(sim.travel/12)-2;slot<=Math.ceil((sim.travel+core.W)/12)+1;slot++){
      const item=core.sceneryAt(slot,sim.seed);if(!item)continue;
      const image=item.type==='coral'?coralClusters[item.variant]:item.type==='boulder'?rocks[item.variant]:item.type==='crevice'?creviceImage:item.type==='anchor'?anchorImage:debrisImages[item.variant];
      const x=(item.worldX-sim.travel)/core.W*screenW;
      if(x+image.width<0||x>screenW)continue;
      const floor=Math.min(...Array.from({length:Math.ceil(image.width/pitch)+1},(_,i)=>floorAt(x+i*pitch)));
      ctx.drawImage(image,x,floor-image.height+groundInk-2);
    }
    // The wreck is attached to an ocean coordinate, so it scrolls through the entire view.
    for(let segment=Math.floor(sim.travel/64)-1;segment<=Math.ceil((sim.travel+core.W)/64);segment++){
      if(((segment%6)+6)%6!==5)continue;
      const x=(segment*64+12-sim.travel)/core.W*screenW;
      const y=Math.min(...Array.from({length:Math.ceil(wreckImage.width/pitch)+1},(_,i)=>floorAt(x+i*pitch)));
      if(x+ wreckImage.width<0||x>screenW)continue;
      const wreckTop=y-wreckImage.height+groundInk-2+wreckFootInset;
      ctx.drawImage(wreckImage,x,wreckTop);
      const peek=Math.sin(sim.tick*.018+segment);
      if(peek>.7){ctx.globalAlpha=Math.min(1,(peek-.7)/.15);ctx.drawImage(eelImage,x+advance*17,wreckTop+font*5);ctx.globalAlpha=1;}
    }
  }
  const sceneArt=core.life.scenes.art;
  const landmarkImages={castle:scenerySprite(sceneArt.castleSmall,'#6f8290'),ruins:scenerySprite(sceneArt.ruinsSmall,'#687c78')};
  const visitorImages={boat:scenerySprite(sceneArt.boat,'#c8b68f'),whale:scenerySprite(sceneArt.whale,'#82a9bb'),monster:scenerySprite(sceneArt.monster,'#8fb68b'),monsterAlt:scenerySprite(sceneArt.monsterAlt,'#8fb68b')};
  const spoutImages=sceneArt.spout.map(rows=>scenerySprite([...rows,...Array(3-rows.length).fill('')],'#a3d8e5'));
  function drawScenes(){
    if(sim.parade)return;
    const unit=advance/6,scroll=sim.travel/core.W*screenW;
    for(let slot=Math.floor((scroll/unit-300)/900)-1;slot*900<scroll/unit+screenW/unit;slot++){
      const l=core.life.scenes.landmark(slot,sim.seed),image=landmarkImages[l.kind],wx=l.worldX*unit,x=wx-scroll;
      if(x+image.width<0||x>screenW)continue;
      const floor=Math.min(...Array.from({length:Math.ceil(image.width/advance)+1},(_,i)=>core.terrainAt((wx+i*advance)/screenW*core.W)/core.H*screenH));
      const scale=Math.min(1,(floor-screenH*2/3-3)/image.height);
      if(scale>=.5)ctx.drawImage(image,x,floor-image.height*scale-2,image.width*scale,image.height*scale);
    }
    const scene=core.life.scenes.scene(sim.ocean.elapsed/1000,sim.seed),water=core.life.surfaceY(sim);
    if(water<20)return;
    ctx.fillStyle='#081723';ctx.fillRect(0,0,screenW,water+fishFont*.5);
    ctx.font=fishFont+'px "Courier New", monospace';ctx.textBaseline='top';ctx.fillStyle='#508d9f';
    for(let x=0;x<screenW;x+=advance)ctx.fillText(Math.sin(sim.ocean.elapsed/1000*1.2+x/6*.06)>0?'~':'_',x,water);
    if(!scene.kind||water<fishFont*4)return;
    const image=visitorImages[scene.kind==='monster'&&Math.floor(scene.progress*30/.6)%2?'monsterAlt':scene.kind],x=-image.width+scene.progress*(screenW+image.width);
    const smooth=v=>{v=Math.max(0,Math.min(1,v));return v*v*(3-2*v);};
    const lift=smooth(scene.progress*6)*smooth((1-scene.progress)*6);
    const y=scene.kind==='boat'?water-fishFont*3:scene.kind==='whale'?water-fishFont+(1-lift)*fishFont*4:water-fishFont*4;
    ctx.drawImage(image,x,y);
    const p=scene.progress*30%11;
    if(scene.kind==='whale'&&lift>.95&&p>=3&&p<6.2)ctx.drawImage(spoutImages[Math.min(3,Math.floor((p-3)/.8))],x+advance*2,y-fishFont*3);
  }
  function draw(){
    const light=sim.ocean.light;
    ctx.fillStyle=light<.35?'#020610':'#02090c';ctx.fillRect(0,0,screenW,screenH);
    const discovery=sim.ocean.discovery;
    if(discovery?.type==='whale'){
      const image=whaleImages[discovery.right?0:1];ctx.globalAlpha=.65;
      ctx.drawImage(image,discovery.x*screenW/core.W-image.width/2,discovery.y*screenH/core.H);ctx.globalAlpha=1;
    }
    drawSeabed();
    drawScenes();
    const cellX=screenW/core.W, cellY=screenH/core.H;
    ctx.font='10px Consolas, "Courier New", monospace';ctx.textBaseline='top';
    const parade=sim.parade;
    // Blend into and out of the showcase without deleting ordinary swimmers.
    const normalAlpha=parade?Math.max(0,1-parade.elapsed/4000,1-(parade.duration-parade.elapsed)/2000):1;
    const sprites=[...sim.fish.map(f=>({fish:f,alpha:normalAlpha})),...(parade?.fish||[]).map(f=>({fish:f,alpha:1}))];
    for(let y=0;y<core.H;y++)for(let x=0;x<core.W;x++){
      if(!sim.parade&&y*cellY<core.life.waterTop(sim))continue;
      const s=sim.cells[y*core.W+x];
      if(s===core.EMPTY||s===core.FRY||s===core.HUNTER)continue;
      ctx.fillStyle=core.COLORS[s];ctx.fillText(s===core.PLANKTON?'.':core.GLYPH[s],(x-sim.travel%1)*cellX,y*cellY);
    }
    if(typeof entranceEffects!=='undefined')for(const p of entranceEffects.pixels(screenW,screenH,entranceItems(),1.5)){ctx.fillStyle=p.color;ctx.fillRect(p.x,p.y,p.size*2,p.size*2);if(p.size===2){ctx.fillRect(p.x-2,p.y+2,8,2);ctx.fillRect(p.x+2,p.y-2,2,8);}}
    // Draw classic Asciiquarium sprites over one-cell ecological agents.
    // The life model stays 48×48; only its presentation uses multi-character art.
    for(const {fish,alpha} of sprites){
      if(alpha<=0)continue;
      const image=spriteCache[fish.design*2+(fish.right?0:1)];
      const b=core.life.displayBox(sim,fish);
      if(b.left+b.width<0||b.left>screenW)continue;
      const jelly=fishArt[fish.design*2]?.name==='moon jellyfish';
      const pulse=jelly?1+Math.sin((fish.age||0)*.16)*.035:1;
      ctx.globalAlpha=alpha;ctx.drawImage(image,b.left+b.width*(1-pulse)/2,b.top,b.width*pulse,b.height);ctx.globalAlpha=1;
    }
    const diver=sim.life.diver;
    if(diver&&normalAlpha>0){
      const image=diverCache[(Math.floor(diver.age/5)%2)*2+(diver.right?0:1)];
      ctx.globalAlpha=normalAlpha;ctx.drawImage(image,diver.x*cellX-image.width/2,diver.y*cellY);ctx.globalAlpha=1;
    }
    ctx.font='10px "Courier New", monospace';ctx.fillStyle='#71969c';
    ctx.globalAlpha=normalAlpha;
    for(const bubble of sim.life.bubbles)ctx.fillText(bubble.y*cellY>core.life.waterTop(sim)+20?'o':'.',bubble.x*cellX,bubble.y*cellY);
    ctx.globalAlpha=1;
    if(discovery?.type==='glow'){
      ctx.fillStyle='#81cbd9';
      const fade=Math.min(1,discovery.age/12,(86-discovery.age)/12);
      ctx.globalAlpha=fade*.65;
      for(let i=0;i<18;i++)ctx.fillText('.',screenW*(.18+(i*17%60)/100)+Math.sin(sim.tick*.025+i)*4,screenH*(.15+(i*7%50)/100));
      ctx.globalAlpha=1;
    }
    ctx.fillStyle='#0c1330';ctx.globalAlpha=(1-light)*.18;ctx.fillRect(0,0,screenW,screenH);ctx.globalAlpha=1;
    const c=core.counts(sim);document.getElementById('tick').textContent=parade?`PARADE · ${Math.ceil((parade.duration-parade.elapsed)/1000)}s`:`${sim.habitat.name} · ${light<.35?'NIGHT':'DAY'} · TIDE ${String(sim.tick).padStart(4,'0')}`;
    const paradeButton=document.getElementById('parade');
    paradeButton.disabled=!!parade;paradeButton.textContent=parade?'Parade running…':'Creature parade · 2 min';
    for(const [id,value] of [['plankton',c.plankton],['fry',c.fry],['hunters',c.hunters],['algae',c.algae]])document.getElementById(id).textContent=value;
  }
  let entranceEffects=new GenesisCelebrations.Tracker(),entranceWorld=sim;
  function entranceItems(){return [...sim.fish,...(sim.parade?.fish||[])].map(f=>{const b=core.life.displayBox(sim,f);return {key:f,name:fishArt[f.design*2]?.name,x:b.left,y:b.top,w:b.width,h:b.height,right:f.right};});}
  function step(elapsedMs=350){
    if(clockMode==='local'){const now=new Date();sim.ocean.localHour=now.getHours()+now.getMinutes()/60;}
    core.step(sim,typeof elapsedMs==='number'?elapsedMs:350);
    if(entranceWorld!==sim){entranceEffects=new GenesisCelebrations.Tracker();entranceWorld=sim;}
    entranceEffects.step(entranceItems(),(typeof elapsedMs==='number'?elapsedMs:350)/1000,screenW,screenH);draw();
  }
  function animationClock(){return typeof performance!=='undefined'?performance.now():Date.now();}
  document.getElementById('parade').onclick=()=>{if(core.life.startParade(sim)){lastFrame=animationClock();draw();}};
  document.getElementById('pause').onclick=e=>{running=!running;e.currentTarget.textContent=running?'Pause':'Resume';};
  document.getElementById('step').onclick=step;
  const quietButton=document.getElementById('quiet');
  function showQuiet(){quietButton.textContent=`Quiet mode: ${quiet?'on':'off'}`;quietButton.setAttribute('aria-pressed',String(quiet));}
  quietButton.onclick=()=>{quiet=!quiet;worldOptions.quiet=quiet;core.life.setQuiet(sim,quiet);try{localStorage.setItem('ascii-genesis-quiet',String(quiet));}catch{}showQuiet();};
  showQuiet();
  const clockButton=document.getElementById('clock');
  function showClock(){clockButton.textContent=clockMode==='local'?'Lighting: local clock':'Lighting: ocean cycle';}
  clockButton.onclick=()=>{clockMode=clockMode==='local'?'cycle':'local';worldOptions.clockMode=clockMode;core.life.setClockMode(sim,clockMode);try{localStorage.setItem('ascii-genesis-clock',clockMode);}catch{}showClock();};
  showClock();
  const closeButton=document.getElementById('close');
  closeButton.onclick=async()=>{
    if(closeButton.disabled)return;
    const status=document.getElementById('status');closeButton.disabled=true;status.textContent='Closing the ocean…';
    try{
      const response=await fetch('/api/close',{method:'POST',headers:{'Content-Type':'application/json'},body:'{}'});
      const data=await response.json();
      if(!response.ok)throw new Error(data.error||'Could not close the ocean.');
      running=false;
    }catch(error){status.textContent=error.message||'Could not contact the desktop launcher.';closeButton.disabled=false;}
  };
  document.getElementById('reset').onclick=()=>{entranceEffects=new GenesisCelebrations.Tracker();sim=core.world(GenesisSeed(),fishArt.length/2,worldOptions);document.getElementById('event').textContent='A new habitat takes shape. Watch the small life find its balance.';draw();};
  document.getElementById('ai').onclick=async e=>{
    if(aiBusy)return;aiBusy=true;e.currentTarget.disabled=true;
    const status=document.getElementById('status'), counts=core.counts(sim);
    status.textContent='Trying the optional local API bridge…';
    try{
      const r=await fetch('/api/narrate',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({tick:sim.tick,...counts})});
      const data=await r.json();
      if(!r.ok){status.textContent=data.error||'API request failed. Please report the error code.';document.getElementById('event').textContent=`AI connection: ${data.code||r.status}. The ocean keeps running.`;return;}
      document.getElementById('event').textContent=data.text;
      status.textContent=`OpenAI • ${data.model} • ${data.usage?.total_tokens ?? 'usage n/a'} tokens`;
    }catch{
      document.getElementById('event').textContent=offlineEvent(counts,sim.tick);
      status.textContent='Could not contact the local API server. Close the ocean and reopen it using the Pi desktop icon.';
    }finally{aiBusy=false;e.currentTarget.disabled=false;}
  };
  function offlineEvent(c,tick){
    if(c.plankton<35)return 'The bloom thins. A cool tide carries the smallest swimmers into shelter.';
    if(c.fry>22)return 'New fry scatter through the weeds while the hunters circle wide.';
    if(c.algae<90)return 'Soft green light spreads slowly across the open water.';
    return ['The hunters turn beneath a field of quiet, drifting plankton.','A fresh bloom gathers along the lower edge of the habitat.','Fry weave through the algae as the current changes.'][tick%3];
  }
  let lastFrame=animationClock();
  draw();setInterval(()=>{const now=animationClock(),elapsed=Math.max(0,now-lastFrame);lastFrame=now;if(running)step(elapsed||350);},350);
})();
