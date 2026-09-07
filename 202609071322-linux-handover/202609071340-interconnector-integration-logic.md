# Interconnector integration — the logic, layer by layer

**Written:** 2026-09-07 13:40 UTC · **Applies to:** Pipeline News `202609071221`, gridatlas v9.143 (`202609071005`) and v9.146 (`202609071232`), engine `abaa718`.
**One sentence:** an interconnector is an edge, not a generator, so it gets its own identity, its own data product, its own tab, its own link shape and its own arrival branch — and at no point is it measured from the middle of the sea.

---

## 1. The model

```
   40km <- Grain ──[ BritNed 234.9 km ]── Maasvlakte -> 40km
   -distance-interconnectors-distance+
```

- **The span is unbounded.** The line between the two converters is drawn whatever its length; the ordinary onshore radius does not apply to the span, because the span is not a search — its far end is already known: it is the other converter.
- **Each end has its own search budget.** At each converter the ordinary onshore search runs, bounded by the radius box (`#radius-input`): the engine's onshore limit at boot (10 km on the measured run), 40 km when the box is empty, whatever a user types otherwise. Widening it is a deliberate, attributable act, not a different physics applied silently to one technology.
- **Coverage is stated per end.** The GB end is measured against our substation payload and scores ~0 km because a converter sits inside a substation compound. The far end has no payload and is reported as `coverage: NONE` — *missing data, never absence of connection*.
- **The middle of the line is a label anchor, never a location.** Measured 2026-09-07: a BritNed midpoint is 59.2 km from the nearest substation, and a generator-style arrival there resolved the far end to Lowestoft at 165.9 km because the payload is GB-only. That plan was measured wrong and is recorded as superseded in `atlas/interconnectors.config.json`.

## 2. Identity

| what | value | why |
| --- | --- | --- |
| primary key | BMRS code (`INTNED`) | the code the flow data is keyed on, so geometry and MWh land in one artefact |
| links without a code | `IC-<NAME-SLUG>` (`IC-NEUCONNECT`) | announced links have no BMRS code yet; the reference list says "add only when operational code exists" |
| Pipeline News row ref | `IC-INTNED` | keeps the table's one row shape; the row states **NOT A REPD RECORD** |
| GlobalGrid id | `GG2050-IC-INTNED` | same namespace pattern as `GG2050-REPD-<ref>`, different prefix, so it can never collide |
| `technology` | `interconnector` | a fifth bucket that is deliberately **not** in the REPD spine's allow-list |
| never | `repd_ref` on the Atlas link | an interconnector is in no register the Atlas reads; sending one would make the identity path query the parquet for a code it will never find |

## 3. Data flow — three pinned inputs, one deterministic product

```
data-interconnectors/reference/interconnector_cables.csv   (16 rows: code, country, name, GW, status, target)   sha256 0ea612d8…
gridatlas/atlas/data/interconnector-endpoints.json         (GB converter ×10 from our payload; far ×2 from OSM)  sha256 df7d38ec…
gridatlas/atlas/data/interconnectors.geojson               (2 drawn lines + 2 mid-line nodes)                     sha256 50fb0680…
        │ copied as git-blob bytes into uk_renewables_pipeline/202609071221/fixtures/v9.8/
        ▼
scripts/build/interconnectors-v9-8.mjs   → data/v9.8/interconnectors.json  (16 records, sha256 d13d6c24…)
                                         → data/v9.8/interconnectors_manifest.json
```

Rules the builder enforces (`buildRecords`):
- quote-aware CSV, never `split(',')` (the 87% error of 2026-09-06 came from that);
- capacity MW = GW × 1000; status ∈ {operational, future} or throw;
- geometry class: `valid` (both converters) → anchor = **the node the Atlas draws**; `gb_end_only` → anchor = GB converter; `missing` → no coordinate at all;
- the drawn node is checked to be within 5 km of the great-circle midpoint (measured 1.44 km on BritNed; the Atlas draws the planar mean) and both are recorded in `span`;
- the straight-line km is recomputed on the estate's sphere (6371.0088) and must agree with the geojson within 0.1 km;
- no timestamps in the output, so `git diff --exit-code -- data/v9.8` proves the committed product is what the fixtures build;
- refs unique; sorted capacity desc then name.

## 4. Pipeline News — a tab outside the spine

`scripts/plugins/projects-v9-8.js` (derived from `projects-v9-5-1.js`, which is left byte-identical so the parent still runs):

```js
let all = [];            // the 7,680 REPD records - the contract
let interconnectors = []; // the 16 - loaded beside the spine, never merged
function universeFor() { return technology === "interconnector" ? interconnectors : all; }
...
filtered = universeFor().filter(project => projectMatchesV9_2(project, { technology, status, county, tokens }, ...));
```

- ALL TECH stays 7,680 / 356,474.09 MW. The count line on the tab reads *"16 of 16 interconnector records (outside the REPD spine)"*.
- The loader (`scripts/data/interconnectors-v9-8.js`) hashes the partition against its manifest and fails closed; a failure disables the tab with its reason and leaves the 7,680 untouched.
- `interconnectorRowHtml` keeps the eleven-cell row shape (so the mobile and reachability gates see one shape) with different words: no REPD ref, no planning authority, no news signal ("news signals are REPD-bound"), converters and geometry stated, NO MAP with the reason in the row when no coordinate is held.
- The MAP link (`scripts/core/atlas-interconnector-link-v9-8.js`) uses the same canonical receiver from the compiled deep-link contract — no second route — and builds:

```
https://ventusltd.github.io/gridatlas/atlas/?interconnector=INTNED&technology=interconnector
   &project=BritNed&capacity_mw=1000&anchor=midpoint&latitude=51.69895&longitude=2.36873&zoom=7
```
`anchor=gb_converter&zoom=10` for GB-only links; no link for `missing`.

Gates: `check_v9_8.mjs` rebuilds the product in memory and compares record-for-record, builds every MAP link with the page's own function and asserts identity/technology/coordinate/no-`repd_ref`, and proves the v9.1 spine manifest is byte-identical to the parent's with no interconnector inside it. `browser_smoke_v9_8.mjs` clicks the tab: 16 rows, gauges 17,950 / 16 / 2,000, ten links, six NO MAPs, back to 7,680.

## 5. Atlas — the handover and the arrival

**The project lane steps aside** (sld-sandbox, inside `runDeepLink`, first thing after the URL is parsed):

```js
if (q.get('interconnector') || String(q.get('technology') || '') === 'interconnector') {
  link.arrival_reconciliation = { status: 'HANDED_TO_INTERCONNECTORS', interconnector: q.get('interconnector') || null,
    statement: 'interconnector arrival; the project engine does not measure from a label anchor' };
  try { void loadSubstations(); } catch (_) {}   // warm the payload the module will measure against
  return false;
}
```

**The lane publishes its substations** — one line that was missing since v9.142, which is why the GB end had never actually been measured:

```js
link.substations_qualifying = out.length;
link.substations = out;          // published so the interconnectors module can measure the GB converter
```

**The interconnectors module arrives** (`arrive(map, geojson)`, called after `paint`):

1. read `interconnector=` (upper-cased), record `state.arrival = { requested, anchor, status: 'PENDING' }`, show both layers;
2. find the link by BMRS code (or name) and its `link-line` + `midpoint` features;
3. **no line held** → `NOT_DRAWABLE`: fly to the URL's coordinate (the GB converter, zoom clamped 5–14), wait for the payload, measure that one end, open a card that says the far converter is not located; nothing is measured at the far end;
4. **line held** → wait for `__GRIDATLAS_NEON_LINKS__.substations` (up to 60 s at 500 ms), read the budget from the radius box, measure `gb` against the payload and `far` against an empty list (→ `coverage: NONE`), rebuild the label, then after the shell's own `flyTo` has settled (`map.once('idle')` with a 1.5 s fallback) `fitBounds` the span (padding 90, maxZoom 9) and open the card on the drawn node;
5. `status: 'RESOLVED'` with `ends`, `search_km`, `substations_seen`, `waited_ms` on `__GRIDATLAS_INTERCONNECTORS__.arrival`.

The card (monospace, escaped) prints: name · code · interconnector; the span label; **GB end** nearest substation at N km · count within budget; **Far end** the coverage statement; straight-line km, known submarine cable km, route factor; net direction; the budget and its source ("radius box"), and that the box widens it.

## 6. Provenance kept separate, everywhere

- Identity provenance (BMRS code / name slug) and coordinate provenance (`anchor_kind`: `MIDPOINT_LABEL_ANCHOR` | `GB_CONVERTER` | `NONE`) are separate fields in the partition, on the row and on the link — the same discipline as `coordinate_source` / `coordinate_derived` on REPD arrivals.
- The straight line is labelled `STRAIGHT_LINE_CONVERTER_TO_CONVERTER` and never called a route; the one measured route factor (BritNed 1.043) is an observation, not a constant.
- The engine's `interconnector-economics` module holds **no geometry** by decision (subsea routes are licensed data); the Atlas draws a straight line from OSM and our own payload. The two statements need reconciling in words (see the main report §2.3); neither depends on the other's data.

## 7. Invariants a reviewer can test

1. No REPD partition contains `technology: interconnector` or a ref starting `IC-`.
2. Every interconnector MAP link carries `interconnector=` and `technology=interconnector`, and never `repd_ref`.
3. A `valid` record's `longitude/latitude` equals the drawn node's coordinates exactly; a `missing` record's are `null`.
4. `interconnectors.json` rebuilt from `fixtures/v9.8` is byte-identical to the committed file.
5. On arrival, `__GRIDATLAS_NEON_LINKS__.arrival_reconciliation.status === 'HANDED_TO_INTERCONNECTORS'` and the project card is never opened.
6. On a `valid` arrival, `arrival.ends[0].nearest_km` is a number (GB measured) and `arrival.ends[1].coverage === 'NONE'`.
7. On a GB-only arrival, the map zoom is ≥ 9 and `arrival.ends[1] === null`.
8. The REPD control (11386) arrives exactly as before the change: `MEASUREMENT_CLAIMED`, nearest-kV card printed.

Measured on Windows, offline, 2026-09-07 12:50 UTC: all eight hold (BritNed: Grain 0 km, 20 within 10 km; Viking Link: Bicker Fen 0.001 km, 8 within 10 km). Not yet measured on Linux or on the live origin.

## 8. What would change it

- A far converter located from a citable source → the link moves from `gb_end_only` to `valid` in the endpoints file; the builder, the tab and the arrival follow with no code change.
- A published route under usable terms → the engine's refusal is the thing to change, deliberately; the straight line stays labelled as a straight line until then.
- Root `atlas/current.json` repointed to `202609071232` → the MAP buttons on the live Pipeline News start reaching this arrival; until then they land on generation `202609060259`, which ignores `interconnector=`.
