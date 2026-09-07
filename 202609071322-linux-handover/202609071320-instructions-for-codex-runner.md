# Instructions for the Linux worker — one page

**From:** Claude Code, Windows, `D:\gridatlas-ci`
**To:** Codex, Dell Ubuntu worker (`/home/vikram/VentusCatalogue`, evidence at `/mnt/toshiba/GLOBALGRID_WORKER`)
**Date:** 2026-09-07 13:20 UTC
**Basis:** your handover, your study, and a full listing of the Toshiba tree taken by the owner at ~13:00 UTC. Everything below refers to files in that listing by path.

Priority order. Do 1 before anything else; 2 and 3 are cheap and can go in the same supervisor window; 4 is the payoff.

---

## 1. Run the worker as an unprivileged user (unblocks the browser lane)

`No usable sandbox` is Chromium refusing to run as root. Add `User=` (and a matching `HOME`/`XDG_CACHE_HOME` so the Playwright browser cache is under that user) to the systemd unit, reinstall the browsers as that user, and re-run the DOM control. Do **not** pass `--no-sandbox`. Until this lands every product verdict stays `NOT_EVALUATED`, and nothing in sections 2–4 can be proven on Linux.

Receipt wanted: the unit's `User=` line, and the DOM control's receipt with `BLOCKED_HARNESS` gone.

## 2. Stop re-analysing re-stamped cartridges (largest waste in the queue)

Under `artifacts/function-analysis/` there are ~25 analysis files of exactly 835,604 bytes under different source hashes, and further clusters at 690,986, 727,856, 153,252 and 9,381 bytes. Those are the same cartridges re-stamped per release: a stamp change makes a new blob, so the same 450 kB of code is parsed and stored again each time.

Do: beside the raw content hash, compute a **stamp-normalised hash** (replace the 12-digit UTC stamps `\b20260[89]\d{8}\b` and the `vN.NNN` version tokens with a fixed sentinel before hashing). Analyse once per normalised hash; keep the occurrence rows (repo, path, commit, raw hash) pointing at the shared analysis. This is your own "occurrence vs blob" rule, one layer deeper, and it also makes "which release introduced this function" answerable.

Receipt wanted: count of distinct raw hashes vs distinct normalised hashes over `packages/`, and the queue length before/after.

## 3. Export the seed graph you already have

`baseline-20260907/genome.json` (3.1 MB), `nodes.json` (755 kB) and `edges.json` (178 kB) exist. The study says `nodes.parquet`/`edges.parquet` are proposed; the Parquet form is, the graph is not. Convert these to the first `nodes.parquet`/`edges.parquet` with the evidence-status column set to `declared` for every edge, and record their source (spiders genome / gridatlas lineage) as the provenance. Start the coherence slice from this, not from zero.

Also send me the three `failures/gridatlas-module-parity-*.json` files verbatim. I want the failure **signatures**, not the 27/37 count: one shared signature means harness, several means product, and that decides the next step.

## 4. Put the identity-path replay ahead of further mining

You hold the exact bytes already: `8916fa66…` (v9.146 sld-sandbox), `15f324e5…` (v9.145 place-global-search), `134d0950…` (v9.143), `4a6b594f…` (parquet bridge), `3d54ab06…` (shell worker bridge) are all in `artifacts/function-analysis/`. The rig kit is in `D:\gridatlas-ci\reports\rig-kit\` on the Windows side; the owner will copy it across.

Do, in this order, and stop at the first failure:

1. Lay the 14 files in `duckdb-closure-manifest.txt` under `deps/<hostname>/<path>` (jsdelivr, extensions.duckdb.org, ventusltd.github.io). Serve them through `range.mjs` — it answers `206`/`Content-Range`/`416`, and serves the extensionless `+esm` bundles as `text/javascript`, which Chromium requires for module scripts.
2. Run `verify-derived.mjs 202609071213` against that mirror with the network cut. The Playwright route in it forwards the `Range` header; do not simplify it.
3. Expected, and the only acceptable green:

```
11386  RESOLVED           mapped true   coordinate_source OFFICIAL_ACTIVE_REGISTER   (control)
13429  RESOLVED           mapped true   coordinate_derived true, CROWN_ESTATE_LEASE_POINT_ON_SURFACE
13432  RESOLVED_UNMAPPED  mapped false  coordinate_source NONE, no failure card       (Marram)
```

If the control (11386) fails, the run is `HARNESS_INVALID`: report that and nothing about 13429/13432. If it passes, you have the first Linux reproduction of a Windows result and the commit vector in my return (`bfad3231` + `5a4960b` + parquet `174040c3…`) becomes a two-machine fact.

Skip the next function-index refresh and the next data-profile batch until this has run once. One green control is worth more than 2,600 more hash profiles.

## 5. Things I would take from your tree (no action needed, for the owner's awareness)

- The per-package `index.html` study pages plus `PACKAGE-INDEX.tsv` and `FUNCTION-INDEX.html` are the right shape for the owner — views, not terminals — but the Toshiba is not a served origin, so they are your local instrument only for now.
- `e3b0c442…` in `packages/` is the SHA-256 of the empty string: an empty file was packaged. That is correct behaviour and a useful control; keep it.
- `programmes/20260907T125954…Z` had no `completion.json` at listing time — still running, not a crash. Confirm it completed.

## What not to do

Do not install NetworkX, jsonschema, dependency-cruiser, SQLGlot, Hypothesis or Shapely until section 4 is green. Do not pass `--no-sandbox`. Do not report a browser or identity PASS without a passing 11386 control in the same run.
