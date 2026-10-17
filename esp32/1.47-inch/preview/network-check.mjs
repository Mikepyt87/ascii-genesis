import assert from 'node:assert/strict';
import './network.js';
const make=()=>new globalThis.MiniNetwork.MiniNetwork();
const n=make();n.open();n.check();assert.equal(n.phase,'idle');assert.match(n.message,/Offline/);
n.setup();n.connect();assert.equal(n.online,true);assert.equal(n.screen,'settings');
n.check();n.step(2);assert.equal(n.available,true);n.install();n.setup();assert.equal(n.phase,'download');
n.step(4);assert.equal(n.phase,'boot');assert.equal(n.version,'0.1.0');n.step(2);assert.equal(n.version,'0.2.0');assert.equal(n.available,false);
n.check();n.step(2);assert.equal(n.available,false);
for(const scenario of ['bad-download','bad-boot']){
  const bad=make();bad.setup();bad.connect();bad.check();bad.step(2);bad.scenario=scenario;bad.install();bad.step(4);
  if(scenario==='bad-boot'){bad.step(2);assert.equal(bad.phase,'rollback');bad.step(2);}
  assert.equal(bad.version,'0.1.0');assert.equal(bad.phase,'idle');
}
const timeout=make();timeout.setup();timeout.step(600);assert.equal(timeout.phase,'idle');assert.equal(timeout.screen,'settings');
const cancel=make();cancel.setup();cancel.action(20,155);assert.equal(cancel.screen,'ocean');assert.equal(cancel.phase,'idle');
console.log('PASS: offline use, phone setup, timeout, version check, install, corrupt download rejection, failed boot rollback, and busy-state guards (simulation).');
