import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url),core=require('./aquarium.js');
require('./fish-art.js');
const art=globalThis.AsciiquariumSprites;
const outcomes=new Set(),directions=new Set();
for(let seed=1;seed<=16;seed++){
  const w=core.world(seed,17);w.fish=[];w.life.nextEncounter=0;w.life.nextDiver=10000;
  core.step(w);
  assert.equal(w.fish.length,2);
  const e=w.life.encounter;e.catchAllowed=seed%2===0;
  const h=w.fish.find(f=>f.id===e.hunterId),p=w.fish.find(f=>f.id===e.preyId);
  directions.add(h.right);
  for(const f of w.fish){const b=core.life.box(w,f);assert.ok(b.left+b.width<0||b.left>1280,'Pair starts entirely beyond an edge');}
  assert.ok(core.life.profile(w,h).width>core.life.profile(w,p).width*1.5);
  const mouth=core.life.profile(w,h).mouth;
  assert.ok(h.right?mouth.x>core.life.profile(w,h).width*.65:mouth.x<core.life.profile(w,h).width*.35,'Mouth must face the prey, not the tail');
  let feeding=false,previousWidth=Infinity;
  for(let t=0;t<400&&!w.life.lastOutcome;t++){
    core.step(w);
    if(w.life.encounter?.phase==='feeding'){
      feeding=true;
      const contact=w.life.encounter.contact;
      assert.ok(Math.abs(contact.mouth.x-contact.prey.x)<=12);
      assert.ok(Math.abs(contact.mouth.y-contact.prey.y)<5);
      const b=core.life.displayBox(w,p),m=core.life.mouth(w,h);
      assert.ok(Math.abs(b.left+b.width/2-m.x)<1e-8);
      assert.ok(Math.abs(b.top+b.height/2-m.y)<1e-8);
      assert.ok(b.width<=previousWidth);previousWidth=b.width;
    }
  }
  assert.ok(w.life.lastOutcome,'Encounter has a bounded duration');
  outcomes.add(w.life.lastOutcome.type);
  if(w.life.lastOutcome.type==='catch'){assert.ok(feeding);assert.ok(!w.fish.includes(p));}
  else assert.ok(w.fish.includes(p),'Escaping prey survives');
  assert.ok(w.life.nextEncounter-w.tick>=341,'Cooldown is at least two minutes');
}
assert.deepEqual(outcomes,new Set(['escape','catch']));assert.equal(directions.size,2);
const quiet=core.world(321,17,{quiet:true});quiet.life.nextEncounter=0;quiet.life.nextDiver=0;
core.step(quiet);assert.equal(quiet.life.encounter,null);assert.ok(quiet.life.diver,'Quiet mode keeps peaceful diver visits');
const diver=quiet.life.diver,initialX=diver.x;
let maxBubbles=0;
for(let t=0;t<400;t++){core.step(quiet);maxBubbles=Math.max(maxBubbles,quiet.life.bubbles.length);assert.ok(quiet.life.bubbles.length<=5);}
assert.notEqual(diver.x,initialX);assert.equal(quiet.life.diver,null);assert.ok(maxBubbles>0);assert.equal(quiet.life.bubbles.length,0);
assert.ok(quiet.life.nextDiver>quiet.tick,'Visitor schedules its next arrival after departure');
const cancel=core.world(91,17);cancel.fish=[];cancel.life.nextEncounter=0;core.step(cancel);
const ids=cancel.fish.map(f=>f.id);core.life.setQuiet(cancel,true);core.step(cancel);
assert.equal(cancel.life.encounter,null);assert.ok(ids.every(id=>cancel.fish.some(f=>f.id===id)));
const long=core.world(42,17);let last=null,catches=0,escapes=0;
for(let t=0;t<30000;t++){
  const visible=long.fish.filter(f=>f.x>0&&f.x<48).map(f=>f.id);
  core.step(long);
  assert.ok(long.fish.length<=8);assert.ok(long.life.bubbles.length<=5);
  for(const id of visible)if(!long.fish.some(f=>f.id===id))assert.ok(long.life.lastOutcome?.type==='catch'&&long.life.lastOutcome.preyId===id&&long.life.lastOutcome.tick===long.tick-1,'Only a visible, recorded catch may remove an on-screen fish');
  if(long.life.lastOutcome!==last){last=long.life.lastOutcome;if(last?.type==='catch')catches++;if(last?.type==='escape')escapes++;}
}
assert.ok(catches>0&&escapes>catches*2,'Escapes should dominate rare catches');
console.log(`Ocean life: off-screen pairs, both directions, mouth contact, feeding, quiet mode, diver and 30,000 ticks passed (${catches} catches, ${escapes} escapes).`);
