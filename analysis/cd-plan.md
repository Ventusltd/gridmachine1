# CD deploy plan, live (rewritten by the D: pair runner every 15 minutes)

Updated 2026-09-07T14:48:19.653Z · cycle 2 · lane windows-rig

Rule: prove offline first; if offline cannot prove it, prove it on the testcode hosted runner; nothing is promoted by a runner. Promotion is the owner's call.

| pair | proof route | offline outcome | hosted (latest) | repeat pass-rate | median run | parallel |
|---|---|---|---|---|---|---|
| GG2050-PAIR-20260907T141211Z-W | offline (D:, network cut) | PASS (2026-09-07T14:47:19.841Z) | 97e3e46 success | 5/5 | 38 s | 5 |

## Per-case (offline receipt)

- control-11386-harbour-farm: PASS · repeats 5/5
- 13429-ossian-derived: PASS · repeats 5/5
- 13432-marram-unmapped: PASS · repeats 5/5
- INTNED-britned-midpoint-anchor: PASS · repeats 5/5
- INTNED-britned-gb-converter-anchor: PASS · repeats 5/5
- INTVKL-viking-gb-only: PASS · repeats 5/5
- INTNED-far-converter-to-gb: NOT_IMPLEMENTED · repeats 0/0

## Resources

| cycle CPU avg | floor | CPUs | free RAM | D:\gridatlas-ci | SSD ceiling | testcode pairs | ceiling |
|---|---|---|---|---|---|---|---|
| 59.3% | 20% | 20 | 2.95 GB | 0.13 GB | 900 GB | 30 MB | 300 MB |

## Adjustments made by the runner

- 2026-09-07T14:48:16.987Z 20260907T141211Z-W: free RAM 3.0 GB, repeats paused


## Awaiting the owner

- Root Atlas promotion (v9.146 on the lane; root still 202609060259).
- Earth-radius fix (child pair, R_ATLAS 6378.137).
- Engine wording conflict on interconnector geometry.
