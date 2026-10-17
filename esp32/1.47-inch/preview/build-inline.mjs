import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const here = path.dirname(fileURLToPath(import.meta.url));
const destination = process.argv[2];
if (!destination) throw Error('Supply an output HTML path');
let html = await fs.readFile(path.join(here, 'preview.html'), 'utf8');
for (const [source, relative] of [['fish-art.js', '../../../simulator/fish-art.js'], ['font.js', 'font.js'], ['ocean.js', 'ocean.js'], ['network.js','network.js']]) {
  const js = await fs.readFile(path.resolve(here, relative), 'utf8');
  html = html.replace(`<script src="${source}"></script>`, `<script>\n${js.replaceAll('</script', '<\\/script')}\n</script>`);
}
await fs.writeFile(destination, html);
console.log('Self-contained preview prepared.');
