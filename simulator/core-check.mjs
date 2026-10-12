import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);const core=require('./aquarium.js');
require('./fish-art.js');
const art=globalThis.AsciiquariumSprites;
assert.equal(art.length,38);
assert.equal(new Set(art.map(s=>s.name)).size,19);
for(const sprite of art.filter(s=>s.original)){
  assert.ok(Math.max(...sprite.rows.map(row=>row.length))*14*.61/2<100,'New fish must spawn fully off screen in the smallest profile');
  assert.ok(sprite.rows.every((row,i)=>row.length===sprite.masks[i].length));
}
for(const sprite of art){assert.equal(sprite.rows.length,sprite.masks.length);assert.ok(sprite.rows.every(row=>!row.includes('?')));}
const variety=core.world(88,art.length/2),seen=new Set();
for(let i=0;i<10000;i++){core.step(variety);for(const fish of variety.fish){assert.ok(art[fish.design*2+(fish.right?0:1)]);seen.add(fish.design);}}
assert.equal(seen.size,19,'Every unique creature design must join the rotation');
assert.ok(Math.abs(variety.travel-800)<1e-7,'Camera travels at a steady gentle speed');
const habitats=new Set();
for(let distance=0;distance<192;distance++){
  habitats.add(core.habitatAt(distance).name);
  assert.ok(Math.abs(core.terrainAt(distance+.01)-core.terrainAt(distance))<.02,'Terrain must be continuous');
}
assert.equal(habitats.size,3);
assert.ok(core.habitatAt(0).kelp>core.habitatAt(128).kelp);
assert.ok(core.habitatAt(0).food>core.habitatAt(128).food);
const a=core.world(123456), b=core.world(123456), c=core.world(123457);
assert.equal(a.cells.length,48*48);assert.deepEqual(a.cells,b.cells);assert.notDeepEqual(a.cells,c.cells);
for(let i=0;i<500;i++){core.step(a);core.step(b);assert.deepEqual(a.cells,b.cells);assert.equal(a.cells.length,2304);for(const v of a.cells)assert.ok(v>=0&&v<=4);for(let j=0;j<a.cells.length;j++)if(Math.floor(j/core.W)>=a.floor[j%core.W])assert.equal(a.cells[j],core.EMPTY,'Nothing may grow or swim below the seabed');assert.ok(core.counts(a).fry+core.counts(a).hunters<=8);}
assert.equal(a.tick,500);assert.equal(core.ascii(a).split('\n').length,48);assert.ok(core.ascii(a).split('\n').every(row=>row.length===48));
const total=Object.values(core.counts(a)).reduce((x,y)=>x+y,0);assert.ok(total<=2304);
const ocean=core.world(99), initialIds=new Set(ocean.fish.map(f=>f.id));
assert.ok(new Set(ocean.fish.map(f=>f.speed)).size>1);
const crossings=core.world(42,17,{quiet:true});
for(let t=0;t<600;t++){
  const before=crossings.fish.map(f=>({...f}));core.step(crossings);
  for(const fish of before)if(fish.x>0&&fish.x<core.W){
    const after=crossings.fish.find(f=>f.id===fish.id);
    assert.ok(after,'A visible fish must not disappear');assert.equal(after.design,fish.design);
    assert.ok(Math.abs(after.x-fish.x-(fish.right?1:-1)*fish.speed)<1e-10);
  }
}
for(let i=0;i<10000;i++){core.step(ocean);assert.ok(core.counts(ocean).plankton<=45);assert.ok(core.counts(ocean).algae<=100);assert.ok(ocean.fish.length<=8);assert.equal(new Set(ocean.fish.map(f=>f.id)).size,ocean.fish.length);}
assert.ok(ocean.nextFishId>20,'New visitors must rotate through the ocean');
assert.ok(ocean.fish.every(f=>!initialIds.has(f.id)),'Initial swimmers must eventually leave');
console.log('Aquarium simulation okay: 500 deterministic steps; bounds, five cell states, counters, and 48×48 ASCII output verified.');

await import('./life-check.mjs');
