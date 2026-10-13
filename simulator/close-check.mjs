import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {once} from 'node:events';
import {fileURLToPath} from 'node:url';
async function start(desktop){
  const child=spawn(process.execPath,[fileURLToPath(new URL('./server.mjs',import.meta.url))],{
    env:{...process.env,ASCII_GENESIS_PORT:'0',ASCII_GENESIS_DESKTOP:desktop?'1':'0',OPENAI_API_KEY:''},stdio:['ignore','pipe','pipe']});
  let text='';
  const url=await new Promise((resolve,reject)=>{
    const timer=setTimeout(()=>{child.kill();reject(Error('Close test server timeout'));},5000);
    child.stdout.on('data',data=>{text+=data;const match=text.match(/http:\/\/127\.0\.0\.1:\d+/);if(match){clearTimeout(timer);resolve(match[0]);}});
    child.once('error',reject);child.once('exit',code=>{clearTimeout(timer);if(!text)reject(Error('Server failed: '+code));});
  });
  return {child,url};
}
for(const desktop of [false,true]){
  const {child,url}=await start(desktop);
  try{
    assert.equal((await fetch(url+'/api/close')).status,404,'GET cannot close the app');
    const forbidden=await fetch(url+'/api/close',{method:'POST',headers:{Origin:'https://example.com','Content-Type':'application/json'},body:'{}'});
    assert.equal(forbidden.status,403);
    assert.equal((await fetch(url+'/pi')).status,200,'Rejected close keeps the server running');
    const exited=once(child,'exit');
    const response=await fetch(url+'/api/close',{method:'POST',headers:{Origin:url,'Content-Type':'application/json'},body:'{}'});
    assert.equal(response.status,desktop?200:409);
    if(desktop){assert.equal((await response.json()).closed,true);const [code]=await exited;assert.equal(code,0);}
    else assert.equal((await fetch(url+'/pi')).status,200,'Browser preview is not shut down');
  }finally{if(child.exitCode===null){const ended=once(child,'exit');child.kill();await ended;}}
}
console.log('Touch close: real local server exits cleanly only in desktop mode; GET, foreign origin and preview requests cannot close it.');
