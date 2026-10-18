import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url),core=require('./aquarium.js');require('./fish-art.js');
const art=globalThis.AsciiquariumSprites;
const w=core.world(123,21,{quiet:true});w.fish=[];w.ocean.nextSchool=0;
assert.equal(core.life.addSchool(w),true);assert.equal(w.fish.length,3);
assert.equal(new Set(w.fish.map(f=>f.design)).size,1);assert.equal(new Set(w.fish.map(f=>f.school)).size,1);
for(const f of w.fish){const b=core.life.box(w,f);assert.ok(b.left+b.width<0||b.left>1280);}
const school=w.fish[0];school.x=20;school.y=school.baseY=20;
const hunter={id:100,kind:core.HUNTER,design:9,right:true,x:22,y:20,speed:.26};w.fish.push(hunter);
for(let n=0;n<15;n++)core.life.moveCreature(w,school);
assert.ok(school.y<18,'A threatened school spreads');w.fish.pop();
for(let n=0;n<40;n++)core.life.moveCreature(w,school);
assert.ok(Math.abs(school.y-school.baseY)<.5,'School regroups after threat passes');
for(const name of ['moon jellyfish','violet kite ray','sea turtle','violet octopus']){
 const design=art.findIndex(a=>a.name===name)/2;
 const f={id:100,design,right:true,x:24,y:20,speed:.25};
 const heights=[];for(let n=0;n<200;n++){core.life.moveCreature(w,f);heights.push(f.y);assert.ok(f.y>=5&&f.y<=43);}
 if(name!=='violet octopus')assert.ok(Math.max(...heights)-Math.min(...heights)>1,name+' has distinct movement');
 if(name==='sea turtle')assert.ok(heights[179]<heights[99]&&heights[199]>heights[179],'Turtle surfaces and returns');
 if(name==='violet octopus')assert.ok(core.life.box(w,f).top>200,'Octopus stays on the seabed');
}
core.life.setClockMode(w,'local');w.ocean.localHour=12;core.life.advanceOcean(w,350);assert.ok(w.ocean.light>.99);
w.ocean.localHour=0;core.life.advanceOcean(w,350);assert.ok(w.ocean.light<.01);
core.life.setClockMode(w,'cycle');w.ocean.elapsed=0;core.life.advanceOcean(w,600000);assert.ok(w.ocean.light<.01);
core.life.advanceOcean(w,600000);assert.ok(w.ocean.light>.99);
const ocean=core.world(888,21,{quiet:true});let whales=0,glows=0,schools=0;
for(let n=0;n<20000;n++){
 const old=ocean.ocean.discovery;core.step(ocean);
 assert.ok(ocean.fish.length<=8);assert.ok(core.counts(ocean).algae<=100&&core.counts(ocean).plankton<=45);
 for(const f of ocean.fish)assert.ok(Number.isFinite(f.y)&&Number.isFinite(f.x));
 const d=ocean.ocean.discovery;
 if(d!==old&&d){if(d.type==='whale'){whales++;assert.ok(d.x<0||d.x>48);}else glows++;}
 if(ocean.fish.some(f=>f.school))schools++;
}
assert.ok(whales>0&&glows>0&&schools>0,'Rare discoveries and schools occur over extended operation');
const saved=JSON.stringify(ocean.ocean);core.life.startParade(ocean);core.step(ocean,120000);assert.equal(JSON.stringify(ocean.ocean),saved,'Parade preserves ambient timers');
console.log('Expansion: schools, scattering/regrouping, four movement styles, local/cycle lighting, bounded discoveries and 20,000 ticks passed.');
