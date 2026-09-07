// CD trace: for each artefact a commit produced, is the live origin serving
// exactly the bytes git holds? MATCH means CD has completed for that file;
// STALE means the push landed but Pages has not (or a different composition
// is being served); 404 means the path never deployed. Hashes are of the LF
// git blob, which is what Pages serves - a working-copy hash on Windows is
// CRLF and would report false STALE for every text file.
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";

const sha = (b) => createHash("sha256").update(b).digest("hex");
const blob = (repo, rev, path) => execFileSync("git", ["-C", repo, "cat-file", "blob", `${rev}:${path}`], { maxBuffer: 64 << 20 });
const head = (repo) => execFileSync("git", ["-C", repo, "rev-parse", "--short", "HEAD"], { encoding: "utf8" }).trim();

const REPOS = {
  gridatlas: { dir: "C:/Users/vikra/gapub", origin: "https://ventusltd.github.io/gridatlas/" },
  globalgrid2050: { dir: "C:/Users/vikra/OneDrive/Documents/GitHub/globalgrid2050", origin: "https://globalgrid2050.com/" },
  engine: { dir: "C:/Users/vikra/OneDrive/Documents/GitHub/ventus-grid-engine", origin: "https://ventusltd.github.io/ventus-grid-engine/" },
};

// what each repo's CD is, as read from its workflows and Pages settings
const CD = {
  gridatlas: "Pages serves main directly; no deploy workflow. Push == deploy, subject to Pages build latency. verify-live.yml and the overnight builders can request a Pages build via the API.",
  globalgrid2050: "deploy-pages.yml on push to main with path filters (uk_renewables_pipeline/**, catalogue/**, index.html, testcode/**, ...). A release outside those paths does not deploy.",
  engine: "Pages serves main directly; verify.yml runs the proofs on push; genome.yml regenerates the graph and commits it back; deeplink-receiver-audit.yml audits the canonical receiver daily at 04:17 UTC.",
};

const ARTEFACTS = [
  ["gridatlas", "atlas/v/202609071232/current.json"],
  ["gridatlas", "atlas/cartridges/202609071232-sld-sandbox-v9-8.js"],
  ["gridatlas", "atlas/manifests/202609071232-composition.json"],
  ["gridatlas", "atlas/cartridges/202609071213-place-global-search-v9-5.js"],
  ["gridatlas", "atlas/data/interconnectors.geojson"],
  ["gridatlas", "atlas/data/interconnector-endpoints.json"],
  ["gridatlas", "atlas/interconnectors.config.json"],
  ["gridatlas", "atlas/current.json"],
  ["globalgrid2050", "uk_renewables_pipeline/202609071221/index.html"],
  ["globalgrid2050", "uk_renewables_pipeline/202609071221/data/v9.8/interconnectors.json"],
  ["globalgrid2050", "uk_renewables_pipeline/202609071221/data/v9.8/interconnectors_manifest.json"],
  ["globalgrid2050", "uk_renewables_pipeline/202609071221/scripts/core/atlas-interconnector-link-v9-8.js"],
  ["globalgrid2050", "catalogue/homepage-catalogue.json"],
  ["engine", "deeplink/receivers.json"],
  ["engine", "index.html"],
  ["engine", "genome/engine-graph.json"],
];

const rows = [];
for (const [repo, path] of ARTEFACTS) {
  const { dir, origin } = REPOS[repo];
  let gitHash = null;
  try { gitHash = sha(blob(dir, "HEAD", path)); } catch { gitHash = "not-in-HEAD"; }
  const url = origin + path;
  let status = 0, liveHash = null;
  try {
    const r = await fetch(url, { cache: "no-store", signal: AbortSignal.timeout(20000) });
    status = r.status;
    if (r.ok) liveHash = sha(Buffer.from(await r.arrayBuffer()));
  } catch (e) { status = "ERR " + String(e.message).slice(0, 30); }
  const verdict = status !== 200 ? String(status) : liveHash === gitHash ? "MATCH" : "STALE";
  rows.push({ repo, head: head(dir), path, verdict, git: gitHash.slice(0, 12), live: liveHash ? liveHash.slice(0, 12) : "-" });
}

console.log("CD TRACE  " + new Date().toISOString());
for (const [k, v] of Object.entries(CD)) console.log(`  ${k}: ${v}`);
console.log("");
console.log("  repo            HEAD     verdict  git-blob      live          path");
for (const r of rows) console.log(`  ${r.repo.padEnd(15)} ${r.head.padEnd(8)} ${r.verdict.padEnd(8)} ${r.git.padEnd(13)} ${r.live.padEnd(13)} ${r.path}`);
const n = (v) => rows.filter((r) => r.verdict === v).length;
console.log(`\n  MATCH ${n("MATCH")} · STALE ${n("STALE")} · 404 ${n("404")} · other ${rows.length - n("MATCH") - n("STALE") - n("404")}`);
const rootGen = JSON.parse(blob(REPOS.gridatlas.dir, "HEAD", "atlas/current.json").toString()).generation;
console.log(`  gridatlas root current.json generation in git: ${rootGen}  (root promotion is the owner's call)`);
