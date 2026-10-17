import fs from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import '../../../simulator/fish-art.js';
import '../preview/font.js';
const quote=s=>JSON.stringify(s);
let out=`/* Generated from simulator/fish-art.js and preview/font.js. Do not edit.
 * Artwork: GPL-2.0-or-later; Copyright (C) 2003 Kirk Baucom, most upstream
 * art credited to Joan Stark; expanded biodiversity by Claudio Matsuoka.
 * Original additions: ASCII Genesis. See root CREDITS.md and THIRD-PARTY.txt.
 * Font: Copyright (c) 2012 Adafruit Industries, BSD, preview/FONT-LICENSE.txt.
 */
#pragma once
#include <stdint.h>
typedef struct {const char *rows[10],*masks[10];uint32_t palette[7];int width,height;} mini_sprite_t;
static const unsigned char mini_font[]={${globalThis.MiniFont.join(',')}};
static const mini_sprite_t mini_sprites[]={\n`;
for(const s of globalThis.AsciiquariumSprites)out+=`{ {${s.rows.map(quote)}}, {${s.masks.map(quote)}}, {${s.palette.map(c=>'0x'+c.slice(1))}}, ${Math.max(...s.rows.map(r=>r.length))}, ${s.rows.length}},\n`;
out+='};\n';
const target=fileURLToPath(new URL('../firmware/main/assets.h',import.meta.url));
if(process.argv.includes('--check')){if(await fs.readFile(target,'utf8')!==out)throw Error('Generated assets are stale');}
else await fs.writeFile(target,out);
