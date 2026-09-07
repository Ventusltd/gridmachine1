// Does v9.144 rescue the refs that were showing a failure card?
//
// Driven offline against the mirror, with the network cut, so the answer is
// about the cartridge and not about what happened to be reachable. Three cases:
// a ref the register cannot locate but the Crown Estate can, one it cannot
// locate and neither can, and one that always worked - the control that proves
// the change did not alter the normal path.
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import { serveWithRange, serveOptions, mimeFor } from './range.mjs';
import { chromium } from 'file:///C:/Users/vikra/LocalCI/PipelineNews-GridAtlas/v004/node_modules/playwright/index.mjs';

const MIRROR = 'D:/gridatlas-ci/offline-sandbox/deps';
const PORT = 8907;
const VERSION = process.argv[2] || '202609071021';
const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8', '.geojson': 'application/json; charset=utf-8',
  '.css': 'text/css; charset=utf-8', '.png': 'image/png', '.wasm': 'application/wasm', '.parquet': 'application/vnd.apache.parquet' };

const installed = [];
const rangeLog = [];
const missed = [];
const server = http.createServer((req, res) => {
  const url = decodeURIComponent(req.url.split('?')[0]);
  let target = path.join(MIRROR, url.replace(/^\/+/, ''));
  if (fs.existsSync(target) && fs.statSync(target).isDirectory()) target = path.join(target, 'index.html');
  if (!fs.existsSync(target)) {
    // RECORD=1 installs a missing dependency once, into the same shape the URL
    // already has, so the next run is pure offline replay. The register payload
    // the identity path needs was never mirrored, which is why the control
    // failed too - a fact about the mirror, not about the cartridge.
    const seg = url.replace(/^\/+/, '').split('/');
    if (process.env.RECORD === '1' && /\./.test(seg[0])) {
      const remote = 'https://' + seg[0] + '/' + seg.slice(1).join('/');
      fetch(remote).then(async (r) => {
        if (!r.ok) throw new Error('HTTP ' + r.status);
        const buf = Buffer.from(await r.arrayBuffer());
        fs.mkdirSync(path.dirname(target), { recursive: true });
        fs.writeFileSync(target, buf);
        installed.push(remote.slice(0, 96) + '  ' + buf.length + 'B');
        res.writeHead(200, { 'Content-Type': TYPES[path.extname(target)] || 'application/octet-stream' }).end(buf);
      }).catch(() => { missed.push(remote.slice(0, 96)); res.writeHead(404).end('x'); });
      return;
    }
    missed.push(url);
    res.writeHead(404).end('not in mirror');
    return;
  }
  if (req.method === 'OPTIONS') return serveOptions(res);
  rangeLog.push(req.method + ' ' + (req.headers.range || '-') + ' ' + path.basename(target));
  serveWithRange(req, res, target, TYPES[path.extname(target)] || mimeFor(target));
}).listen(PORT);

const CASES = [
  { ref: '13429', name: 'Ossian', tech: 'wind_offshore', expect: 'derived point exists (Crown Estate lease)' },
  { ref: '13432', name: 'unknown offshore', tech: 'wind_offshore', expect: 'no derived point; should degrade, not throw' },
  { ref: '11386', name: 'Harbour Farm', tech: 'solar', expect: 'control: register locates it, path unchanged' },
];

const browser = await chromium.launch();
const rows = [];
for (const c of CASES) {
  const ctx = await browser.newContext({ viewport: { width: 1400, height: 900 }, serviceWorkers: 'allow' });
  await ctx.route('**/*', async (route) => {
    const u = new URL(route.request().url());
    if (u.hostname === '127.0.0.1') return route.continue();
    try {
      // Forward the method and the Range header, and return the mirror's real
      // status with the range headers intact. Before this every request was
      // fulfilled as a 200 with the whole body, so DuckDB's chunk reads were
      // flattened and the identity path could not run at all.
      const hdr = route.request().headers();
      const fwd = {};
      if (hdr.range) fwd.Range = hdr.range;
      const m = await fetch(`http://127.0.0.1:${PORT}/${u.hostname}${u.pathname}${u.search}`, { method: route.request().method(), headers: fwd });
      if (!m.ok) return route.abort();
      const headers = { 'content-type': m.headers.get('content-type') || 'application/octet-stream',
                        'access-control-allow-origin': '*',
                        'access-control-expose-headers': 'Content-Range, Content-Length, Accept-Ranges',
                        'accept-ranges': 'bytes' };
      for (const h of ['content-range', 'content-length']) { const v = m.headers.get(h); if (v) headers[h] = v; }
      const body = route.request().method() === 'HEAD' ? Buffer.alloc(0) : Buffer.from(await m.arrayBuffer());
      return route.fulfill({ status: m.status, headers, body });
    } catch { return route.abort(); }
  });
  const page = await ctx.newPage();
  const out = { ref: c.ref, expect: c.expect };
  try {
    // No latitude or longitude: exactly the shape of a dead MAP link.
    await page.goto(`http://127.0.0.1:${PORT}/ventusltd.github.io/gridatlas/atlas/v/${VERSION}/`
      + `?repd_ref=${c.ref}&technology=${c.tech}&project=${encodeURIComponent(c.name)}`,
      { waitUntil: 'domcontentloaded', timeout: 45000 });
    await page.waitForFunction(() => window.__GRIDATLAS_PLACE_SEARCH__, null, { timeout: 45000 }).catch(() => {});
    await page.waitForTimeout(9000);
    Object.assign(out, await page.evaluate(() => {
      const d = window.__GRIDATLAS_PLACE_SEARCH__ && window.__GRIDATLAS_PLACE_SEARCH__.deep_link;
      return {
        status: d ? d.status : null, name: d ? d.name : null,
        mapped: d ? d.mapped : null,
        derived: d ? d.coordinate_derived : null,
        source: d ? d.coordinate_source : null,
        lease: d ? d.coordinate_lease : null,
        lon: d ? d.longitude : null,
        lat: d ? d.latitude : null,
        failCard: /did not fly to a safe map point|identity check failed/i.test(document.body.innerText || ''),
      };
    }));
  } catch (e) { out.error = String(e).slice(0, 90); }
  rows.push(out);
  await ctx.close();
}
await browser.close();
server.close();

const ranged = rangeLog.filter((l) => !l.includes(' - '));
console.log('  range requests served: ' + ranged.length + (ranged.length ? '  e.g. ' + ranged.slice(0, 3).join(' | ') : ''));
if (installed.length) { console.log('  installed into the mirror: ' + new Set(installed).size); }
if (missed.length) { console.log('  still missing: ' + [...new Set(missed)].slice(0,4).join(' | ').slice(0,200)); }
console.log(`  version ${VERSION}, offline, no coordinates in any link`);
console.log('  ref     status                    mapped derived  source                          failCard');
for (const r of rows) {
  console.log('  ' + String(r.ref).padEnd(8) + String(r.status).padEnd(26)
    + String(r.mapped).padEnd(7) + String(r.derived).padEnd(9)
    + String(r.source).slice(0, 30).padEnd(32) + String(r.failCard));
  if (r.name) console.log('           name: ' + r.name); if (r.lease) console.log('           lease: ' + r.lease + '  at ' + r.lon + ', ' + r.lat);
  if (r.error) console.log('           ERROR ' + r.error);
}
