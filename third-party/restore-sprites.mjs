import fs from 'node:fs';
import {originalFish} from './original-fish.mjs';
const source=fs.readFileSync('third-party/asciiquarium-upstream.pl','utf8');
const section=source.split('sub add_old_fish {')[1].split('add_fish_entity')[0];
const blocks=[...section.matchAll(/q\{\n([\s\S]*?)\n\}/g)].map(m=>m[1].replace(/\\([\\{}])/g,'$1').split('\n'));
const selected=Array.from({length:16},(_,i)=>i);
const names=['angelfish','reef fish','striped fish','tiny fish','rounded fish','diamond fish','little triangular fish','box fish'];
const palette=['#81d8d0','#69bde5','#f2b677','#fff4c9','#f2b677','#69bde5','#c6e8e4'];
const sprites=selected.map(index=>({name:names[Math.floor(index/2)],rows:blocks[index*2],masks:blocks[index*2+1],palette}));
const expanded=source.split('sub add_new_fish {')[1].split('add_fish_entity')[0];
const extra=[...expanded.matchAll(/q\{\n([\s\S]*?)\n\}/g)].map(m=>m[1].replace(/\\([\\{}])/g,'$1').replace(/\?/g,' ').split('\n'));
const extraNames=['curly-fin fish','large ocean fish','streamlined fish'];
// The first expanded design repeats the classic diamond fish; omit that duplicate.
for(let index=2;index<8;index++){
  const rows=extra[index*2],masks=extra[index*2+1];
  while(rows.at(-1)===''&&masks.at(-1)===''){rows.pop();masks.pop();}
  sprites.push({name:extraNames[Math.floor(index/2)-1],rows,masks,palette});
}
const mirror={'/':'\\','\\':'/','(' :')',')':'(','<':'>','>':'<','{':'}','}':'{','[':']',']':'['};
for(const fish of originalFish){
  const rows=fish.art.trimEnd().replace(/^\n/,'').split('\n');
  const width=Math.max(...rows.map(row=>row.length));
  const right=rows.map(row=>row.padEnd(width,' '));
  const left=right.map(row=>[...row].reverse().map(ch=>mirror[ch]||ch).join(''));
  for(const drawing of [right,left])sprites.push({name:fish.name,original:true,rows:drawing,
    masks:drawing.map(row=>[...row].map(ch=>ch===' '?' ':ch==='o'?'4':ch==='|'||ch===':'?'7':ch==='/'||ch==='\\'?'2':ch==='>'||ch==='<'?'5':'1').join('')),
    palette:[fish.color,fish.fin,fish.fin,'#fff1c8',fish.color,fish.fin,'#e4dfc5']});
}
if(sprites.some(s=>!s.rows||!s.masks||s.rows.length!==s.masks.length))throw Error('Invalid upstream sprite extraction');
const notice='/* Classic fish and color masks from Asciiquarium 1.1.\n * Copyright (C) 2003 Kirk Baucom. Most ASCII art credited upstream to Joan Stark.\n * GPL-2.0-or-later. Source: https://github.com/cmatsuoka/asciiquarium\n * Adapted for this browser renderer on 2026-10-11; original spaces preserved.\n */\n';
fs.writeFileSync('simulator/fish-art.js',notice+'globalThis.AsciiquariumSprites='+JSON.stringify(sprites,null,2)+';\n');
console.log('Built 11 upstream designs and 6 original designs, each with both orientations.');

