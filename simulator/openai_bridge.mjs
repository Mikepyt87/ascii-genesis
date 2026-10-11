export const DEFAULT_MODEL='gpt-6-luna';
export const RESPONSES_URL='https://api.openai.com/v1/responses';
export class ApiError extends Error {
  constructor(code,message,status=502){super(message);this.code=code;this.status=status;}
}
export function checkKey(key){
  if(!key||!key.trim())throw new ApiError('missing_key','No API key loaded. Check ~/.config/ascii-genesis/openai.env and reopen the ocean.',503);
  if(!/^sk-[A-Za-z0-9_-]+$/.test(key)||key.includes('...'))throw new ApiError('invalid_key_format','The saved key is incomplete or has extra characters. Paste the full secret key and reopen the ocean.',503);
}
export function safeError(err){
  if(err instanceof ApiError)return {code:err.code,error:err.message,status:err.status};
  if(err?.name==='TimeoutError'||err?.name==='AbortError')return {code:'timeout',error:'OpenAI timed out. Check your internet connection and try again.',status:504};
  return {code:'connection_error',error:'Could not reach OpenAI. Check the Pi internet connection, clock and certificates.',status:502};
}

export function cleanSnapshot(body={}){
  const n=v=>Number.isFinite(Number(v))?Math.max(0,Math.min(2304,Math.trunc(Number(v)))):0;
  return {tick:n(body.tick),plankton:n(body.plankton),fry:n(body.fry),hunters:n(body.hunters),algae:n(body.algae)};
}
export async function narrate(snapshot,apiKey,fetcher=fetch){
  checkKey(apiKey);
  const s=cleanSnapshot(snapshot);
  const response=await fetcher(RESPONSES_URL,{
    method:'POST',
    headers:{'Authorization':`Bearer ${apiKey}`,'Content-Type':'application/json'},
    body:JSON.stringify({
      model:DEFAULT_MODEL,
      instructions:'Write one short atmospheric event for a fictional artificial-life ASCII aquarium. Use only the supplied habitat counts. Do not claim these are real organisms or live world events. One sentence, at most 12 words.',
      input:`Tide ${s.tick}; plankton ${s.plankton}; fry ${s.fry}; hunters ${s.hunters}; algae ${s.algae}.`,
      reasoning:{effort:'none'},
      max_output_tokens:128,
      store:false
    }),
    signal:AbortSignal.timeout(20000)
  });
  let json;try{json=await response.json();}catch{throw new ApiError('invalid_response','OpenAI returned an unreadable response. Try again later.');}
  if(!response.ok){
    const code=json.error?.code;
    if(response.status===401)throw new ApiError('authentication','OpenAI rejected the key (401). Check the full key is active, then reopen the ocean.');
    if(code==='insufficient_quota'||code==='billing_hard_limit_reached')throw new ApiError('billing','OpenAI API credit or billing limit reached. Check API billing; ChatGPT billing is separate.');
    if(response.status===429)throw new ApiError('rate_limit','OpenAI request limit reached (429). Wait briefly and try again.');
    if(response.status===403)throw new ApiError('permission','OpenAI denied access (403). Check key permissions and project/model access.');
    if(response.status===404||code==='model_not_found')throw new ApiError('model_access','The configured model is unavailable to this API project.');
    if(response.status===400)throw new ApiError('request_error','OpenAI rejected the request settings (400). Report this code so we can fix the request.');
    throw new ApiError('service_error',`OpenAI service error (${response.status}). Try again later.`);
  }
  const pieces=[];
  for(const item of json.output??[])if(item.type==='message')for(const part of item.content??[])if(part.type==='output_text'&&typeof part.text==='string')pieces.push(part.text);
  const text=pieces.join(' ').replace(/[\u0000-\u001f\u007f]/g,' ').replace(/\s+/g,' ').trim().slice(0,160);
  if(!text)throw new ApiError('empty_output',json.incomplete_details?.reason==='max_output_tokens'?'OpenAI hit the response limit before returning a message.':'OpenAI returned no narration text. Report error code empty_output.');
  return {text,model:json.model??DEFAULT_MODEL,usage:json.usage??null};
}
