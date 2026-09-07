# GlobalGrid2050 Grid Machine — session log, Windows lane

From: Grid Machine 01, Windows (lane `windows-rig`, namespace `W`) · To: any later session, and Grid Machine 02, Dell Linux
Snapshot: **2026-09-07 14:37 UTC**
Status: **candidate pair built, proved offline, running unattended; nothing promoted**
Naming: GlobalGrid2050 is the product. `windows-rig` / `W` and `dell` / GM02 are build lanes, not agent brands.

This is the resume file. Section 9 is the only part a new session must read to continue; everything above it is the record of how the state came to be.

## 1. Owner's instructions in force

Given in this order, all still binding:

1. Build a competing, independently tested PipelineNews–GridAtlas candidate pair in `Ventusltd/testcode`, on an isolated branch. Keep tests, candidates and release tooling out of production repositories.
2. "You are publishing in gridmachine1 that's yours" — my evidence and analysis go to `Ventusltd/gridmachine1`, not gridmachine2.
3. "Don't use codex or Claude in the names we need to stick to globalgrid2050 brand to not confuse the market" — no agent names in any identifier, directory or branch.
4. "Use CD to deploy the build code the runners rather than wasting tokens" — the runners execute the tests; a session does not hand-drive them.
5. "Make the runners do the heavy lifting, raise the external SSD ceiling to 900GB, place the logic in the 20 cpu each at 20% min use, go to sleep and wake up to check every 15 minutes, keep dynamically adjusting the cd deploy plan, but prove it offline first and if offline doesn't work then prove it on testcode repo, keep overwriting the same file, keep testcode to max 300MB ceiling for live tests, and use gridmachine1 for analysis of it."
6. Standing: a PASS is reported, never promoted — promotion is the owner's call at the desk. Never re-run the digital-twin harness or touch `C:\Users\vikra\LocalCI\PipelineNews-GridAtlas\digital-twins`. Never edit a published version. Never force-push or write to `main` in testcode.

## 2. What exists now

| artefact | location | state |
| --- | --- | --- |
| Candidate pair | `Ventusltd/testcode` branch `worker/windows-rig/pair-20260907T141211Z-W`, dir `sandbox/pairs/20260907T141211Z-W/` | offline PASS, repeats 4/4, branch only |
| Pair report | `gridmachine1/202609071430-pair-20260907T141211Z-W/README.md` (`d4e2550`) | committed |
| Live CD plan | `gridmachine1/analysis/cd-plan.md` + `runner-status.json` | overwritten by the runner every cycle |
| Pair runner (lane 4) | `D:\gridatlas-ci\pair-runner.mjs` | running, pid 37424, 690-minute window from 14:32 UTC |
| Hosted runner | `testcode/.github/workflows/pair-runner.yml`, `on: push: worker/**` | three runs, all success |
| Overnight worker | `D:\gridatlas-ci\worker.mjs` | running, pid 1620 since 09:29 UTC, 21 cycles |

## 3. The candidate pair

`GG2050-PAIR-20260907T141211Z-W` · experiment `EXP-PN202609071221-ATLAS202609071232-v1` · parent none.

Pipeline News release `uk_renewables_pipeline/202609071221` bound to GridAtlas composition `202609071232` (v9.146), both taken as git blobs so no Windows line-ending ever enters a hash. All four cartridges byte-match the composition's own sha256 at build. Exactly two files diverge from the source release: the receiver module rebound to the pair-local deep-link contract, and the MAP ATLAS nav link.

The pair is **not fully self-contained**, and its own first receipt is what proved that: three data inputs are fetched by absolute URL. The register parquet is pinned by hash and was served from the offline mirror; the news partition `dist/major_project_news_v9_5_1.json` tracks `main` and is **unpinned**; the transmission-network layer is pinned to a data-grid-gb commit. The latter two were aborted under the network cut and neither arrival nor measurement depended on them. All three are now components with `EXTERNAL_BY_ABSOLUTE_URL` in the relational export.

## 4. Proof route, in the order the owner set it

**Offline first.** `tests/run-pair.mjs` serves the clone with Range/206 semantics, answers every other host from `D:\gridatlas-ci\offline-sandbox\deps` or aborts it, and reads sentinels only — never rendering. Control 11386 Harbour Farm runs first; if it fails the receipt is `HARNESS_INVALID` and nothing below it is scored. Every arrival is reached by clicking the pair's own rendered MAP href, and every href was verified to start with the pair's atlas route.

| case | sentinel | result |
| --- | --- | --- |
| control 11386 Harbour Farm | RESOLVED mapped, 5 links, nearest 2.258 km, `MEASUREMENT_CLAIMED` | PASS — run valid |
| 13429 Ossian | RESOLVED, `CROWN_ESTATE_LEASE_POINT_ON_SURFACE`, derived | PASS |
| 13432 Marram | RESOLVED_UNMAPPED, no failure card | PASS |
| INTNED BritNed, midpoint anchor | RESOLVED, card OPEN, Grain 0 km, far end `NONE`, `HANDED_TO_INTERCONNECTORS` | PASS |
| INTNED, `anchor=gb_converter` | RESOLVED, card OPEN, Grain 0 km, span framed | PASS |
| INTVKL Viking Link | NOT_DRAWABLE, card OPEN, Bicker Fen 0.001 km, zoom ≥ 9 | PASS |
| INTNED far converter → GB | no far-end branch, no substation payload outside GB in v9.146 | NOT_IMPLEMENTED |

**Then testcode.** The hosted workflow runs the same harness online, so the two receipts answer different questions: the D: receipt says these bytes pass alone, the hosted receipt says they pass against live dependencies. Hosted runs on `b0a6fe5`, `e2f43df` and `e196a86` all completed success. The runner escalates the *proof route* to hosted only when offline returns no verdict; it records hosted conclusions in `evidence/hosted-runs.json` either way.

## 5. Relational export and the four demonstrations

`relational/build.py` (stdlib only) builds `pair.sqlite` and exports every table as TSV plus one `export.json`: 105 component versions, 103 pair components, 22 dependency edges carrying `declared` / `static-resolved` / `runtime-observed` / `unresolved`, one test definition keyed to the harness sha256 and its required control, test runs with `control_run_id`, cases, observations and a quarantine table.

The reverse-impact query is a recursive CTE from a changed dependency up through consumers to pairs and tests, with a path-based visited set and depth cap 12. Asked which tests consume `atlas/data/interconnectors.geojson`, it returns seven rows through the partition, cartridge, plugin, composition, receiver and link module.

- **Changed input invalidates applicability.** A demo child pair carrying a regenerated geojson makes the parent's PASS `STALE`; the PASS stays attached to its original bytes.
- **Cycles terminate.** `A → B → A` returns 2 rows and finishes.
- **Unresolved stays visible.** The eight unlocated far converters are `UNRESOLVED` and carried four levels into the answer, not dropped.
- **Unchanged failure stays quarantined.** `substation-intelligence 451,935 > 368,640` is a quarantine row with zero re-runs; eligibility returns only when the bytes, the boundary or the proof change.

## 6. The runner, and why it is shaped this way

Cycle every 15 minutes, 12-minute working budget, then sleep. Per cycle: fingerprint the pair (outputs excluded), run offline if the fingerprint changed, build the relational export, fetch hosted conclusions, then spend the remaining budget on repeat copies for a pass-rate — the only honest measure of "repeatable". Receipts are overwritten in place (`evidence/receipt-windows-rig.json`, `hosted-runs.json`, `repeat-stats.json`); history is git's job. Repeat copies write to `D:\gridatlas-ci\runs\pair-repeats\`, never into testcode.

**Copies are sized by RAM, not by CPU count.** The machine has 20 CPUs idling at 3% but only 5–8 GB free memory, and each Chromium copy costs about 1.2 GB. The first attempt at four copies with five parallel contexts each produced 8 consecutive `NO_RECEIPT` results and the host started killing background processes for low memory. Capping at 2 copies × 2 contexts, with 3 GB reserved, produced 4/4 PASS at 64–90% CPU during the batches. The CPU floor of 20% is met by the batches; the cycle average, which includes sleep, is not the same number and is reported separately.

Ceilings enforced in code: `sandbox/pairs` ≤ 300 MB, above which the runner stops committing and records the breach; `D:\gridatlas-ci` ≤ 900 GB, reported every cycle (0.13 GB now).

## 7. Faults found and fixed this session

| fault | how it showed | fix |
| --- | --- | --- |
| Repeat copies wrote receipts into the pair's `evidence/`, overwriting each other | 8 consecutive `NO_RECEIPT` | `PAIR_EVIDENCE_DIR` and absolute receipt paths (`4c8769b`) |
| Four Chromium copies exhausted RAM | host killed background tasks | copies capped at 2, 3 GB reserved, 1.2 GB per copy |
| Runner file had an unbalanced bracket | `node --check` failure before launch | fixed before the first detached start |
| Pair reached three hosts by absolute URL, one unpinned | receipt `mirror_misses` | recorded as components and edges (`e196a86`) |

## 8. Carried, declared, not fixed

- **Earth radius.** The interconnector module and the Pipeline News builder use 6371.0088 km against the estate decision `R_ATLAS = 6378.137`. Spans read 0.11% low (BritNed 234.900 vs 235.163 km). Per-end measurements are unaffected. Fix belongs in a child pair or v9.147, not a patch to a published version.
- **Direction B.** No far-converter arrival exists; 8 of 16 links have no far coordinate.
- **Proof gate.** `gridatlas` `run-current.mjs` reads root `current.json` (generation 202609060259) and has been red since 2026-09-06 23:58. Promoting root to v9.146 alone would not turn it green: the lane's substation-intelligence cartridge also crosses the 368,640-byte boundary.
- **Owner decisions pending.** Root Atlas promotion; the engine's wording that refuses geometry while the Atlas draws a straight line.

## 9. Resume point

State to trust: `RESUME.json` in this directory, and `analysis/cd-plan.md` at the repository root, which the runner rewrites every cycle. If `cd-plan.md` is older than about 20 minutes, the runner has stopped.

To resume:

1. Check both runners are alive by command line: `worker.mjs` (window ends ~15:29 UTC) and `pair-runner.mjs` (window ends ~02:02 UTC on 2026-09-08). Relaunch a dead one detached with `CI_WINDOW_MIN` set to the **remaining** minutes only, working directory `D:\gridatlas-ci`.
2. Recreate the supervision check as a session cron at six-hour cadence (the owner reduced it from 15 minutes on 2026-09-07); it is session-only and does not survive. The owner may prompt for a check at any time.
3. Read `analysis/cd-plan.md` for the current per-pair verdicts, and `sandbox/pairs/<pair>/evidence/` on the branch for the receipts behind them.
4. Do not promote anything. Do not touch digital-twins. Do not rename anything to include an agent name.

Next work, in the order it should be taken: a child pair fixing the earth radius on `R_ATLAS`; repo-convention proof files for v9.145 and v9.146; the eight far-end converters; then the owner's decisions.

## 10. For the Linux lane

The branch is clonable and self-driving. With a local mirror: `node tests/run-pair.mjs --mirror <mirror>` then `python3 relational/build.py`; or `PAIR_NET=online` on a hosted runner. A Linux receipt beside the two above would give the pair a third independent runner and make the pass-rate cross-platform. The naming convention here maps to yours: lane `windows-rig` / namespace `W` is Grid Machine 01.
