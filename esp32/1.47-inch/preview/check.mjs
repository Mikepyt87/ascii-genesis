import assert from 'node:assert/strict';
import '../../../simulator/fish-art.js';
import './font.js';
import './ocean.js';
import './network.js';
const {MiniOcean, render, bandsClear} = globalThis.MiniAquarium;
const sprites = globalThis.AsciiquariumSprites;
const ocean = new MiniOcean(sprites);
assert.equal(sprites.length, 56);
assert.equal(sprites[ocean.fish[1].index].name,'peacock mantis shrimp');
assert.equal(ocean.fish.length, 3);
const start = ocean.fish[0].x;
ocean.step(0.1);
assert.equal(ocean.scroll,.1*3.6,'Mini scrolling is twice the previous speed');
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
    assert.ok(fish.y >= 23 && fish.y + fish.height + 2 <= 145);
  }
  for(let i=0;i<ocean.fish.length;i++)for(let j=i+1;j<ocean.fish.length;j++){
    const a=ocean.fish[i],b=ocean.fish[j];
    assert.ok(bandsClear(a.y,a.height,b.y,b.height),'Full creature drawings and bobbing must never overlap');
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
// Camera translation must carry actual ground and plant pixels together.
function sceneryPixels(scroll,color){
  const result=new Set();
  const ctx={fillStyle:'',save(){},restore(){},beginPath(){},rect(){},clip(){},fillRect(x,y,w,h){if(this.fillStyle===color)for(let dy=0;dy<h;dy++)for(let dx=0;dx<w;dx++)result.add(`${x+dx},${y+dy}`);}};
  const scene=new MiniOcean(sprites);scene.scroll=scroll;scene.controls=false;render(ctx,scene,globalThis.MiniFont);return result;
}
for(const color of ['#80715a','#56ab91']){
  const before=sceneryPixels(240,color),after=sceneryPixels(246,color);
  for(const item of before){const [x,y]=item.split(',').map(Number);if(x>=12&&x<308)assert.ok(after.has(`${x-6},${y}`),'Ground and plants must translate together without slipping');}
}
const crowded=new MiniOcean(sprites);
assert.equal(crowded.freeY(72),null,'A large creature must wait if the occupied bands leave no room');
crowded.fish=[];assert.notEqual(crowded.freeY(72),null,'A waiting large creature can enter once space clears');
// Apply the rectangular clip stack and check all foreground against a 24px panel radius.
let clip=[0,0,320,172],path=clip,stack=[],foreground=0;
const safeCtx={fillStyle:'',save(){stack.push([...clip]);},restore(){clip=stack.pop();},beginPath(){},rect(x,y,w,h){path=[x,y,x+w,y+h];},clip(){clip=[Math.max(clip[0],path[0]),Math.max(clip[1],path[1]),Math.min(clip[2],path[2]),Math.min(clip[3],path[3])];},fillRect(x,y,w,h){
  if(this.fillStyle==='#020c14')return;
  for(let py=Math.max(Math.round(y),clip[1]);py<Math.min(Math.round(y)+h,clip[3]);py++)for(let px=Math.max(Math.round(x),clip[0]);px<Math.min(Math.round(x)+w,clip[2]);px++){
    const cx=Math.max(24,Math.min(296,px+.5)),cy=Math.max(24,Math.min(148,py+.5));
    assert.ok((px+.5-cx)**2+(py+.5-cy)**2<=24**2,'Foreground must clear the physical corner fillets');foreground++;
  }
}};
for(let habitat=0;habitat<6;habitat++)for(const controls of [false,true]){const scene=new MiniOcean(sprites);scene.habitat=habitat;scene.controls=controls;render(safeCtx,scene,globalThis.MiniFont);assert.equal(stack.length,0);}
for(const screen of ['settings','setup']){const net=new globalThis.MiniNetwork.MiniNetwork();net.screen=screen;globalThis.MiniNetwork.draw(safeCtx,net,globalThis.MiniFont);assert.equal(stack.length,0);}
assert.ok(foreground>1000);
assert.ok(20+'ASCII-Genesis-Mini-FFFF'.length*12<=308,'Large setup SSID must fit without clipping');
console.log('PASS: one simulated hour, all habitats and screens, creature clearance, scenery translation, rounded-panel safe area, Wi-Fi text fit, pause and touch.');
