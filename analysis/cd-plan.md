# HOMAGE TO TURING - live CD deploy plan, written by the continuous runners

Updated 2026-09-07T16:01:01.831Z · cycle 1 · lane windows-rig

Rule: prove offline first; if offline cannot prove it, prove it on the testcode hosted runner; nothing is promoted by a runner. Promotion is the owner's call.

| pair | proof route | offline outcome | hosted (latest) | determinism rate | median run | parallel |
|---|---|---|---|---|---|---|
| GG2050-PAIR-20260907T141211Z-W | offline (D:, network cut) | INCOMPLETE (2026-09-07T16:00:34.322Z) | d463659 success | 0/0 | - | 5 |

## Per-case (offline receipt)

- control-11386-harbour-farm: PASS
- 13429-ossian-derived: PASS
- 13432-marram-unmapped: PASS
- INTNED-britned-midpoint-anchor: PASS
- INTNED-britned-gb-converter-anchor: PASS
- INTVKL-viking-gb-only: PASS
- INTNED-far-converter-to-gb: NOT_IMPLEMENTED

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
| 89.3% | 20% | 20 | 4.5 GB | 0.13 GB | 900 GB | 30 MB | 300 MB |

## Adjustments made by the runner

- 2026-09-07T16:00:59.262Z 20260907T141211Z-W: free RAM 4.6 GB, repeats paused


## Awaiting the owner

- Root Atlas promotion (v9.146 on the lane; root still 202609060259).
- Earth-radius fix (child pair, R_ATLAS 6378.137).
- Engine wording conflict on interconnector geometry.
