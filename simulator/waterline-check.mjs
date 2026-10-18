import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url),core=require('./aquarium.js');require('./fish-art.js');
const art=globalThis.AsciiquariumSprites;
let held=0;
for(let design=0;design<art.length/2;design++)for(const right of [true,false]){
 const w=core.world(4848,art.length/2,{quiet:true});
 const f={id:123,design,right,x:24,y:8,speed:0};w.fish=[f];
 let deep=0;while(core.life.scenes.scene(deep,4848).surface!==0)deep++;
 w.ocean.elapsed=deep*1000;const baseline=core.life.box(w,f);
 for(let t=0;t<600;t++){
  w.ocean.elapsed=t*1000;
  assert.deepEqual(core.life.box(w,f),baseline,'Surface changes cannot relocate a '+art[design*2].name);
  assert.equal(w.fish[0],f,'The same creature remains present');
  assert.ok(core.life.surfaceY(w)+12<=baseline.top,'The wave stays above the entire drawing');
  if(core.life.surfaceY(w)<-12+76*core.life.scenes.scene(t,4848).surface)held++;
 }
}
assert.ok(held>0);
const empty=core.world(4848,28,{quiet:true});empty.fish=[];
for(let t=0;t<600;t++){empty.ocean.elapsed=t*1000;assert.equal(core.life.surfaceY(empty),-12+76*core.life.scenes.scene(t,4848).surface);}
console.log('PASS: all 28 Pi creatures, both directions, ten minutes of surface changes, fixed drawing positions, waterline clearance and release after departure.');
