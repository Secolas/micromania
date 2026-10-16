// Runs every tests/*.test.mjs against the game in a headless Chromium.
//   npm test                  all of them
//   npm test -- games text    only the files whose names contain "games" or "text"
// CHROMIUM_PATH=/path/to/chrome uses that browser instead of Playwright's own.
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { chromium } from 'playwright';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');
const types = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.json': 'application/json',
  '.webmanifest': 'application/manifest+json', '.png': 'image/png', '.svg': 'image/svg+xml' };

// a tiny static server, so the page runs over http like on Vercel (service
// workers and camera access need http(s), not file://)
const server = http.createServer((req, res) => {
  let p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  if (p.endsWith('/')) p += 'index.html';
  const file = path.join(root, p);
  if (!file.startsWith(root) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) { res.writeHead(404); res.end(); return; }
  res.writeHead(200, { 'content-type': types[path.extname(file)] || 'application/octet-stream', 'cache-control': 'no-store' });
  fs.createReadStream(file).pipe(res);
});
await new Promise(r => server.listen(0, '127.0.0.1', r));
const url = `http://127.0.0.1:${server.address().port}/`;

const launch = (args = []) => chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined, args });

const only = process.argv.slice(2);
const files = fs.readdirSync(here).filter(f => f.endsWith('.test.mjs') && (!only.length || only.some(o => f.includes(o)))).sort();
let failed = 0;
for (const f of files) {
  const t0 = Date.now();
  try {
    const mod = await import(pathToFileURL(path.join(here, f)));
    await mod.default({ url, launch });
    console.log(`PASS  ${f}  (${((Date.now() - t0) / 1000).toFixed(1)}s)`);
  } catch (e) {
    failed++;
    console.log(`FAIL  ${f}\n      ${String(e && e.stack || e).split('\n').slice(0, 4).join('\n      ')}`);
  }
}
server.close();
console.log(failed ? `\n${failed} of ${files.length} failed` : `\nall ${files.length} passed`);
process.exit(failed ? 1 : 0);
