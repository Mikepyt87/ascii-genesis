import assert from 'node:assert/strict';
import '../../../simulator/fish-art.js';
import './font.js';
import './ocean.js';
const {MiniOcean, render} = globalThis.MiniAquarium;
const sprites = globalThis.AsciiquariumSprites;
const ocean = new MiniOcean(sprites);
assert.equal(sprites.length, 54);
assert.equal(ocean.fish.length, 3);
const start = ocean.fish[0].x;
ocean.step(0.1);
assert.ok(ocean.fish[0].x > start, 'Fish must actually swim');
ocean.paused = true;
const paused = JSON.stringify(ocean);
ocean.step(0.25);
assert.equal(JSON.stringify(ocean), paused, 'Pause freezes creatures, plants, terrain, habitat and bubbles');
ocean.paused = false;
const visited = new Set();
let draws = 0;
const ctx = {fillRect(){draws++;},save(){},restore(){},beginPath(){},rect(){},clip(){}};
for (let frame = 0; frame < 36000; frame++) {
  ocean.step(0.1);
  assert.ok(ocean.fish.length <= 3);
  assert.ok(ocean.bubbles.length <= 4);
  visited.add(ocean.habitat);
  for (const fish of ocean.fish) {
    assert.ok(Number.isFinite(fish.x) && Number.isFinite(fish.y));
    assert.ok(fish.y >= 12 && fish.y + fish.height <= 160);
  }
  if (frame % 1000 === 0) render(ctx, ocean, globalThis.MiniFont);
}
assert.equal(visited.size, 6);
assert.ok(draws > 0);
assert.equal(ocean.action(10, 150), 'show', 'Hidden controls first reveal without triggering');
ocean.action(10, 150);
assert.ok(ocean.paused);
assert.equal(ocean.action(150, 150), 'reset');
assert.equal(ocean.action(250, 150), 'settings');
assert.equal(new MiniOcean(sprites, 10).time, 0);
console.log('PASS: one simulated hour, all six habitat labels, movement, bounded populations, rendering, pause and touch actions.');
