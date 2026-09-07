# Bug register — GlobalGrid2050 Grid Machine

Opened 2026-09-07 20:00 UTC. **Report only. Nothing here is fixed, and nothing is to be fixed until overnight CI/CD simulations produce a rate for the intermittent ones.** A ticket closes on evidence, never on silence.

Tickets are numbered once and never reused. Where a ticket already had a code in the disease register it is carried in the last column.

## Where to reproduce

| what | link |
| --- | --- |
| Pipeline News release under test | https://globalgrid2050.com/uk_renewables_pipeline/202609071221/ |
| Atlas version those links land on (v9.146) | https://ventusltd.github.io/gridatlas/atlas/v/202609071232/ |
| Previous Atlas version (v9.145) | https://ventusltd.github.io/gridatlas/atlas/v/202609071213/ |
| Root Atlas, still unpromoted | https://ventusltd.github.io/gridatlas/atlas/ |
| Candidate pair, parent | https://github.com/Ventusltd/testcode/tree/worker/windows-rig/pair-20260907T141211Z-W |
| Candidate pair, child | https://github.com/Ventusltd/testcode/tree/worker/windows-rig/pair-20260907T190239Z-W |

## Open tickets

| # | title | where it shows | evidence held | frequency | code |
| --- | --- | --- | --- | --- | --- |
| **GG-001** | **Versions do not fire consistently** | [v9.146](https://ventusltd.github.io/gridatlas/atlas/v/202609071232/), [Pipeline News](https://globalgrid2050.com/uk_renewables_pipeline/202609071221/) | Owner observation only. 615 offline runs passed, but they used a local mirror and identical bytes, so they are structurally blind to live timing, cold caches and late tiles. | **Unknown — no rate exists.** This is the blocker for every other intermittent ticket. | new |
| **GG-002** | MAP control does not fire the grid engine | as above | Classifier ran every cycle and never observed it offline. Not observed is not the same as absent, given GG-001. | unknown | D-01 |
| **GG-003** | Interconnector coverage exists in one direction only | [BritNed link](https://ventusltd.github.io/gridatlas/atlas/v/202609071232/?interconnector=INTNED&technology=interconnector&anchor=midpoint&latitude=51.699&longitude=2.369&zoom=7) | 8 of 16 links have no far coordinate; no far-end arrival branch exists. Recorded NOT_IMPLEMENTED in every receipt. | always | D-02 |
| **GG-004** | Spans measured on a sphere, and on the wrong one | same link as GG-003 | Measured against a WGS84 geodesic: the 235 km span is short by 713 m on the mean radius and 450 m on the equatorial radius. Both understate. | always | D-03 |
| **GG-005** | Exported artefacts lose their provenance | held privately on the drive | Two sample exports failed the provenance contract: one with no data credit and no composition stamp, one whose link resolves only on the machine that made it. | reproducible | D-04 |
| **GG-006** | Proof gate red on a composition nobody serves | https://github.com/Ventusltd/gridatlas/actions | Gate resolves the root composition, which is older than the lane. Lane work cannot turn it green; promotion alone would not either. | always | D-05 |
| **GG-007** | A dependency that tracks a moving branch | v9.146 | One component fetched by absolute URL with no commit pin. It aborts offline so no receipt notices, and can change under a passing version at any time. | latent | D-06 |
| **GG-008** | Consumed inputs are declared, not observed | candidate pairs | 16 rows stand for 103 components. Every applicability verdict inherits the weakness. | always | D-07 |
| **GG-009** | Silent-blank class | estate-wide | Two instances found and fixed today. Treated as a class, not an incident. | recurring | D-10 |
| **GG-010** | Power flow can accept a confident wrong number | v9.146 grid tools | 238 disconnected components. Convergence, a global residual and Kirchhoff at every bus do not exclude a near-singular solve. Missing: one slack bus per component containing the injection, and a conditioning check. | latent, high consequence | new |
| **GG-011** | Bounded nearest-search has no stated termination rule | any project arrival | A search bounded in degrees is an ellipse in metres. Without a boundary test the nearest returned may not be the nearest. | latent | new |
| **GG-012** | Beyond-radius result claims more than it can | any offshore arrival | 384 of 886 published connection points hold no coordinates, so only "nearest mapped" can be claimed. The caveat is on the page but not on the receipt or the export. | always | new |
| **GG-013** | Span label sits at a planar mean | GG-003 link | 1.44 km from the true great-circle midpoint on a 235 km span; the drawn straight line is a rhumb line, not the shortest path. | always | new |
| **GG-014** | Route factor implies precision it does not have | project cards | A single multiplier to three decimals across all terrain. The penalty distribution is right-skewed. | always | new |
| **GG-015** | Placeholder ratings displayed as measurements | substation cards | Four circuits published at 9,999 MVA on spans under a kilometre are excluded from ranges but still printed raw. | always | new |
| **GG-016** | A hop count is labelled an electrical distance | substation cards | To an engineer, electrical distance means impedance. This is a topological edge count. | always | new |
| **GG-017** | Concurrency token stops at identity | any fast re-selection | The token protects identity resolution only. A measurement from an abandoned selection can land on the current one. | intermittent by nature; may be part of GG-001 | new |
| **GG-018** | Derived coordinates not qualified in the sentence | [Ossian](https://ventusltd.github.io/gridatlas/atlas/v/202609071232/?repd_ref=13429&technology=wind_offshore&project=Ossian&zoom=8) | A point derived from a lease area may claim only an approximate distance from that area. The source field records it; the sentence a reader sees does not. | always | new |
| **GG-019** | Classifier can call a failure legitimate | child candidate pair | Three holes in the classifier written 2026-09-07: lane tested before mapping, a thrown error indistinguishable from a silent one, and beyond-radius accepted without a distance to prove the search ran. | always | new |

## Closed today, kept for the record

| # | title | how it was closed | code |
| --- | --- | --- | --- |
| GG-020 | A pass that hid a gap | Run outcome partition: complete coverage is PASS, a missing behaviour is INCOMPLETE | D-08 |
| GG-021 | A verdict that outlived its inputs | Applicability requires every consumed input at the same content hash | D-09 |
| GG-022 | Cycle guard confused identifier prefixes | Both sides of the visited test delimited; one colliding pair exists in this graph | new |
| GG-023 | Quarantine could never re-open after a dependency fix | Eligibility made transitive, plus a recorded manual revocation | new |
| GG-024 | Runner slept through most of its own cycle | Early break removed and the inter-cycle sleep dropped | new |
| GG-025 | Runner starved the host of memory | Governor measures cost per copy and holds a floor; measured 0.41 GB, not the assumed 1.2 GB | new |

## Rule for the next round

**GG-001 comes first and it is a measurement, not a fix.** Until there is a firing rate per case, measured online against the published version, cold and repeated, no intermittent ticket can be prioritised honestly and no fix can be shown to have worked. Every version after that changes exactly one thing, carries the test that failed before it, and leaves its predecessor standing as the control.
