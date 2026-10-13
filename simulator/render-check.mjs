import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url),core=require('./aquarium.js');
require('./fish-art.js');
let cachedGlyphs=0,images=0,interval,clock=1000000,painted=[];
const context=(cached=false)=>({font:'',fillStyle:'',textBaseline:'',fillRect(){},
  fillText(glyph,x,y){if(cached)cachedGlyphs++;else painted.push({glyph,x,y,color:this.fillStyle});},measureText(){return {width:9.6};},
  drawImage(image,x,y){assert.ok(image.width>0&&image.height>0);assert.ok(Number.isFinite(x)&&Number.isFinite(y));images++;}});
const main=context(),elements=new Map(),cachedCanvases=[];
const tank={width:1280,height:400,dataset:{fishFont:'16'},getContext:()=>main};
const document={getElementById(id){if(id==='tank')return tank;if(!elements.has(id))elements.set(id,{setAttribute(){}});return elements.get(id);},
 createElement(tag){assert.equal(tag,'canvas');const paint=context(true),image={paint,getContext:()=>paint};cachedCanvases.push(image);return image;}};
let world;
let closeAllowed=false,closeRequests=0;
const settings=new Map();
vm.runInNewContext(fs.readFileSync(new URL('./simulator.js',import.meta.url),'utf8'),{
 window:{AquariumCore:{...core,world(...args){world=core.world(...args);return world;}},AsciiquariumSprites:globalThis.AsciiquariumSprites},document,
 localStorage:{getItem:k=>settings.get(k),setItem:(k,v)=>settings.set(k,v)},
 setInterval(fn,ms){assert.equal(ms,350);interval=()=>{clock+=350;fn();};},Date:class extends Date{constructor(){super('2026-10-12T12:00:00');}static now(){return clock;}},
 fetch:async(url,options)=>{assert.equal(url,'/api/close');assert.equal(options.method,'POST');closeRequests++;return {ok:closeAllowed,json:async()=>closeAllowed?{closed:true}:{error:'Close unavailable in preview.'}};},console});
const initial=cachedGlyphs;assert.ok(initial>0);assert.ok(images>0);
const wreck=cachedCanvases.find(c=>c.paint.fillStyle==='#64888b'),eel=cachedCanvases.find(c=>c.paint.fillStyle==='#ad9b77');
assert.ok(wreck.width>=eel.width*4&&wreck.height>=eel.height*2.5,'Wreck must visibly dwarf its peeking eel');
// Ground marks and plant roots must share the same camera displacement, including lattice crossings.
for(let n=0;n<12;n++){
  const beforeTravel=world.travel,old=painted;painted=[];interval();
  const displacement=(world.travel-beforeTravel)*1280/48;
  for(const color of ['#36575a','#203b40']){
    const marks=old.filter(p=>p.color===color&&p.x>30&&p.x<1250);
    assert.ok(marks.length>0);
    for(const mark of marks)assert.ok(painted.some(p=>p.color===color&&Math.abs(p.y-mark.y)<1e-8&&Math.abs(p.x-(mark.x-displacement))<1e-8),'Seabed and sediment stay attached to fixed world positions');
  }
  const greens=new Set(['#438b55','#62b878','#82c76b','#4fa66b','#a0cd78']);
  let roots=0;
  for(let slot=Math.floor(beforeTravel/4);slot<Math.ceil((beforeTravel+48)/4);slot++){
    const hash=((Math.imul(slot+8192,1664525)^world.seed)>>>0);if(hash%5===0)continue;
    const worldX=slot*4+(hash%29)/10,x=(worldX-beforeTravel)/48*1280;
    if(x<30||x>1250)continue;
    const y=core.terrainAt(worldX)/48*400-16;
    assert.ok(old.some(p=>greens.has(p.color)&&Math.abs(p.x-x)<1e-8&&Math.abs(p.y-y)<1e-8));
    assert.ok(painted.some(p=>greens.has(p.color)&&Math.abs(p.x-(x-displacement))<1e-8&&Math.abs(p.y-y)<1e-8),'Plant roots move with the same camera as the ground');roots++;
  }
  assert.ok(roots>0);
}
world.life.nextDiver=0;
for(let n=0;n<1000;n++)interval();
assert.equal(cachedGlyphs,initial,'Fish glyphs must not be redrawn into cached images every frame');
const before=images;elements.get('pause').onclick({currentTarget:{}});interval();assert.equal(images,before);
elements.get('step').onclick();assert.ok(images>before,'Manual stepping still works while paused');
elements.get('reset').onclick();assert.equal(cachedGlyphs,initial,'Reset reuses fish artwork');
elements.get('quiet').onclick();assert.equal(world.life.quiet,true);assert.equal(settings.get('ascii-genesis-quiet'),'true');
elements.get('reset').onclick();assert.equal(world.life.quiet,true,'New world preserves quiet mode');
elements.get('parade').onclick();assert.ok(world.parade);assert.equal(elements.get('parade').disabled,true);
const remaining=world.parade.elapsed;interval();assert.equal(world.parade.elapsed,remaining,'Paused parade must not advance');
elements.get('step').onclick();assert.equal(world.parade.elapsed,remaining+350);
elements.get('pause').onclick({currentTarget:{}});
for(let i=0;i<350;i++)interval();
assert.equal(world.parade,null);assert.equal(elements.get('parade').disabled,false);
assert.equal(cachedGlyphs,initial,'Parade reuses all cached creature drawings');
elements.get('parade').onclick();elements.get('reset').onclick();assert.equal(world.parade,undefined);
elements.get('clock').onclick();assert.equal(world.ocean.clockMode,'local');assert.equal(settings.get('ascii-genesis-clock'),'local');interval();
elements.get('reset').onclick();assert.equal(world.ocean.clockMode,'local','Reset preserves clock preference');
world.ocean.discovery={type:'whale',right:true,x:24,y:8,age:20};interval();
world.ocean.discovery={type:'glow',right:true,x:24,y:8,age:20};interval();
assert.equal(cachedGlyphs,initial,'Discoveries reuse cached artwork');
await elements.get('close').onclick();assert.equal(elements.get('close').disabled,false,'Rejected close allows retry');
assert.equal(elements.get('status').textContent,'Close unavailable in preview.');
closeAllowed=true;await elements.get('close').onclick();assert.equal(elements.get('close').disabled,true);
const closedImages=images;interval();assert.equal(images,closedImages,'Accepted close stops animation while the launcher exits');
await elements.get('close').onclick();assert.equal(closeRequests,2,'Repeated taps do not duplicate the close request');
console.log('Pi renderer: matched seabed/sediment/root scrolling, cached sprites, finite geometry, 1000 frames, pause, step and reset passed.');
