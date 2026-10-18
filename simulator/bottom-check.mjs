import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url),core=require('./aquarium.js');require('./fish-art.js');
const art=globalThis.AsciiquariumSprites,design=name=>art.findIndex(s=>s.name===name)/2;
for(const name of ['shore crab','reef lobster','peacock mantis shrimp','violet octopus'])for(const right of [false,true]){
 const w=core.world(44,26,{quiet:true});w.fish=[];w.life.nextDiver=1e9;w.ocean.nextSchool=1e9;w.ocean.nextDiscovery=1e9;
 const f={id:100,design:design(name),kind:core.FRY,right,x:right?-10:58,y:8,speed:.12};w.fish=[f];
 const b=core.life.box(w,f);assert.ok(b.left+b.width<0||b.left>1280);
 let visible=0;
 for(let n=0;n<750&&w.fish.includes(f);n++){
  core.step(w);const box=core.life.box(w,f);
  const first=Math.min(47,Math.max(0,Math.floor(box.left/(1280/48)))),last=Math.max(first+1,Math.min(48,Math.ceil((box.left+box.width)/(1280/48))+1));
  const floor=Math.min(...w.floor.slice(first,last))*400/48;
  assert.ok(Math.abs(box.top+box.height-(floor-2))<1e-8,name+' stays at the floor through terrain changes');
  if(box.left>0&&box.left+box.width<1280)visible++;
 }
 assert.ok(visible>0);assert.ok(!w.fish.includes(f),'Bottom creature exits beyond the edge');
 core.life.startParade(w);const parade={id:'parade-test',design:f.design,right:true,x:24,y:7};
 const box=core.life.box(w,parade);w.parade=null;
 assert.deepEqual(box,core.life.box(w,parade),'Parade uses the same ground contact as normal movement');
 const first=Math.min(47,Math.max(0,Math.floor(box.left/(1280/48)))),last=Math.max(first+1,Math.min(48,Math.ceil((box.left+box.width)/(1280/48))+1));
 assert.ok(Math.abs(box.top+box.height-(Math.min(...w.floor.slice(first,last))*400/48-2))<1e-8,'Parade feet stay at the floor');
}
const w=core.world(99,26);const shark={id:100,design:design('reef shark'),right:true,x:24,y:15,speed:.3};
assert.ok(core.life.predators.has(core.life.profile(w,shark).name));assert.ok(core.life.profile(w,shark).mouth.x>core.life.profile(w,shark).width*.65);
let subSeen=false,whaleSeen=false;
for(let n=0;n<10000;n++){
 core.step(w);assert.ok(w.fish.length<=8);
 for(const f of w.fish){const name=core.life.profile(w,f).name;if(name==='yellow submarine'){subSeen=true;assert.equal(f.kind,core.EMPTY);}if(name==='humpback whale')whaleSeen=true;}
}
assert.ok(subSeen&&whaleSeen,'Whales and submarines join the rotating collection');
console.log('Bottom creatures: both directions, terrain contact, full crossings, grounded parade; shark eligibility and whale/submarine rotation passed.');
