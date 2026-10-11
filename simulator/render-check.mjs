import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url),core=require('./aquarium.js');
require('./fish-art.js');
let cachedGlyphs=0,images=0,interval;
const context=(cached=false)=>({font:'',fillStyle:'',textBaseline:'',fillRect(){},
  fillText(){if(cached)cachedGlyphs++;},measureText(){return {width:9.6};},
  drawImage(image,x,y){assert.ok(image.width>0&&image.height>0);assert.ok(Number.isFinite(x)&&Number.isFinite(y));images++;}});
const main=context(),elements=new Map();
const tank={width:1280,height:400,dataset:{fishFont:'16'},getContext:()=>main};
const document={getElementById(id){if(id==='tank')return tank;if(!elements.has(id))elements.set(id,{});return elements.get(id);},
 createElement(tag){assert.equal(tag,'canvas');return {getContext:()=>context(true)};}};
vm.runInNewContext(fs.readFileSync(new URL('./simulator.js',import.meta.url),'utf8'),{
 window:{AquariumCore:core,AsciiquariumSprites:globalThis.AsciiquariumSprites},document,
 setInterval(fn,ms){assert.equal(ms,350);interval=fn;},Date,console});
const initial=cachedGlyphs;assert.ok(initial>0);assert.ok(images>0);
for(let n=0;n<1000;n++)interval();
assert.equal(cachedGlyphs,initial,'Fish glyphs must not be redrawn into cached images every frame');
const before=images;elements.get('pause').onclick({currentTarget:{}});interval();assert.equal(images,before);
elements.get('step').onclick();assert.ok(images>before,'Manual stepping still works while paused');
elements.get('reset').onclick();assert.equal(cachedGlyphs,initial,'Reset reuses fish artwork');
console.log('Pi renderer: cached sprites, finite geometry, 1000 frames, pause, step and reset passed.');
