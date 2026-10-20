// Check documentation destinations, including local heading links.
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const prose=s=>s.replace(/^```[^\n]*\n[\s\S]*?^```[^\n]*/gm,'');
function headings(s){const used=new Map();return [...prose(s).matchAll(/^#{1,6}\s+(.+)$/gm)].map(m=>{
 const base=m[1].trim().toLowerCase().replace(/[^\p{L}\p{N}\s_-]/gu,'').replace(/\s/g,'-');
 const n=used.get(base)||0;used.set(base,n+1);return base+(n?'-'+n:'');
});}
const versionFile=path.join(root,'firmware/CMakeLists.txt');
if(fs.existsSync(versionFile)){
 const version=fs.readFileSync(versionFile,'utf8').match(/set\(PROJECT_VER "([^"]+)"/)?.[1];
 const documented=fs.readFileSync(path.join(root,'README.md'),'utf8').match(/Current firmware: \*\*v([\d.]+)\*\*/)?.[1];
 if(!version||documented!==version)throw Error('README current firmware must match firmware/CMakeLists.txt');
}
let links=0,documents=0;
function walk(dir){for(const e of fs.readdirSync(dir,{withFileTypes:true})){
 if(['.git','build','node_modules','release','managed_components'].includes(e.name))continue;
 const file=path.join(dir,e.name);if(e.isDirectory()){walk(file);continue;}if(!file.endsWith('.md'))continue;
 documents++;
 for(const m of prose(fs.readFileSync(file,'utf8')).matchAll(/\]\(([^)]+)\)/g)){
  if(/^(https?:|mailto:)/.test(m[1]))continue;
  const [name,anchor]=m[1].split('#');const target=name?path.resolve(path.dirname(file),decodeURIComponent(name)):file;
  if(!fs.existsSync(target))throw Error('Missing link in '+path.relative(root,file)+': '+m[1]);
  if(anchor&&target.endsWith('.md')&&!headings(fs.readFileSync(target,'utf8')).includes(decodeURIComponent(anchor)))throw Error('Missing heading in '+path.relative(root,file)+': '+m[1]);
  links++;
 }
}}
walk(root);console.log('PASS: '+documents+' documents; '+links+' local links and heading targets');
