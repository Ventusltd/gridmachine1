# Interconnectors and the Ventus grid engine — state, deployment path, and what a Linux clone must reproduce

**Written:** 2026-09-07 13:30 UTC
**By:** Claude Code, Windows, from the repositories at their pushed commits, the live origins, and the offline rig at `D:\gridatlas-ci`. Every figure is measured in-session; where a figure was wrong earlier, both values are given.
**Commit vector this report describes:** gridatlas `380c7ea` (compositions v9.145 `202609071213`, v9.146 `202609071232`) · globalgrid2050 `28e41f12` (Pipeline News `202609071221`) · ventus-grid-engine `abaa718` · data-interconnectors `1e00d0e`.

---

## 1. Interconnectors — what exists, in three repositories

### 1.1 The reference list (`Ventusltd/data-interconnectors`)

`reference/interconnector_cables.csv`, 16 rows: 10 operational links with a BMRS code (IFA, IFA2, ElecLink, BritNed, Nemo Link, North Sea Link, Viking Link, East West, Greenlink, Moyle) and 6 announced without one (NeuConnect 2028; Tarchon, LionLink, Nautilus, MaresConnect, LirIC, all 2032). Columns: code, country, name, capacity GW, status, flow-data status, target year, project link, notes. **No operator column, no coordinates.** Total 17.95 GW; largest IFA and LionLink at 2 GW. A monthly updater (`pipelines/monthly_update_interconnectors.py`) exists; the flow series (import/export MWh 2020–2026, 70 rows) lives in globalgrid2050 `uk_energy_tracking_v6`.

### 1.2 The geometry (`Ventusltd/gridatlas`)

- `atlas/data/interconnector-endpoints.json` — the GB converter for all 10 operational links, taken from our own `grid_substations.geojson` (Sellindge, Chilling, Grain, Richborough, Blyth, Bicker Fen, Deeside, Pembroke, Auchencrosh); the far converter from OpenStreetMap `power=converter` for **2** (ElecLink → ElecLink Converter Station, Calais; BritNed → HVDC Britned, Maasvlakte). OSM holds 596 converter elements in the bbox and only 43 carry a name, which is why 8 far ends are unmatched.
- `atlas/data/interconnectors.geojson` — two drawable straight lines and their mid-line nodes. BritNed 234.9 km straight line against 245 km known submarine cable (route factor 1.043, from *BritNed v ABB* [2018] EWHC 2616); ElecLink 59.93 km.
- `atlas/coordinate-systems.json` — every CRS in play: REPD EPSG:27700 metres, Crown Estate leases EPSG:4326 polygons (point-on-surface, never centroid), converters EPSG:4326 points.
- `atlas/interconnectors.config.json` — status `RENDERED_AND_ARRIVAL_WIRED` as of `380c7ea`; the earlier midpoint-arrival plan is kept in the file marked SUPERSEDED, with the measurement that killed it (a BritNed midpoint is 59.2 km from the nearest substation and the far end resolved to Lowestoft at 165.9 km).

### 1.3 The product surfaces

**Atlas v9.143** (`202609071005`) draws the two lines and nodes on `l-interconnectors` / `l-interconnector-nodes`, default hidden, same pixels as the offshore layer.
**Atlas v9.146** (`202609071232`) fires the span model from a MAP link: `?interconnector=INTNED&technology=interconnector&anchor=midpoint|gb_converter&latitude&longitude&zoom`. The project arrival lane hands over (`HANDED_TO_INTERCONNECTORS`) instead of measuring a generator from the sea; the module waits for the substation payload, measures each converter within the per-end search budget (the radius box, 10 km at boot on the measured run, 40 km when empty), frames the span, opens a card. A link with no far converter flies to the GB converter, measures it, and states the other end is not located.

Offline replay, network cut, 2026-09-07 12:50 UTC:

| case | outcome |
|---|---|
| BritNed (both ends) | `RESOLVED`, layers visible, zoom 8.0, card open; GB end **Grain Static Inverter Plant 0 km, 20 substations within 10 km**; far end `coverage: NONE` |
| Viking Link (GB only) | `NOT_DRAWABLE`, zoom 10, card open; **Bicker Fen 0.001 km, 8 within 10 km**; far converter stated not located |
| REPD 11386 (control) | `MEASUREMENT_CLAIMED`, nearest-kV card printed, untouched |

Three faults were found building this, all present in v9.142/v9.143 as shipped: the module read `link.substations`, which the lane never published — **the GB end had never actually been measured**; the radius-box value was labelled "user" at boot; a GB-only arrival left the map at zoom 4.2 while claiming it had moved.

**Pipeline News `202609071221`** — INTERCONNECTORS is a tab. 16 rows in their own pinned product `data/v9.8/` (sha256 `d13d6c24…`), built deterministically from the three inputs pinned as git-blob bytes; never counted in ALL TECH (7,680 stays the contract; the gate proves no interconnector is inside the spine). MAP links carry the BMRS code and never `repd_ref`; 10 links, 6 honest NO MAPs. A midpoint in a link is the node the Atlas draws — measured to be the **planar mean** of the converter coordinates, 1.44 km from the great-circle midpoint on BritNed — and is labelled `MIDPOINT_LABEL_ANCHOR`, never a location. Runner and browser smoke PASS.

### 1.4 What is not held

- 8 far-end converters (IFA/IFA2 at Les Mandarins/Tourbe, Nemo at Zeebrugge/Gezelle, NSL at Kvilldal, Viking at Revsing, EWIC at Woodland, Greenlink at Great Island, Moyle at Ballycronan More are the known *names*; none is a coordinate we hold from a source we can cite). Candidates: planning consents, MMO / marine-licence corridor plans, TSO publications (RTE, Elia, TenneT, Statnett, Energinet, EirGrid). Each yields a name or a coordinate; only OSM so far yields a machine-readable coordinate.
- No operator for any link (the reference list has no column; nothing was invented).
- Golden-browser verification against the live origin for any of v9.141–v9.146: NOT RUN on either machine.

---

## 2. The Ventus grid engine — two copies, one proven

### 2.1 `Ventusltd/ventus-grid-engine` (`abaa718`)

The extracted maths and the deep-link contract, with proofs. Measured this afternoon: **19 proofs, 461 checks, all PASS** (`node verify.mjs`). Modules in `engine/`: geo-core, geo-area, geo-shapes, geo-geojson, v9-geodesy, v9-nearest-search, network-topology, electrical-distance, corridor-estimate, rating-envelope, connection-capacity, firm-capacity, voltage-drop, power-factor, diversified-demand, electrification-demand, published-fault-level, route-obstacles, compute-observer, **interconnector-economics**. Genome graph 53 nodes / 51 edges, regenerated by CI on each push. `deeplink/receivers.json` names the canonical receiver (`https://ventusltd.github.io/gridatlas/atlas/`) and the retired V8 route; a daily audit (`04:17 UTC`) checks it.

### 2.2 What the Atlas actually runs

The two current cartridges reference `ventus-grid-engine` **zero** times. The Atlas computes from its own `atlas/modules/` (geodesy, substation-lookup, grid-scope, declared-connections, source-registry, network-topology, sizing-arithmetic, map-click-network …) exposed as `window.__GRIDATLAS_MODULES__`; the sld-sandbox cartridge reads `networkTopology`, `gridScope`, `declaredConnections`, `corridorEstimate`, `technologyCoverage`, `sourceRegistry`, `ratingEnvelope`, `plannedChange`, `ownerBoundary` from it. The only link to the engine repo is the menu bar's pointer to the genome viewer. Pipeline News, by contrast, **does** carry the engine's deep-link contract (compiled copy of `receivers.json`, pinned by `testcode/drivers/link-targets.mjs`).

So: the engine's proofs certify a reference implementation; the product runs a sibling implementation the proofs do not touch. The engine README already lists the seams (`docs/v9-duplication.md`, `v8-duplication.md`). Nothing in this report changes that; it records it as the largest unproven surface in the arrival path.

### 2.3 A stated position the interconnector work now sits beside

`engine/interconnector-economics.js` opens with a decision: subsea **routes** are licensed data (TeleGeography), NESO and National Grid publish none, so "this module holds no coordinates, exports no geometry, and the estate's map does not draw these cables." The Atlas since v9.143 draws a dashed **straight line between two converters** from OSM (ODbL) and our own substation payload, labelled `STRAIGHT_LINE_CONVERTER_TO_CONVERTER`, never a route. I read these as compatible — the refusal is of route geometry, and a straight line labelled as such is not a route — but the engine's sentence says "does not draw these cables" and the map now draws a line. **That is a wording conflict between a published position and a shipped layer, and it is the owner's to resolve:** either the engine note distinguishes route (refused) from converter-to-converter straight line (own data, allowed), or the layer comes off. Nothing in the economics module is affected: it is text and numbers, and the rent formula (`capacity × utilisation × hours × |spread|`) has no geometry in it.

---

## 3. How this deploys — a CI runner's view of CD

`D:\gridatlas-ci\probes\cd-trace.mjs` computes the LF git-blob sha256 of every artefact a commit produced and fetches the live origin with `cache: no-store`. MATCH means CD completed for that file; STALE means pushed but not served; 404 means never deployed. Run 13:13 UTC:

```
gridatlas       380c7ea   8 artefacts  8 MATCH   (v9.146 current.json, cartridge, manifest; v9.145 cartridge; endpoints, geojson, config; root current.json)
globalgrid2050  28e41f12  5 artefacts  5 MATCH   (202609071221 index, v9.8 partition + manifest, link module; catalogue)
engine          abaa718   3 artefacts  3 MATCH   (receivers.json, index.html, genome/engine-graph.json)
```

16 / 16 MATCH after correcting one probe path. The three CD mechanisms differ and the runner records them:

- **gridatlas** — GitHub Pages serves `main` directly; there is no deploy workflow. A push *is* a deploy after Pages' own build latency (measured today: under four minutes for v9.145). `verify-live.yml` and the overnight builders can force a Pages build through the API.
- **globalgrid2050** — `deploy-pages.yml` on push to `main` **with path filters** (`uk_renewables_pipeline/**`, `catalogue/**`, `testcode/**`, `index.html` …). A release outside those paths never deploys; that is how `202609061329` sat at 404 through eight polls on 2026-09-06 until the filter was widened. Today's release deployed in about six minutes.
- **ventus-grid-engine** — Pages serves `main`; `verify.yml` runs the 19 proofs on push; `genome.yml` regenerates the graph and commits it back (the `abaa718` "Regenerate genome graph" commits are the bot's).

**The one thing CD does not do on its own:** promote the Atlas root. `atlas/current.json` in git and live is still generation **`202609060259`** (2026-09-06 02:59 UTC). Every MAP button on Pipeline News — REPD and interconnector alike — lands on that composition, which predates v9.141. The interconnector arrival, the `RESOLVED_UNMAPPED` outcome and the Crown Estate fallback exist only on the `atlas/v/<stamp>/` lane until the root is repointed. That is a one-file change and it is the owner's call.

---

## 4. What a Linux clone must reproduce, and why it matters

Everything above was measured on one Windows machine with one Playwright build. A second machine reproducing the same receipts turns each line into a two-machine fact; a second machine disagreeing finds either a harness fault or a product fault, and both are worth more than another Windows run. The runbook beside this report (`202609071330-linux-clone-runbook.md`) gives a Claude on the Dell the exact clone, pin, build, gate and publish steps, with the receipts expected at each. In one line: clone the four repos at the vector above, build the offline mirror from the 14-file closure manifest, run the two Atlas replays and the Pipeline News suite, and — only if every control passes — hand the pair to Codex to publish under `testcode/<stamp>/` and return the links.

---

## 5. Not claimed

Not verified on the live origin: any of v9.141–v9.146. Not resolved: 8 far-end converters, any operator, the engine/Atlas duplication, the route-wording conflict in §2.3. Not run on Linux: anything. Disk on the Windows rig: 135 MB of the 100 GB budget.
