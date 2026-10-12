import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url),core=require('./aquarium.js');
require('./fish-art.js');
let cachedGlyphs=0,images=0,interval,clock=1000000;
const context=(cached=false)=>({font:'',fillStyle:'',textBaseline:'',fillRect(){},
  fillText(){if(cached)cachedGlyphs++;},measureText(){return {width:9.6};},
  drawImage(image,x,y){assert.ok(image.width>0&&image.height>0);assert.ok(Number.isFinite(x)&&Number.isFinite(y));images++;}});
const main=context(),elements=new Map();
const tank={width:1280,height:400,dataset:{fishFont:'16'},getContext:()=>main};
const document={getElementById(id){if(id==='tank')return tank;if(!elements.has(id))elements.set(id,{setAttribute(){}});return elements.get(id);},
 createElement(tag){assert.equal(tag,'canvas');return {getContext:()=>context(true)};}};
let world;
const settings=new Map();
vm.runInNewContext(fs.readFileSync(new URL('./simulator.js',import.meta.url),'utf8'),{
 window:{AquariumCore:{...core,world(...args){world=core.world(...args);return world;}},AsciiquariumSprites:globalThis.AsciiquariumSprites},document,
 localStorage:{getItem:k=>settings.get(k),setItem:(k,v)=>settings.set(k,v)},
 setInterval(fn,ms){assert.equal(ms,350);interval=()=>{clock+=350;fn();};},Date:{now:()=>clock},console});
const initial=cachedGlyphs;assert.ok(initial>0);assert.ok(images>0);
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
console.log('Pi renderer: cached sprites, finite geometry, 1000 frames, pause, step and reset passed.');
