import assert from 'node:assert/strict';
import {cleanSnapshot,narrate,DEFAULT_MODEL,RESPONSES_URL} from './openai_bridge.mjs';
assert.deepEqual(cleanSnapshot({tick:'12',plankton:50000,fry:-1,hunters:'no',algae:17.8}),{tick:12,plankton:2304,fry:0,hunters:0,algae:17});
let observed;
const result=await narrate({tick:7,plankton:22,fry:3,hunters:1,algae:55},'test-key',async(url,options)=>{
  observed={url,options};return {ok:true,status:200,json:async()=>({model:DEFAULT_MODEL,output:[{type:'reasoning'},{type:'message',content:[{type:'output_text',text:'A bright bloom gathers below.'}]}],usage:{total_tokens:19}})};
});
assert.equal(observed.url,RESPONSES_URL);assert.equal(observed.options.headers.Authorization,'Bearer test-key');
const sent=JSON.parse(observed.options.body);assert.equal(sent.model,DEFAULT_MODEL);assert.equal(sent.max_output_tokens,48);
assert.deepEqual(result,{text:'A bright bloom gathers below.',model:DEFAULT_MODEL,usage:{total_tokens:19}});
await assert.rejects(()=>narrate({},'',async()=>{}),/OPENAI_API_KEY/);
await assert.rejects(()=>narrate({},'test-key',async()=>({ok:false,status:401,json:async()=>({})})),/HTTP 401/);
await assert.rejects(()=>narrate({},'test-key',async()=>({ok:true,status:200,json:async()=>({output:[]})})),/no text/);
console.log('OpenAI bridge simulation okay: request shape/auth, bounded habitat input, text parsing, and failure paths verified without network access.');
