import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url),core=require('./aquarium.js');require('./fish-art.js');
const art=globalThis.AsciiquariumSprites;
function fixture(design,right=true,count=2){
  const w=core.world(42,art.length/2,{quiet:true});w.floor.fill(42);
  // Isolate underwater spacing from the surface camera's intentional depth clamp.
  for(let second=0;second<600;second++)if(core.life.scenes.scene(second,w.seed).surface===0){w.ocean.elapsed=second*1000;break;}
  w.fish=Array.from({length:count},(_,i)=>({id:i+1,design,right,x:24,y:20,speed:.2}));
  return w;
}
function tick(w){core.life.before(w);for(const f of w.fish)f.x+=(f.right?1:-1)*f.velocity;}
for(const name of ['reef fish','shore crab','reef lobster','peacock mantis shrimp','humpback whale'])for(const right of [true,false]){
  const w=fixture(art.findIndex(a=>a.name===name)/2,right),start=w.fish.map(f=>f.x);
  // Actual boxes detect floor-clamped overlap even when stored depths are different.
  if(['shore crab','reef lobster','peacock mantis shrimp'].includes(name))w.fish[1].y=5;
  for(let n=0;n<7;n++)tick(w);
  assert.ok(w.fish.every(f=>f.velocity===f.speed),'Brief overlap keeps ordinary pace');
  for(let n=0;n<100;n++){
    const prior=w.fish.map(f=>({...f}));tick(w);
    for(let i=0;i<2;i++){
      const f=w.fish[i],old=prior[i];
      assert.ok(Math.abs(f.velocity-old.velocity)<=.04000001,'Cruise changes ease in and out');
      assert.equal(f.y,old.y,'Spacing must not displace creatures vertically');
      assert.equal(f.design,old.design);assert.equal(f.right,right);
    }
  }
  const [a,b]=w.fish.map(f=>core.life.box(w,f));
  assert.ok(a.left>=b.left+b.width||b.left>=a.left+a.width,name+' separates in either direction');
  assert.equal(w.fish.length,2);assert.ok(w.fish.every((f,i)=>Math.abs(f.x-start[i])>0));
  for(let n=0;n<40;n++)tick(w);
  assert.ok(w.fish.every(f=>Math.abs(f.velocity-f.speed)<1e-10),'Return to normal cruise after separating');
  assert.equal(w.life.overlaps.size,0);
}
for(const mode of ['school','opposite','separate depth','encounter']){
  const w=fixture(1);
  if(mode==='school')for(const f of w.fish)f.school=7;
  if(mode==='opposite')w.fish[1].right=false;
  if(mode==='separate depth')w.fish[1].y=5;
  if(mode==='encounter'){
    for(const f of w.fish)f.x=-5;
    w.life.encounter={hunterId:1,preyId:2,phase:'entering'};
  }
  for(let n=0;n<20;n++)core.life.before(w);
  assert.ok(w.fish.every(f=>f.velocity===f.speed),mode+' retains its movement');
}
const group=fixture(1,true,3);for(let n=0;n<160;n++)tick(group);
assert.ok(new Set(group.fish.map(f=>f.x)).size===3,'Three stacked swimmers separate');
group.fish=[];core.life.before(group);assert.equal(group.life.overlaps.size,0,'Departed pairs are discarded');
console.log('Spacing: persistent overlaps separate gently in both directions, including bottom creatures; brief crossings, schools and encounters stay intact.');
