import assert from 'node:assert/strict';
import './fish-art.js';
const art=globalThis.AsciiquariumSprites;
const dimensions=name=>{const s=art.find(a=>a.name===name);assert.ok(s,name+' exists');const w=Math.max(...s.rows.map(r=>r.length)),h=s.rows.length;return {w,h,area:w*h};};
const jelly=dimensions('moon jellyfish'),reef=dimensions('reef fish'),shark=dimensions('reef shark'),whale=dimensions('humpback whale');
assert.ok(jelly.area<reef.area,'Jellyfish stays smaller than a regular reef fish');
for(const name of ['shore crab','reef lobster','peacock mantis shrimp'])assert.ok(dimensions(name).area<shark.area/2,'Small crustaceans must not rival the shark: '+name);
assert.ok(whale.w>shark.w&&shark.w>dimensions('large ocean fish').w,'Large-creature lengths retain their hierarchy');
for(let i=0;i<art.length;i+=2){
 const a=art[i],b=art[i+1],d=dimensions(a.name);
 assert.equal(a.name,b.name);assert.equal(a.rows.length,b.rows.length);
 assert.equal(Math.max(...a.rows.map(r=>r.length)),Math.max(...b.rows.map(r=>r.length)));
 assert.ok(d.w*6<=296&&d.h*8<=100,'Every design fits the Mini display and parade: '+a.name);
 assert.ok(d.area<=whale.area,'The whale is the largest regular drawing by character-grid area');
}
console.log('PASS: creature size hierarchy, matching directions, and Mini fit.');
