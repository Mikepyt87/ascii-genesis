import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const here = path.dirname(fileURLToPath(import.meta.url));
const allowed = new Map([['/', 'preview.html'], ['/ocean.js', 'ocean.js'], ['/font.js', 'font.js'], ['/network.js','network.js'], ['/fish-art.js', '../../../simulator/fish-art.js']]);
const server = http.createServer(async (req, res) => {
  if (req.method !== 'GET' || !allowed.has(req.url)) { res.writeHead(404); res.end(); return; }
  try {
    let data = await fs.readFile(path.resolve(here, allowed.get(req.url)), 'utf8');
    if (req.url === '/') data = '<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"><title>Miniature ASCII Genesis preview</title><style>body{margin:24px auto;padding:0 16px;max-width:736px;background:#12181c;color:#dae6e8;font:16px system-ui;--muted-foreground:#aac0c5}.viz-row,.viz-controls{display:flex;gap:16px;flex-wrap:wrap;align-items:center}button{font:inherit;padding:10px 18px}label{display:flex;gap:8px}</style></head><body>' + data + '</body></html>';
    res.writeHead(200, {'Content-Type': req.url === '/' ? 'text/html; charset=utf-8' : 'text/javascript; charset=utf-8', 'Cache-Control':'no-store'}); res.end(data);
  } catch { res.writeHead(500); res.end('Preview file unavailable'); }
});
server.listen(4174, '127.0.0.1', () => console.log('Miniature aquarium: http://127.0.0.1:4174'));
