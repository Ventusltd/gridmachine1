# HOMAGE TO TURING - live CD deploy plan, written by the continuous runners

Updated 2026-09-07T16:55:01.967Z · cycle 3 · lane windows-rig

Rule: prove offline first; if offline cannot prove it, prove it on the testcode hosted runner; nothing is promoted by a runner. Promotion is the owner's call.

| pair | proof route | offline outcome | hosted (latest) | determinism rate | median run | parallel |
|---|---|---|---|---|---|---|
| GG2050-PAIR-20260907T141211Z-W | offline (D:, network cut) | INCOMPLETE (2026-09-07T16:42:41.804Z) | cd00a9c in_progress | 121/121 | 44 s | 5 |

## Per-case (offline receipt)

- control-11386-harbour-farm: PASS · repeats 121/121
- 13429-ossian-derived: PASS · repeats 121/121
- 13432-marram-unmapped: PASS · repeats 121/121
- INTNED-britned-midpoint-anchor: PASS · repeats 121/121
- INTNED-britned-gb-converter-anchor: PASS · repeats 121/121
- INTVKL-viking-gb-only: PASS · repeats 121/121
- INTNED-far-converter-to-gb: NOT_IMPLEMENTED · repeats 0/0

## Disease watch (from this cycle's sentinels, no extra run)

- GG2050-PAIR-20260907T141211Z-W: **D-01 not observed** across 7 cases
  - control-11386-harbour-farm: OK_ENGINE_MEASURED
  - 13429-ossian-derived: OK_ENGINE_MEASURED
  - 13432-marram-unmapped: OK_NO_COORDINATE
  - INTNED-britned-midpoint-anchor: OK_INTERCONNECTOR_LANE
  - INTNED-britned-gb-converter-anchor: OK_INTERCONNECTOR_LANE
  - INTVKL-viking-gb-only: OK_INTERCONNECTOR_LANE
  - INTNED-far-converter-to-gb: NOT_APPLICABLE
  - D-02 (interconnectors, one direction only): NOT_IMPLEMENTED case present and recorded, as expected
  - D-10 (silent blank): no blank receipt this cycle

A disease closes only on evidence. States beginning OK_ are legitimate outcomes, named rather than hidden.


## Resources

| cycle CPU avg | floor | CPUs | free RAM | D:\gridatlas-ci | SSD ceiling | testcode pairs | ceiling |
|---|---|---|---|---|---|---|---|
| 65% | 20% | 20 | 6.09 GB | 0.13 GB | 900 GB | 30 MB | 300 MB |

Memory governor: floor 3 GB, reserve 4 GB, measured cost 0.41 GB per copy, cap 3 of 3, floor hits 0, least free seen 3.37 GB.

## Memory governor

Floor 3 GB, reserve 4 GB, measured cost 0.41 GB per copy, cap 3 of 3, floor hits 0, least free seen 3.37 GB.

## Adjustments made by the runner

- 2026-09-07T16:29:47.092Z 20260907T141211Z-W: free RAM 3.4 GB against a 3 GB floor, repeats held this cycle


## Awaiting the owner

- Root Atlas promotion (v9.146 on the lane; root still 202609060259).
- Earth-radius fix (child pair, R_ATLAS 6378.137).
- Engine wording conflict on interconnector geometry.
