# State of play — 2026-09-08 00:00 UTC

Everything a cold session needs to continue. Written to free context: read this, then `OVERNIGHT.md`, then work. Nothing else needs reading first.

## 1. What this estate is

Ventus is a cables and connectivity company. What the product measures is **cables**. Two applications: a table of energy projects (Pipeline News, served at `globalgrid2050.com/uk_renewables_pipeline/202609071221/`) and a map (GridAtlas, `ventusltd.github.io/gridatlas/atlas/`). Pressing MAP on a table row opens the map at that project, which resolves its identity, places the camera, draws it and fires a measuring engine.

**Root serves generation `202609060259`. The tested composition is `202609071232` (v9.146) at `/atlas/v/202609071232/`.** They are different sets of cartridges, not merely older and newer. Every owner report today was made against root, which is why several tickets needed re-testing rather than fixing.

## 2. The twenty tickets

Full detail with links and evidence in `OWNER-REPORTS.md` and `BUGS.md`. Compressed:

**Broken and confirmed.** GG-027 layers control: the label flips, the panel does not move, on phones in both orientations, identical on root and lane, and it fails entirely at 658×320 (Galaxy S9+ landscape). **Priority one, a regression.** GG-037 Scope: dead, and the diagnosis is one missing call — the computation, the drawing and the arming function all exist, nothing invokes the arming function. GG-042 landscape black screen on the table. GG-035 a battery project titled "Deep-linked project" because the map's register snapshot lacks a project the table names.

**Wrong question rather than broken.** GG-034 offshore: the engine fires wherever mapped substations lie inside its budget (proved by a floating wind demonstrator drawing five lines at 15.40, 20.73 and 22.55 km) and fails on far projects because nothing is inside it. The fix is the declared onshore connection point, not a wider radius.

**Missing data with public sources.** GG-031/GG-033 interconnectors: eight of ten links hold no far converter, so eight present as if they never leave the country. The counterparty country is **already held** per link in the energy tracker, so saying where a link goes costs nothing. Moyle is genuinely internal (GB to Northern Ireland) while East West and Greenlink are not, and the product cannot tell them apart.

**Cheap deletions and changes.** GG-041 remove Save image (print stays). GG-043 remove the older-version menu. GG-029 card opens minimised. GG-040 rename "Spider printer" to "Elements". GG-036 print centring and a scale control.

**Regression across lineages.** GG-038 the size slider exists in 34 releases of the `pipelinenews` repository, most recently `202609060232`, and is absent from the served lineage. GG-026 technology filters are a **gap**, not a regression: no release in either repository ever had the long tail.

**Structural.** GG-039: no primary key binds a Pipeline News release to an Atlas composition. The table and map disagreeing about which projects exist, reports landing on untested compositions, and a control lost between lineages are the same missing key seen three ways. The key already exists in the candidate pairs and nowhere in production.

**Correctness, low visibility.** GG-010 power flow can converge to numerical artefacts on a 238-component network and pass all three acceptance checks; needs one slack bus per component and a conditioning check. GG-004 distances use a sphere; measured against a WGS84 geodesic both radii understate (235 km span short by 713 m on 6371.0088 and 450 m on 6378.137), so the fix is the ellipsoid, not a third sphere. GG-011 bounded search has no termination rule. GG-012 beyond-radius claims more than it can when 141 of 355 published connection points hold no coordinates. GG-014 one corridor multiplier for all terrain. GG-015 placeholder 9,999 MVA ratings printed raw. GG-016 a hop count labelled electrical distance.

## 3. The architecture agreed today

**Cable engines** (`CABLE-ENGINES.md`, `CABLE-ENGINE-DATASHEETS.md`). Each engine is defined by the cable it models, not the project label. Five: substation finder within a radius, interconnector subsea link, offshore export cable to its onshore connection, 400 kV overhead line, 132 kV distribution. The first and fourth work and are **protected by their current receipts**.

**The rule that must survive: a cable engine selects the question, never whether a question is answered.** An earlier version gated measurement on technology and offshore projects were withheld entirely; that branch was removed deliberately. Every project reaches an engine; an engine that cannot answer hands to the general one and says so.

**The pipeline declares the engine.** Engine category becomes a field on the table row, shown in the table, carried in the MAP link, asserted in the receipt. Routing becomes testable before a browser opens.

**Priority:** offshore first because it does not exist, interconnectors second because half of it needs no new data, and the two working engines protected by scaling rather than altering.

## 4. What is sealed

Three capsules, all committed:

- **Engine capsule** (`reports/20260907T230000Z-engine-capsule/`): the working composition with every part hashed, three surviving copies, and the eight rules that make those engines worth copying — state your scope with counts, refuse with a reason, never lend a calibration to another question, keep published facts apart from computed ones, name the alternative, say when a join failed, say where identity came from, publish a marker when you fire.
- **Data provenance** (same directory): the voltage layers are genuinely OpenStreetMap — 4,106 features at 400 kV, 6,227 at 132 kV, 5,800 substations — proven by a mapper's own source note about digging scars on satellite imagery. Attribution under the Open Database Licence is therefore required, which makes the missing export credit a real defect.
- **Runner capsule** (`reports/20260907T232000Z-runner-capsule/`) and its siblings in `cvaa` and `ventus-grid-engine`: what the runners are, the PowerShell to set them up cold, and what they cost.

## 5. What the runners cost, measured

| condition | CPU across 20 cores |
| --- | --- |
| idle | 3 to 6% |
| one browser session on the map | **51.6%** |
| two sessions | 84.8% |
| one session with thread and paint limits | 50.6% |

**One session costs half the machine**, and flags do not help, because the cost is the map's own render loop. **The lever is duration, not concurrency.** A study that opens, measures for fifteen seconds and closes costs almost nothing; five hours of held-open sessions is what made the fans scream.

Runners live at `D:\gridatlas-ci\`: `overnight.mjs` (one study, one session), `smoke.mjs` (load measurement), `pair-runner.mjs` (the windowed lane). Every study runs five shapes together — Pixel 7 portrait and landscape, Galaxy S9+ portrait and landscape, desktop. `adb` is at `D:\android\platform-tools` for driving a real handset; no emulator is needed or wanted.

## 6. What was efficient, and what was not

The owner found **20 defects in about two hours on a real phone**. Targeted code and data reading found four more in minutes. Two adversarial reviews of the stated logic found five logic faults. **30.4 million tokens of scheduled checks and 615 identical automated passes found no product defect at all.** The day cost $357.69.

So the order is: use the product, read the code to check the claim, write one study that answers one question, and automate only what has already failed once.

## 7. Rules in force

- **Promotion is authorised without waiting**, on four conditions: a passing receipt naming the composition tested, no editing of a published version (new stamp always), the protected engines staying green, and every promotion recorded.
- Tests and candidates stay out of production repositories. Branch only in `testcode`, never main, never force-push.
- No agent or personal names in identifiers. GlobalGrid2050 is the product; GM01 and GM02 are lanes.
- Never re-run the digital-twin harness or touch `C:\Users\vikra\LocalCI\PipelineNews-GridAtlas\digital-twins`.
- Android is the phone target; iPhone is assumed to follow. Every case runs portrait and landscape, phone and desktop, in one run.

## 8. How to resume, exactly

1. Read `OVERNIGHT.md` for the queue and the log of what has already been done tonight.
2. Take the next unfinished ticket in that order. One ticket, one version, carrying the test that failed.
3. Run its study: `node D:\gridatlas-ci\overnight.mjs <TICKET>`. One session, closed at the end.
4. Make the change in the Atlas worktree at `C:\Users\vikra\gapub` (gridatlas) or the release directory in `globalgrid2050`. Never edit a published version; cut a new stamped one.
5. Verify with the same study, commit, push, and repoint what should be served.
6. Append to the log in `OVERNIGHT.md`: time, ticket, what the study measured, what changed, what verification said.

**Do not start a fifteen-minute or half-hourly check.** Nineteen such wakes cost 30.4 million tokens for answers that mostly said nothing changed. Wake on completion, and summarise every two hours.

## 9. The two things only a person can settle

Both were asked and are still open: open the same project on the tested composition and on root and say whether the layers control fires on each, and capture one URL where print does not launch beside one where it does.
