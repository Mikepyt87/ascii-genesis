import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
const core=createRequire(import.meta.url)('./aquarium.js');
const types=new Set(),variants=new Set(),densities=new Map();
for(let distance=-384;distance<1536;distance+=.125){
 const depth=core.terrainAt(distance);assert.ok(Number.isFinite(depth)&&depth>=33&&depth<=46);
 assert.ok(Math.abs(core.terrainAt(distance+.01)-depth)<.02,'No abrupt seam or unbounded cliff slope');
}
for(let slot=-96;slot<384;slot++){
 const a=core.sceneryAt(slot,42),b=core.sceneryAt(slot,42);assert.deepEqual(a,b,'Landmarks do not respawn or change on redraw');
 if(a){assert.ok(a.worldX>=slot*12&&a.worldX<slot*12+12);types.add(a.type);if(a.type==='coral')variants.add(a.variant);}
 const plant=core.plantAt(slot,42);assert.deepEqual(plant,core.plantAt(slot,42));
 assert.ok(plant.height>=2&&plant.height<=22);
 if(plant.habitat.name==='Seagrass bed')assert.ok(plant.height<=8);
 const group=densities.get(plant.habitat.name)||{present:0,total:0};group.total++;if(plant.present)group.present++;densities.set(plant.habitat.name,group);
}
assert.deepEqual(types,new Set(['boulder','crevice','coral','anchor','debris']));assert.equal(variants.size,3);
const ratio=name=>{const d=densities.get(name);return d.present/d.total;};
assert.ok(ratio('Kelp meadow')>ratio('Open sand')*2,'Bare sand contrasts with vegetated meadow');
assert.ok(new Set(Array.from({length:100},(_,slot)=>JSON.stringify(core.sceneryAt(slot,42)))).size>10);
for(const boundary of [0,64,128,192,256,320,384])assert.ok(Math.abs(core.terrainAt(boundary-.0001)-core.terrainAt(boundary+.0001))<.001);
console.log('Terrain: bounded smooth habitat contours, repeatable world landmarks, all five scenery types, three coral forms, and patchy vegetation passed.');
