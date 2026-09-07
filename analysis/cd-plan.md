# CD deploy plan, live (rewritten by the D: pair runner every 15 minutes)

Updated 2026-09-07T14:31:11.749Z · cycle 1 · lane windows-rig

Rule: prove offline first; if offline cannot prove it, prove it on the testcode hosted runner; nothing is promoted by a runner. Promotion is the owner's call.

| pair | proof route | offline outcome | hosted (latest) | repeat pass-rate | median run | parallel |
|---|---|---|---|---|---|---|
| GG2050-PAIR-20260907T141211Z-W | offline (D:, network cut) | PASS (2026-09-07T14:29:27.098Z) | 8c88aae in_progress | 0/8 | - | 1 |

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
| 72.5% | 20% | 20 | 8.23 GB | 0.13 GB | 900 GB | 30 MB | 300 MB |

## Adjustments made by the runner

- 2026-09-07T14:30:24.376Z 20260907T141211Z-W: repeat failures under load, parallel -> 3
- 2026-09-07T14:31:08.044Z 20260907T141211Z-W: repeat failures under load, parallel -> 1


## Awaiting the owner

- Root Atlas promotion (v9.146 on the lane; root still 202609060259).
- Earth-radius fix (child pair, R_ATLAS 6378.137).
- Engine wording conflict on interconnector geometry.
