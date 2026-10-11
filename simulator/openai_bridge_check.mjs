import assert from 'node:assert/strict';
import {cleanSnapshot,narrate,DEFAULT_MODEL,RESPONSES_URL,safeError} from './openai_bridge.mjs';
assert.deepEqual(cleanSnapshot({tick:'12',plankton:50000,fry:-1,hunters:'no',algae:17.8}),{tick:12,plankton:2304,fry:0,hunters:0,algae:17});
let observed;
const result=await narrate({tick:7,plankton:22,fry:3,hunters:1,algae:55},'sk-testkey',async(url,options)=>{
  observed={url,options};return {ok:true,status:200,json:async()=>({model:DEFAULT_MODEL,output:[{type:'reasoning'},{type:'message',content:[{type:'output_text',text:'A bright bloom gathers below.'}]}],usage:{total_tokens:19}})};
});
assert.equal(observed.url,RESPONSES_URL);assert.equal(observed.options.headers.Authorization,'Bearer sk-testkey');
const sent=JSON.parse(observed.options.body);assert.equal(sent.model,DEFAULT_MODEL);assert.equal(sent.max_output_tokens,128);assert.deepEqual(sent.reasoning,{effort:"none"});assert.equal(sent.store,false);
assert.deepEqual(result,{text:'A bright bloom gathers below.',model:DEFAULT_MODEL,usage:{total_tokens:19}});
await assert.rejects(()=>narrate({},'',async()=>{}),/No API key loaded/);
await assert.rejects(()=>narrate({},'sk-testkey',async()=>({ok:false,status:401,json:async()=>({})})),/rejected the key/);
await assert.rejects(()=>narrate({},'sk-testkey',async()=>({ok:true,status:200,json:async()=>({output:[]})})),/no narration text/);
console.log('OpenAI bridge simulation okay: request shape/auth, bounded habitat input, text parsing, and failure paths verified without network access.');

for(const [status,code,expected] of [[429,'insufficient_quota','billing'],[429,'rate_limit_exceeded','rate_limit'],[403,'permission_denied','permission'],[404,'model_not_found','model_access'],[400,'bad_request','request_error']]){
  try{await narrate({},'sk-testkey',async()=>({ok:false,status,json:async()=>({error:{code,message:'DO NOT EXPOSE sk-testkey'}})}));assert.fail('Expected API failure');}
  catch(err){const info=safeError(err);assert.equal(info.code,expected);assert.ok(!info.error.includes('sk-testkey'));}
}
await assert.rejects(()=>narrate({},'sk-...abc',async()=>{throw Error('Must not send a malformed key')}),/incomplete/);
assert.equal(safeError(new Error('sk-private-value')).code,'connection_error');
assert.ok(!safeError(new Error('sk-private-value')).error.includes('sk-private-value'));
console.log('API failure categories and secret redaction passed.');
