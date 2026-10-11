import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {cleanSnapshot,narrate,safeError,checkKey} from './openai_bridge.mjs';
import {createHash} from 'node:crypto';

const here=path.dirname(fileURLToPath(import.meta.url));
const key=process.env.OPENAI_API_KEY;
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8'};
const server=http.createServer(async(req,res)=>{
  try{
    const url=new URL(req.url,'http://127.0.0.1');
    if(req.method==='GET'&&url.pathname==='/api/status'){
      let state='ready';try{checkKey(key);}catch(err){state=err.code;}
      res.writeHead(200,{'Content-Type':'application/json','Cache-Control':'no-store'});
      res.end(JSON.stringify({state,keyFingerprint:key?createHash('sha256').update(key).digest('hex'):null}));return;
    }
    if(req.method==='POST'&&url.pathname==='/api/narrate'){
      checkKey(key);
      let raw='';for await(const part of req){raw+=part;if(raw.length>2048){res.writeHead(413);res.end();return;}}
      let body;try{body=JSON.parse(raw);}catch{res.writeHead(400);res.end();return;}
      const result=await narrate(cleanSnapshot(body),key);
      res.writeHead(200,{'Content-Type':'application/json','Cache-Control':'no-store'});res.end(JSON.stringify(result));return;
    }
    if(req.method==='GET'){
      const name=url.pathname==='/'?'pi.html':url.pathname==='/pi'?'pi.html':url.pathname.slice(1);
      if(!['pi.html','aquarium.js','fish-art.js','simulator.js'].includes(name)){res.writeHead(404);res.end();return;}
      const data=await fs.readFile(path.join(here,name));res.writeHead(200,{'Content-Type':mime[path.extname(name)],'Cache-Control':'no-store'});res.end(data);return;
    }
    res.writeHead(405);res.end();
  }catch(err){
    const info=safeError(err);
    res.writeHead(info.status,{'Content-Type':'application/json','Cache-Control':'no-store'});
    res.end(JSON.stringify({error:info.error,code:info.code}));
  }
});
server.listen(4173,'127.0.0.1',()=>console.log('ASCII Genesis preview: http://127.0.0.1:4173 (loopback only)'));

