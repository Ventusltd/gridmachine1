# CD deploy plan, live (rewritten by the D: pair runner every 15 minutes)

Updated 2026-09-07T14:34:06.029Z · cycle 1 · lane windows-rig

Rule: prove offline first; if offline cannot prove it, prove it on the testcode hosted runner; nothing is promoted by a runner. Promotion is the owner's call.

| pair | proof route | offline outcome | hosted (latest) | repeat pass-rate | median run | parallel |
|---|---|---|---|---|---|---|
| GG2050-PAIR-20260907T141211Z-W | offline (D:, network cut) | PASS (2026-09-07T14:32:17.193Z) | 0f386ec in_progress | 4/4 | 49 s | 5 |

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
| 70% | 20% | 20 | 7.76 GB | 0.13 GB | 900 GB | 30 MB | 300 MB |

## Adjustments made by the runner

- none yet

## Awaiting the owner

- Root Atlas promotion (v9.146 on the lane; root still 202609060259).
- Earth-radius fix (child pair, R_ATLAS 6378.137).
- Engine wording conflict on interconnector geometry.
