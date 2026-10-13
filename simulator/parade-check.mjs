import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url),core=require('./aquarium.js');
require('./fish-art.js');
const art=globalThis.AsciiquariumSprites;
const w=core.world(31,art.length/2),saved={cells:w.cells.slice(),fish:JSON.stringify(w.fish),tick:w.tick,travel:w.travel,life:JSON.stringify(w.life)};
assert.equal(core.life.startParade(w),true);
assert.equal(core.life.startParade(w),false,'A second press must not extend the parade');
const visible=new Set(),exits=new Set(),entered=new Set();
for(let time=0;time<120000;time+=250){
  const previous=w.parade.fish.map(f=>({...f}));
  core.step(w,250);
  if(w.parade)for(const fish of w.parade.fish){
    const b=core.life.box(w,fish);
    if(!entered.has(fish.design))assert.ok(b.left+b.width<0,'Every design starts wholly beyond the edge');
    entered.add(fish.design);
    if(b.left>=0&&b.left+b.width<=1280)visible.add(fish.design);
    if(b.left>1280)exits.add(fish.design);
    assert.ok(art[fish.design*2]);
  }
  if(w.parade)assert.ok(w.parade.fish.length<=8);
  for(const f of previous)if(!w.parade?.fish.some(x=>x.id===f.id))assert.ok(core.life.box(w,f).left>1280,'Removal waits for full off-screen exit');
}
assert.equal(w.parade,null);assert.equal(visible.size,26);assert.equal(exits.size,26);
assert.deepEqual(w.cells,saved.cells);assert.equal(JSON.stringify(w.fish),saved.fish);
assert.equal(w.tick,saved.tick);assert.equal(w.travel,saved.travel);assert.equal(JSON.stringify(w.life),saved.life);
core.step(w);assert.equal(w.tick,saved.tick+1,'Normal world resumes after exactly two minutes');
const lag=core.world(7,20,{quiet:true});core.life.startParade(lag);core.step(lag,120000);assert.equal(lag.parade,null,'Elapsed time ends the parade even after a delayed update');
core.life.startParade(lag);core.life.setQuiet(lag,true);assert.ok(lag.parade,'Quiet mode does not disable the peaceful parade');
assert.equal(core.world(1,20).parade,undefined,'New world starts outside parade mode');
console.log('Parade: all 26 fully visible and fully exit, eight-swimmer cap, exact 120 seconds, preserved ecosystem and normal resume passed.');
