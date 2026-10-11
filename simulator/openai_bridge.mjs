export const DEFAULT_MODEL='gpt-6-luna';
export const RESPONSES_URL='https://api.openai.com/v1/responses';

export function cleanSnapshot(body={}){
  const n=v=>Number.isFinite(Number(v))?Math.max(0,Math.min(2304,Math.trunc(Number(v)))):0;
  return {tick:n(body.tick),plankton:n(body.plankton),fry:n(body.fry),hunters:n(body.hunters),algae:n(body.algae)};
}
export async function narrate(snapshot,apiKey,fetcher=fetch){
  if(!apiKey)throw new Error('OPENAI_API_KEY is not set');
  const s=cleanSnapshot(snapshot);
  const response=await fetcher(RESPONSES_URL,{
    method:'POST',
    headers:{'Authorization':`Bearer ${apiKey}`,'Content-Type':'application/json'},
    body:JSON.stringify({
      model:DEFAULT_MODEL,
      instructions:'Write one short atmospheric event for a fictional artificial-life ASCII aquarium. Use only the supplied habitat counts. Do not claim these are real organisms or live world events. One sentence, at most 12 words.',
      input:`Tide ${s.tick}; plankton ${s.plankton}; fry ${s.fry}; hunters ${s.hunters}; algae ${s.algae}.`,
      max_output_tokens:48
    }),
    signal:AbortSignal.timeout(20000)
  });
  const json=await response.json();
  if(!response.ok)throw new Error(`OpenAI API returned HTTP ${response.status}`);
  const pieces=[];
  for(const item of json.output??[])if(item.type==='message')for(const part of item.content??[])if(part.type==='output_text'&&typeof part.text==='string')pieces.push(part.text);
  const text=pieces.join(' ').replace(/[\u0000-\u001f\u007f]/g,' ').replace(/\s+/g,' ').trim().slice(0,160);
  if(!text)throw new Error('OpenAI response contained no text output');
  return {text,model:json.model??DEFAULT_MODEL,usage:json.usage??null};
}
