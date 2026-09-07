// Measure the radius question instead of arguing it.
// Vincenty inverse on WGS84 is the reference; haversine on each radius is compared to it.
import fs from "node:fs";
const F = "C:/Users/vikra/testcode-clone/sandbox/pairs/20260907T190239Z-W/atlas/data/interconnector-endpoints.json";
const raw = JSON.parse(fs.readFileSync(F, "utf8"));
const rad = (d) => (d * Math.PI) / 180;

function haversine(a, b, R) {
  const dLat = rad(b.lat - a.lat), dLon = rad(b.lon - a.lon);
  const s = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(s)));
}
// Vincenty inverse, WGS84
function vincenty(p1, p2) {
  const a = 6378137, f = 1 / 298.257223563, b = (1 - f) * a;
  const L = rad(p2.lon - p1.lon);
  const U1 = Math.atan((1 - f) * Math.tan(rad(p1.lat))), U2 = Math.atan((1 - f) * Math.tan(rad(p2.lat)));
  const sU1 = Math.sin(U1), cU1 = Math.cos(U1), sU2 = Math.sin(U2), cU2 = Math.cos(U2);
  let lam = L, lamP, i = 0, sinSig, cosSig, sig, sinAlpha, cos2Alpha, cos2SigM, C;
  do {
    const sinLam = Math.sin(lam), cosLam = Math.cos(lam);
    sinSig = Math.sqrt((cU2 * sinLam) ** 2 + (cU1 * sU2 - sU1 * cU2 * cosLam) ** 2);
    if (sinSig === 0) return 0;
    cosSig = sU1 * sU2 + cU1 * cU2 * cosLam;
    sig = Math.atan2(sinSig, cosSig);
    sinAlpha = (cU1 * cU2 * sinLam) / sinSig;
    cos2Alpha = 1 - sinAlpha ** 2;
    cos2SigM = cos2Alpha !== 0 ? cosSig - (2 * sU1 * sU2) / cos2Alpha : 0;
    C = (f / 16) * cos2Alpha * (4 + f * (4 - 3 * cos2Alpha));
    lamP = lam;
    lam = L + (1 - C) * f * sinAlpha * (sig + C * sinSig * (cos2SigM + C * cosSig * (-1 + 2 * cos2SigM ** 2)));
  } while (Math.abs(lam - lamP) > 1e-12 && ++i < 200);
  const u2 = (cos2Alpha * (a * a - b * b)) / (b * b);
  const A = 1 + (u2 / 16384) * (4096 + u2 * (-768 + u2 * (320 - 175 * u2)));
  const B = (u2 / 1024) * (256 + u2 * (-128 + u2 * (74 - 47 * u2)));
  const dSig = B * sinSig * (cos2SigM + (B / 4) * (cosSig * (-1 + 2 * cos2SigM ** 2) - (B / 6) * cos2SigM * (-3 + 4 * sinSig ** 2) * (-3 + 4 * cos2SigM ** 2)));
  return (b * A * (sig - dSig)) / 1000;
}
// local radii of curvature
function radii(latDeg) {
  const a = 6378.137, f = 1 / 298.257223563, e2 = f * (2 - f), s = Math.sin(rad(latDeg));
  const W = Math.sqrt(1 - e2 * s * s);
  const N = a / W, M = (a * (1 - e2)) / W ** 3;
  return { N, M, gauss: Math.sqrt(M * N) };
}

const R_EQ = 6378.137, R_MEAN = 6371.0088;
console.log("Local radii of curvature (km)");
for (const lat of [51.5, 53.5, 55, 58]) {
  const r = radii(lat);
  console.log(`  ${lat}N  meridian M ${r.M.toFixed(1)}  prime vertical N ${r.N.toFixed(1)}  Gaussian sqrt(MN) ${r.gauss.toFixed(1)}`);
}

// find the two links in the data
const text = JSON.stringify(raw);
const links = raw.endpoints || [];
const pick = (re) => (Array.isArray(links) ? links : Object.values(links)).find((l) => re.test(JSON.stringify(l)));
const cases = [];
for (const [name, re] of [["BritNed", /INTNED|BritNed/i], ["ElecLink", /INTELE|ElecLink/i]]) {
  const l = pick(re);
  if (!l) { console.log(`\n${name}: not found in the endpoint file`); continue; }
  const gl = l.gb_lat, gn = l.gb_lon, fl = l.far_lat, fn = l.far_lon;
  if (![gl, gn, fl, fn].every(Number.isFinite)) { console.log(`\n${name}: endpoints incomplete`, JSON.stringify(l).slice(0, 160)); continue; }
  cases.push({ name, a: { lat: gl, lon: gn }, b: { lat: fl, lon: fn } });
}
console.log("\nSpan, measured three ways (km)");
for (const c of cases) {
  const v = vincenty(c.a, c.b), hm = haversine(c.a, c.b, R_MEAN), he = haversine(c.a, c.b, R_EQ);
  const midLat = (c.a.lat + c.b.lat) / 2;
  const best = (v / (haversine(c.a, c.b, 1))) ;   // the sphere radius that would reproduce the geodesic
  console.log(`  ${c.name}: ellipsoid (Vincenty) ${v.toFixed(3)}`);
  console.log(`     haversine R=6371.0088 ${hm.toFixed(3)}  error ${((hm - v) * 1000).toFixed(0)} m`);
  console.log(`     haversine R=6378.137  ${he.toFixed(3)}  error ${((he - v) * 1000).toFixed(0)} m`);
  console.log(`     radius that reproduces the geodesic: ${best.toFixed(1)} km   (Gaussian at ${midLat.toFixed(1)}N: ${radii(midLat).gauss.toFixed(1)})`);
}
