# Candidate pair GG2050-PAIR-20260907T141211Z-W — built, run by two runners, branch only

**Written** 2026-09-07 14:30 UTC, Windows rig. **Answers** gridmachine2 `reports/20260907T140301Z-paired-coherence-build-plan`.
**Row:** `Ventusltd/testcode` branch `worker/windows-rig/pair-20260907T141211Z-W`, directory `sandbox/pairs/20260907T141211Z-W/`.

| commit | what it is |
| --- | --- |
| `b0a6fe5040e2f4844bf4dcf5496a06afa15507df` | the pair, untested (`test_verdict: NOT_RUN`), with its tests, exporter and runner workflow |
| `e2f43df` | first receipt from the D: runner lane, network cut: **PASS**, control valid |
| `e196a86` | dependency record from the receipt's misses; runner re-receipts on every changed fingerprint |

Nothing is on `main`, nothing is promoted, no preview URL is claimed (testcode has no Pages). Owner approval is `NOT_REQUESTED`.

## 1. Pair ID and what it binds

`GG2050-PAIR-20260907T141211Z-W` · lane `windows-rig`, namespace `W` · experiment `EXP-PN202609071221-ATLAS202609071232-v1` · parent none.

| side | source | how it was taken |
| --- | --- | --- |
| Pipeline News | globalgrid2050 `uk_renewables_pipeline/202609071221` (release tree from HEAD) | `git archive` blobs, LF bytes; 82 served files hashed |
| Atlas | gridatlas composition `202609071232` (v9.146), shell `202608300453-atlas-v9` | `git archive` blobs; all 4 cartridges byte-match the composition's sha256 at build |
| contract | ventus-grid-engine `deeplink/receivers.json` | copied as `atlas/deeplink/receivers.json`, canonical route `../` (the pair's own atlas) |
| interconnector data | data-interconnectors `reference/interconnector_cables.csv` `0ea612d8…` | pinned fixture inside the pipeline copy |

**Declared divergence from the source release, exactly two files:** the receiver module rebound to the pair-local contract (routes resolved against `RECEIVERS_URL`), and the MAP ATLAS nav link. Every other served byte equals its globalgrid2050 blob (`pair.json → pipeline.divergence_from_source`).

**Not fully self-contained**, and the receipt is what said so: three data inputs are reached by absolute URL outside the pair. The register parquet (`174040c3…`, pinned by hash in the cartridge) came from the offline mirror. The news partition `dist/major_project_news_v9_5_1.json` tracks `main`, is **unpinned**, and was aborted; the projects table and every MAP href rendered without it. The transmission-network layer from data-grid-gb `1c9909d1…` is pinned and was aborted; arrivals did not depend on it. All three are now rows in `pair_components` with `EXTERNAL_BY_ABSOLUTE_URL`, the unpinned one marked as such.

## 2. Two runners, one harness, no hand-driving

The user's instruction mid-build: let CD and the runners do the running. So the pair carries its own harness (`tests/run-pair.mjs` + `tests/range.mjs`) and two runners execute it:

- **D: lane 4** (`D:\gridatlas-ci\pair-runner.mjs`, 4-hour window, 10-minute gap). Serves the clone root with Range/206 semantics, answers every other host from the offline mirror or aborts it. Fingerprints the pair (outputs excluded), skips unchanged pairs, runs the harness, builds the relational export, writes the verdict into `pair.json`, commits and pushes to the pair's branch. Never `main`, never force.
- **Hosted** (`.github/workflows/pair-runner.yml`, `on: push: branches: ["worker/**"]`). Same harness, `PAIR_NET=online`, Playwright 1.58.2 pinned, receipts uploaded as artifacts and never committed: the branch has one writer. Run 34132439820 on `b0a6fe5`: **completed, success**. Run 34132561384 on `e2f43df`: in progress at writing.

The two receipts answer different questions and are kept apart: D: says the pair's bytes pass alone; the hosted run says the pair's bytes pass against the live dependencies.

## 3. Valid-control receipt (D:, network cut)

`evidence/run-2026-09-07T14-21-10-632Z.json` · Node v24.19.0, Playwright 1.58.2, Chromium 145.0.7632.6, win32 · 50,994 ms · 680,734 bytes of evidence · 0 page errors on any page.

Every arrival below was reached by clicking through the pair's **own rendered MAP href** (search box → row → `a.atlaslink`), and every href started with the pair atlas route: `{"11386":true,"13429":true,"13432":true,"IC-INTNED":true,"IC-INTVKL":true}`.

| order | case | sentinel read | result |
| --- | --- | --- | --- |
| control | 11386 Harbour Farm | `deep_link.status` RESOLVED, mapped; `links_drawn 5`, `nearest_km 2.258`, `MEASUREMENT_CLAIMED`, nearest-kV line on page, zoom 13.83 | **PASS** — the run is valid |
| 1 | 13429 Ossian | RESOLVED, `coordinate_source CROWN_ESTATE_LEASE_POINT_ON_SURFACE`, `coordinate_derived true` | PASS |
| 2 | 13432 Marram | RESOLVED_UNMAPPED, `coordinate_source NONE`, no failure card | PASS |
| 3 | INTNED BritNed, midpoint anchor (direction A) | `arrival.status RESOLVED`, card OPEN, framed, GB end **Grain Static Inverter Plant 0 km** (search 10 km, 20 within), far end `coverage NONE`, lane `HANDED_TO_INTERCONNECTORS`, 5,800 substations seen | PASS |
| 4 | INTNED, `anchor=gb_converter` (A′) | RESOLVED, card OPEN, Grain 0 km, span still framed | PASS |
| 5 | INTVKL Viking Link, GB only | `NOT_DRAWABLE`, card OPEN, framed `gb_converter`, **Bicker Fen Substation 0.001 km**, far end not held, zoom ≥ 9 | PASS |
| 6 | INTNED far converter → GB (direction B) | no far-end arrival branch and no substation payload outside GB in v9.146 | **NOT_IMPLEMENTED** — recorded as missing coverage, not as a pass or a fail |

Outcome `PASS`: 6 of 6 scored cases with a valid control; 1 direction NOT_IMPLEMENTED. Screenshots for every case sit in `evidence/`. If the control fails, the harness writes `HARNESS_INVALID` and scores nothing.

## 4. Relational export and the reverse-impact query

`relational/build.py` (stdlib Python, run by both runners) builds `pair.sqlite` and exports every table as TSV and one `export.json`: 2 release_pairs (one is the D1 demo child), 105 component_versions, 103 pair_components, 22 dependency_edges with `evidence_status ∈ {declared, static-resolved, runtime-observed, unresolved}`, 1 test_definition (harness sha256 + required control), 1 test_run with `control_run_id`, 8 run_inputs, 7 test_cases, 1 observation, 1 quarantine row. `reports` and `approval_events` are empty because there is no approval to record.

`relational/impact-query.sql`: a recursive CTE from a changed dependency up through `dependency_edges.consumer_id`, joined to `pair_components`, `run_inputs` and `test_runs`, with a path-string visited set and a depth cap of 12. **Q1**, "which tests consume `atlas/data/interconnectors.geojson`", returns 7 rows: the geojson itself, the Pipeline News partition built from it, the sld-sandbox cartridge that draws it, the projects plugin, the composition, the receiver, the link module, each with its run and recorded outcome and the evidence classes of its edges. Output in `relational/IMPACT.md`.

## 5. The four demonstrations (same file)

- **D1 changed input → STALE.** A demo child pair carries a regenerated geojson with a new hash. The parent's PASS receipt evaluates to `STALE for child (input hash changed)`: the historical PASS stays attached to its original bytes and does not transfer.
- **D2 cycle terminates.** `demo:A → demo:B → demo:A`: the query returned 2 rows and finished.
- **D3 unresolved stays visible.** The eight unlocated far converters are a component with `consumption_status UNRESOLVED` and an `unresolved` edge into the cartridge; the impact answer carries that status through four depths to the link module rather than dropping the edge.
- **D4 unchanged failure quarantined.** `substation-intelligence 451,935 bytes > 368,640` (first seen 2026-09-06 23:58:53Z) is a quarantine row; runs of that test queued by this pair: 0. Eligibility returns only when the cartridge bytes, the boundary or the proof change.

## 6. Both-direction interconnector coverage, stated plainly

Direction A (GB converter → span, midpoint or GB anchor): measured, twice, 0 km at Grain. Viking Link: GB end measured, far end absent, drawn nothing. Direction B (far converter → GB): **not implemented**, and the pair says so in its receipt, its `known_faults_carried`, and the relational export. Eight of sixteen links have no far coordinate; two are drawable end to end (BritNed, ElecLink).

## 7. Attribution and what was not done

No new packages. Playwright 1.58.2 and Chromium 145.0.7632.6 from the existing LocalCI install (resolved by `PAIR_PLAYWRIGHT`, then `node_modules`, then that path); `range.mjs` is the rig kit's; the relational layer is stdlib sqlite3. The earth-radius fault (6371.0088 in the interconnector module and builder against R_ATLAS 6378.137) is carried, declared, and reserved for a child pair; it was not patched into this one. Root promotion and the engine wording conflict stay with the owner.

**For the Linux lane:** the branch is yours to clone and run. `node tests/run-pair.mjs --mirror <your mirror>` with the network cut, or `PAIR_NET=online`, then `python3 relational/build.py`. A receipt from Linux beside the two above would give the pair its third independent runner.
