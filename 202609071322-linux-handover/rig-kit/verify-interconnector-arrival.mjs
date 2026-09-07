// Does an interconnector MAP link fire the span model at both ends?
//
// Driven offline against the mirror with the network cut. Three arrivals:
// BritNed (both converters held: frame the span, card open, GB end measured,
// far end reported as no coverage), Viking Link (GB converter only: no line to
// frame, state says why, no failure card), and a REPD control (11386) whose
// project arrival must be untouched by the handover.
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import { serveWithRange, serveOptions, mimeFor } from './range.mjs';
import { chromium } from 'file:///C:/Users/vikra/LocalCI/PipelineNews-GridAtlas/v004/node_modules/playwright/index.mjs';

const MIRROR = 'D:/gridatlas-ci/offline-sandbox/deps';
const PORT = 8909;
const VERSION = process.argv[2];
if (!/^\d{12}$/.test(VERSION || '')) throw new Error('usage: verify-interconnector-arrival.mjs <stamp>');

const misses = [];
const server = http.createServer((req, res) => {
  const url = decodeURIComponent(req.url.split('?')[0]);
  let target = path.join(MIRROR, url.replace(/^\/+/, ''));
  if (fs.existsSync(target) && fs.statSync(target).isDirectory()) target = path.join(target, 'index.html');
  if (!fs.existsSync(target)) { misses.push(url); res.writeHead(404).end('not in mirror'); return; }
  if (req.method === 'OPTIONS') return serveOptions(res);
  serveWithRange(req, res, target, mimeFor(target));
}).listen(PORT);

const BASE = `http://127.0.0.1:${PORT}/ventusltd.github.io/gridatlas/atlas/v/${VERSION}/`;
const CASES = [
  { name: 'BritNed both ends', url: BASE + '?interconnector=INTNED&technology=interconnector&project=BritNed&capacity_mw=1000&anchor=midpoint&latitude=51.69895&longitude=2.36873&zoom=7',
    expect: { status: 'RESOLVED', card: 'OPEN', handed: true, minZoom: 6, gbMeasured: true } },
  { name: 'Viking Link GB end only', url: BASE + '?interconnector=INTVKL&technology=interconnector&project=Viking+Link&capacity_mw=1400&anchor=gb_converter&latitude=52.9314&longitude=-0.22093&zoom=10',
    expect: { status: 'NOT_DRAWABLE', card: 'OPEN', handed: true, minZoom: 9 } },
  { name: 'control: REPD 11386 project arrival', url: BASE + '?repd_ref=11386&technology=solar&latitude=53.734542&longitude=-0.2023162&zoom=12',
    expect: { status: undefined, card: undefined, handed: false } },
];

const browser = await chromium.launch();
const rows = [];
for (const c of CASES) {
  const ctx = await browser.newContext({ viewport: { width: 1400, height: 900 } });
  await ctx.route('**/*', async (route) => {
    const u = new URL(route.request().url());
    if (u.hostname === '127.0.0.1') return route.continue();
    try {
      const hdr = route.request().headers(); const fwd = {}; if (hdr.range) fwd.Range = hdr.range;
      const m = await fetch(`http://127.0.0.1:${PORT}/${u.hostname}${u.pathname}${u.search}`, { method: route.request().method(), headers: fwd });
      if (!m.ok) return route.abort();
      const headers = { 'content-type': m.headers.get('content-type') || 'application/octet-stream', 'access-control-allow-origin': '*',
        'access-control-expose-headers': 'Content-Range, Content-Length, Accept-Ranges', 'accept-ranges': 'bytes' };
      for (const h of ['content-range', 'content-length']) { const v = m.headers.get(h); if (v) headers[h] = v; }
      return route.fulfill({ status: m.status, headers, body: route.request().method() === 'HEAD' ? Buffer.alloc(0) : Buffer.from(await m.arrayBuffer()) });
    } catch { return route.abort(); }
  });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e).slice(0, 160)));
  const out = { name: c.name };
  try {
    await page.goto(c.url, { waitUntil: 'domcontentloaded', timeout: 45000 });
    await page.waitForFunction(() => window.__GRIDATLAS_INTERCONNECTORS__ && window.__GRIDATLAS_INTERCONNECTORS__.loaded, null, { timeout: 45000 }).catch(() => {});
    await page.waitForTimeout(6000);
    Object.assign(out, await page.evaluate(() => {
      const ic = window.__GRIDATLAS_INTERCONNECTORS__ || {};
      const a = ic.arrival || null;
      // the project arrival lane publishes its `link` state as __GRIDATLAS_NEON_LINKS__
      const lane = window.__GRIDATLAS_NEON_LINKS__ || {};
      const rec = lane.arrival_reconciliation || null;
      const map = window.__GRIDATLAS_V9_MAP__;
      let vis = null;
      try { vis = map.getLayoutProperty('l-interconnectors', 'visibility'); } catch (_) {}
      const popup = document.querySelector('.maplibregl-popup-content');
      const text = document.body.innerText || '';
      return {
        loaded: Boolean(ic.loaded), links: (ic.links || []).length, error: ic.error || null,
        status: a ? a.status : undefined, card: a ? a.card : undefined, framed: a ? a.framed : undefined,
        gb_nearest: a && a.ends ? a.ends[0].nearest_name + ' ' + a.ends[0].nearest_km + ' km' : null,
        far: a && a.ends && a.ends[1] ? a.ends[1].coverage : (a && a.ends ? "not held" : null),
        handed: rec ? rec.status === 'HANDED_TO_INTERCONNECTORS' : false,
        reconciliation: rec ? rec.status : null,
        layer_visibility: vis,
        popup_text: popup ? popup.innerText.replace(/\s+/g, ' ').slice(0, 160) : null,
        failCard: /did not fly to a safe map point|identity check failed|TRY AGAIN/i.test(text),
        nearest_on_page: /Nearest\s+\d+\s*kV substation:/.test(text),
        zoom: map && map.getZoom ? Number(map.getZoom().toFixed(2)) : null,
      };
    }));
  } catch (e) { out.error = String(e).slice(0, 120); }
  out.pageErrors = errors.slice(0, 2);
  rows.push(out);
  await ctx.close();
}
await browser.close();
server.close();

let pass = true;
for (const [i, r] of rows.entries()) {
  const e = CASES[i].expect;
  // `loaded` guards against a vacuous pass: a composition the composer refused
  // loads nothing, and "no arrival state" would then match the control's
  // expectation for free. The control must also have produced a project answer.
  const controlAnswered = e.handed === false ? r.nearest_on_page === true : true;
  const zoomOk = e.minZoom === undefined ? true : (r.zoom !== null && r.zoom >= e.minZoom);
  const gbOk = e.gbMeasured ? /\d km/.test(String(r.gb_nearest)) && !/null/.test(String(r.gb_nearest)) : true;
  const ok = r.loaded === true && controlAnswered && zoomOk && gbOk && r.status === e.status
    && (e.card === undefined ? true : r.card === e.card) && r.handed === e.handed && !r.failCard;
  if (!ok) pass = false;
  console.log(`  ${ok ? 'PASS' : 'FAIL'}  ${r.name}`);
  console.log(`        loaded ${r.loaded} links ${r.links} status ${r.status} card ${r.card} framed ${r.framed} layer ${r.layer_visibility} zoom ${r.zoom}`);
  console.log(`        GB end ${r.gb_nearest} · far ${r.far} · lane ${r.reconciliation} · nearest-on-page ${r.nearest_on_page} · failCard ${r.failCard}`);
  if (r.popup_text) console.log(`        card: ${r.popup_text}`);
  if (r.error) console.log(`        ERROR ${r.error}`);
  if (r.pageErrors.length) console.log(`        pageerror: ${r.pageErrors.join(' | ')}`);
}
if (misses.length) console.log('  mirror misses: ' + [...new Set(misses)].slice(0, 3).join(' | ').slice(0, 200));
console.log(pass ? `  ${VERSION}: interconnector arrival PASS` : `  ${VERSION}: FAIL`);
process.exit(pass ? 0 : 1);
