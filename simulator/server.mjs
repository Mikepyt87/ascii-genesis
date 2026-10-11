import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {cleanSnapshot,narrate} from './openai_bridge.mjs';

const here=path.dirname(fileURLToPath(import.meta.url));
const key=process.env.OPENAI_API_KEY;
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8'};
const server=http.createServer(async(req,res)=>{
  try{
    const url=new URL(req.url,'http://127.0.0.1');
    if(req.method==='POST'&&url.pathname==='/api/narrate'){
      if(!key){res.writeHead(503,{'Content-Type':'application/json'});res.end(JSON.stringify({error:'OPENAI_API_KEY is not set for this optional preview bridge.'}));return;}
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
    const status=String(err.message).includes('HTTP ')?502:500;
    res.writeHead(status,{'Content-Type':'application/json','Cache-Control':'no-store'});
    res.end(JSON.stringify({error:status===502?'The API request failed. The local simulation will keep running.':'Preview bridge error.'}));
  }
});
server.listen(4173,'127.0.0.1',()=>console.log('ASCII Genesis preview: http://127.0.0.1:4173 (loopback only)'));

