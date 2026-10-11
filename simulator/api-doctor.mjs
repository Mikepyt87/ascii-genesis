// Local configuration check only: never prints the key or calls OpenAI.
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {checkKey,safeError} from './openai_bridge.mjs';
const file=path.join(os.homedir(),'.config/ascii-genesis/openai.env');
let key;
try{
  const contents=await fs.readFile(file,'utf8');
  const line=contents.split(/\r?\n/).find(s=>/^\s*(?:export\s+)?OPENAI_API_KEY\s*=/.test(s));
  if(!line)throw new Error();
  let value=line.slice(line.indexOf('=')+1).trim();
  if(value.startsWith("'")&&value.endsWith("'"))value=value.slice(1,-1);
  else if(value.startsWith('"')&&value.endsWith('"'))value=value.slice(1,-1);
  key=value;checkKey(key);
  console.log('Settings file found; key format looks complete. Key is hidden.');
}catch(err){console.log(err.code?safeError(err).error:'Settings file is missing or has no OPENAI_API_KEY entry at ~/.config/ascii-genesis/openai.env.');process.exit(1);}
try{
  const response=await fetch('http://127.0.0.1:4173/api/status',{signal:AbortSignal.timeout(3000)});
  if(!response.ok){console.log('The running ocean is an older version. Update it, then reopen.');process.exit(1);}
  const status=await response.json();
  const expected=createHash('sha256').update(key).digest('hex');
  if(status.keyFingerprint!==expected){console.log('The running ocean has a different or missing key. Close it completely and reopen from the desktop icon.');process.exit(1);}
  console.log('The running server loaded the same key. Tap AI event and report its error code if it fails.');
}catch{console.log('The local server is not reachable. Open the ocean with its desktop icon, then run this check again.');process.exit(1);}
