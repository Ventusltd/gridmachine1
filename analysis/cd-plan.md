# CD deploy plan, live (rewritten by the D: pair runner every 15 minutes)

Updated 2026-09-07T14:56:08.823Z · cycle 1 · lane windows-rig

Rule: prove offline first; if offline cannot prove it, prove it on the testcode hosted runner; nothing is promoted by a runner. Promotion is the owner's call.

| pair | proof route | offline outcome | hosted (latest) | determinism rate | median run | parallel |
|---|---|---|---|---|---|---|
| GG2050-PAIR-20260907T141211Z-W | offline (D:, network cut) | INCOMPLETE (2026-09-07T14:55:45.611Z) | 674a75f in_progress | 0/0 | - | 5 |

## Per-case (offline receipt)

- control-11386-harbour-farm: PASS
- 13429-ossian-derived: PASS
- 13432-marram-unmapped: PASS
- INTNED-britned-midpoint-anchor: PASS
- INTNED-britned-gb-converter-anchor: PASS
- INTVKL-viking-gb-only: PASS
- INTNED-far-converter-to-gb: NOT_IMPLEMENTED

## Resources

| cycle CPU avg | floor | CPUs | free RAM | D:\gridatlas-ci | SSD ceiling | testcode pairs | ceiling |
|---|---|---|---|---|---|---|---|
| 47.4% | 20% | 20 | 3.72 GB | 0.13 GB | 900 GB | 30 MB | 300 MB |

## Adjustments made by the runner

- 2026-09-07T14:56:05.532Z 20260907T141211Z-W: free RAM 3.9 GB, repeats paused


## Awaiting the owner

- Root Atlas promotion (v9.146 on the lane; root still 202609060259).
- Earth-radius fix (child pair, R_ATLAS 6378.137).
- Engine wording conflict on interconnector geometry.
