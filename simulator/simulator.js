(() => {
  'use strict';
  const core=window.AquariumCore, canvas=document.getElementById('tank'), ctx=canvas.getContext('2d');
  const screenW=canvas.width, screenH=canvas.height;
  const fishArt=window.AsciiquariumSprites;
  let sim=core.world(GenesisSeed(),fishArt.length/2), running=true, aiBusy=false;
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
    return image;
  });
  function GenesisSeed(){return (Date.now() ^ 0xA51A2026)>>>0;}
  function drawSeabed(){
    const font=Number(canvas.dataset.fishFont)||14, pitch=font*.6;
    ctx.font=font+'px "Courier New", monospace';ctx.textBaseline='top';
    const floorAt=x=>core.terrainAt(sim.travel+x/screenW*core.W)/core.H*screenH;
    for(let x=0;x<screenW;x+=pitch){
      const y=floorAt(x);
      ctx.fillStyle='#36575a';ctx.fillText('_',x,y);
      ctx.fillStyle='#203b40';
      for(let depth=font;depth<screenH-y;depth+=font)if(Math.floor((x+sim.travel*screenW/core.W)/pitch+depth/font)%5===0)ctx.fillText('.',x,y+depth);
    }
    // Sparse kelp clumps sway slowly; they are scenery, not additional animals.
    const kelpGreens=['#438b55','#62b878','#82c76b','#4fa66b','#a0cd78'];
    // Plants belong to fixed ocean coordinates, so they enter and leave at the edges.
    for(let slot=Math.floor(sim.travel/4)-1;slot<=Math.ceil((sim.travel+core.W)/4)+1;slot++){
      const hash=((Math.imul(slot+8192,1664525)^sim.seed)>>>0);
      if(hash%5===0)continue;
      const worldX=slot*4+(hash%29)/10;
      const base=(worldX-sim.travel)/core.W*screenW;
      if(base<-pitch*3||base>screenW+pitch*3)continue;
      const habitat=core.habitatAt(worldX),height=Math.max(2,Math.round((4+hash%15)*habitat.kelp)),shade=hash%kelpGreens.length;
      const bottom=floorAt(base)-font;
      for(let n=0;n<height;n++){
        const sway=Math.sin(sim.tick*.045+n*.65+worldX)*pitch*.65;
        ctx.fillStyle=kelpGreens[(shade+(n%4===0?1:0))%kelpGreens.length];
        ctx.fillText(n%2?'(':')',base+sway,bottom-n*font);
        if(n>0&&n%2===0)ctx.fillText('/',base+sway+pitch,bottom-n*font);
      }
    }
  }
  function draw(){
    ctx.fillStyle='#02090c';ctx.fillRect(0,0,screenW,screenH);
    drawSeabed();
    const cellX=screenW/core.W, cellY=screenH/core.H;
    ctx.font='10px Consolas, "Courier New", monospace';ctx.textBaseline='top';
    const sprites=sim.fish;
    for(let y=0;y<core.H;y++)for(let x=0;x<core.W;x++){
      const s=sim.cells[y*core.W+x];
      if(s===core.EMPTY||s===core.FRY||s===core.HUNTER)continue;
      ctx.fillStyle=core.COLORS[s];ctx.fillText(core.GLYPH[s],(x-sim.travel%1)*cellX,y*cellY);
    }
    // Draw classic Asciiquarium sprites over one-cell ecological agents.
    // The life model stays 48×48; only its presentation uses multi-character art.
    for(const fish of sprites){
      const image=spriteCache[fish.design*2+(fish.right?0:1)];
      const pixelWidth=image.width,pixelHeight=image.height;
      const left=fish.x*cellX-pixelWidth/2;
      if(left+pixelWidth<0||left>screenW)continue;
      const first=Math.min(core.W-1,Math.max(0,Math.floor(left/cellX)));
      const last=Math.max(first+1,Math.min(core.W,Math.ceil((left+pixelWidth)/cellX)+1));
      const localFloor=Math.min(...sim.floor.slice(first,last))*cellY;
      const top=Math.max(8,Math.min(localFloor-pixelHeight-8,fish.y*cellY-pixelHeight/2));
      ctx.drawImage(image,left,top);
    }
    const c=core.counts(sim);document.getElementById('tick').textContent=`${sim.habitat.name} · TIDE ${String(sim.tick).padStart(4,'0')}`;
    for(const [id,value] of [['plankton',c.plankton],['fry',c.fry],['hunters',c.hunters],['algae',c.algae]])document.getElementById(id).textContent=value;
  }
  function step(){core.step(sim);draw();}
  document.getElementById('pause').onclick=e=>{running=!running;e.currentTarget.textContent=running?'Pause':'Resume';};
  document.getElementById('step').onclick=step;
  document.getElementById('reset').onclick=()=>{sim=core.world(GenesisSeed(),fishArt.length/2);document.getElementById('event').textContent='A new habitat takes shape. Watch the small life find its balance.';draw();};
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
  draw();setInterval(()=>{if(running)step();},350);
})();

