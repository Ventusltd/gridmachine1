# CD deploy plan, live (rewritten by the D: pair runner every 15 minutes)

Updated 2026-09-07T15:12:22.927Z · cycle 2 · lane windows-rig

Rule: prove offline first; if offline cannot prove it, prove it on the testcode hosted runner; nothing is promoted by a runner. Promotion is the owner's call.

| pair | proof route | offline outcome | hosted (latest) | determinism rate | median run | parallel |
|---|---|---|---|---|---|---|
| GG2050-PAIR-20260907T141211Z-W | offline (D:, network cut) | INCOMPLETE (2026-09-07T15:10:48.387Z) | 6f5e6b4 success | 4/4 | 36 s | 5 |

## Per-case (offline receipt)

- control-11386-harbour-farm: PASS · repeats 4/4
- 13429-ossian-derived: PASS · repeats 4/4
- 13432-marram-unmapped: PASS · repeats 4/4
- INTNED-britned-midpoint-anchor: PASS · repeats 4/4
- INTNED-britned-gb-converter-anchor: PASS · repeats 4/4
- INTVKL-viking-gb-only: PASS · repeats 4/4
- INTNED-far-converter-to-gb: NOT_IMPLEMENTED · repeats 0/0

## Resources

| cycle CPU avg | floor | CPUs | free RAM | D:\gridatlas-ci | SSD ceiling | testcode pairs | ceiling |
|---|---|---|---|---|---|---|---|
| 38% | 20% | 20 | 6.93 GB | 0.13 GB | 900 GB | 30 MB | 300 MB |

## Adjustments made by the runner

- 2026-09-07T14:56:05.532Z 20260907T141211Z-W: free RAM 3.9 GB, repeats paused


## Awaiting the owner

- Root Atlas promotion (v9.146 on the lane; root still 202609060259).
- Earth-radius fix (child pair, R_ATLAS 6378.137).
- Engine wording conflict on interconnector geometry.
