# Test version GG2050-PAIR-20260907T190239Z-W — the disease becomes an assertion

Written 2026-09-07 19:10 UTC, Windows lane. Branch only, nothing promoted.

| | |
| --- | --- |
| Pair | `GG2050-PAIR-20260907T190239Z-W` |
| Parent | `GG2050-PAIR-20260907T141211Z-W` |
| Row | `Ventusltd/testcode`, branch `worker/windows-rig/pair-20260907T190239Z-W`, commit `5137a25` |
| First run | INCOMPLETE, control valid, six of six scored cases passed, zero cases classified D-01 |

## What changed, and what deliberately did not

**No product byte changed.** The Atlas composition, the Pipeline News release and every served file are the parent's, at the same hashes. The source vector is unchanged. The only difference between parent and child is what the test can see, which means any future difference in outcome between them is a statement about the harness rather than about the product.

**The classifier moved from a report into the run.** The parent classified every case and wrote the answer into a plan file for a person to read. This version runs the classification inside the harness, writes the states into the receipt, and **fails the run** on any case classified as the MAP-button disease. An engine that silently stops firing now breaks a test instead of waiting to be noticed by whoever reads the plan.

**The legitimate reasons for silence are named, not lumped.** An arrival can honestly produce no distance in three ways: it was handed to the interconnector lane, the register row has no coordinate, or the true nearest lies beyond the search budget. Each is a separate named state. None of them is allowed to absorb a real failure, which is the whole risk of a catch-all "no measurement, probably fine".

## First run on this machine

Network cut, mirror serving every external host, control first. 27.7 seconds.

| case | classification |
| --- | --- |
| control, a solar project with a measured nearest substation | OK_ENGINE_MEASURED |
| a project whose coordinate is derived from a lease area | OK_ENGINE_MEASURED |
| a register row with no coordinate anywhere | OK_NO_COORDINATE |
| a subsea link arriving at its midpoint anchor | OK_INTERCONNECTOR_LANE |
| the same link arriving at its GB converter | OK_INTERCONNECTOR_LANE |
| a link with only its GB end located | OK_INTERCONNECTOR_LANE |
| the far-converter direction | NOT_APPLICABLE, and still NOT_IMPLEMENTED |

Zero suspects. The run is INCOMPLETE because one requested direction does not exist in the product, which is the honest label and not a regression.

## Why a child rather than an edit

A published or tested version is never edited in place. A change to what a test asserts is a new version with its own key and its own receipts, so the two can be compared. The parent stays exactly as it was tested, at 353 repeat runs without a failure.

## What the runners do with it now

The continuous runner scans every candidate under the pairs directory, so it picks this one up without being told, runs it offline first, escalates to the hosted runner only if offline cannot produce a verdict, and pushes receipts to this pair's own branch. Both versions are now under test at once, which is the point: if the harness change alters an outcome, the parent's receipts are the control.

The live-test directory now holds 62 MB against its 300 MB ceiling.

## Open, unchanged by this version

The interconnector earth radius, the missing far-converter direction, the red proof gate on a composition nobody serves, and the export-provenance finding held privately. Two study briefs are out with an external reviewer, the second covering the geodesy and this firing chain directly; nothing in this version pre-empts their answers.
