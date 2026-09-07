# Response to the external logic review

Snapshot: **2026-09-07 15:00 UTC** · lane `windows-rig`
Reviewed against the live graph before anything was accepted. Changes shipped in `Ventusltd/testcode` commit **`674a75f`** on branch `worker/windows-rig/pair-20260907T141211Z-W`.

**Verdict on the review: four findings accepted and implemented, three accepted with a qualification the review did not make, one rejected with reasons.** Two of the accepted findings were not hypothetical. They reproduce in our own data, which is the strongest thing that can be said for a review written without access to it.

## Where it was right, and provably so

**1. The applicability rule was unsafe.** Our rule marked a receipt applicable if *any* consumed input was present in the child pair. The counterexample is correct. It is worse in practice than in the abstract: a child pair shares almost every component with its parent, so the any-match rule would almost never mark anything stale. Our own demonstration was passing for the wrong reason, because the demo child carried a single component. The rule is now: stale if any consumed input is absent from the child at the same content hash. The demo child now carries every parent component but one, so the rule is actually exercised, and both receipts correctly return `STALE (1 of 8 consumed inputs changed or absent)` where the old rule said applicable.

One correction to their reasoning. They took identity to be the `component_id`. In our schema an id is a path-like string and content is a separate column, so identity must be compared as `(path, content_sha256)`. Comparing ids would have let a changed file keep its name and pass.

**2. The cycle guard was wrong, and it collides in our data.** The undelimited `instr()` test does misfire on identifiers that are prefixes of one another. We checked rather than assumed: this graph contains exactly one such pair, `atlas/data/interconnectors.geojson` inside `atlas/data/interconnectors.geojson@R_ATLAS`, which is the very component our invalidation demonstration turns on. Both sides are now delimited.

**3. Quarantine eligibility was not transitive.** Their counterexample holds: a fix landing in a dependency leaves the subject's bytes, the boundary and the proof untouched, so the failure would stay quarantined for ever. The predicate now covers dependency bytes, the harness hash, the environment fingerprint, and a manual revocation recorded with a reason and a timestamp. That last clause is theirs and it is the right instinct: no state-driven rule can detect a quarantine that was mistaken when written.

**4. `PASS` with an unimplemented case is not honest.** Accepted without reservation. `PASS` now asserts complete coverage; a run where every scored case passes but a requested behaviour does not exist is `INCOMPLETE`, and the receipt carries a coverage block naming the gap. The runner treats `INCOMPLETE` as a verdict, not as a failure to prove.

**5. The repeat pass-rate was oversold.** They are right that same bytes, same environment, network cut measures determinism and not robustness, and that our phrase "the only honest measure of repeatable" was itself not honest. The metric is renamed `internal_determinism_rate` and carries a note saying what it excludes.

**6. The comparator's proofs transfer nothing.** Accepted. An engine we do not import, whose contract file we copied, certifies a reference copy the browser never executes. Their remedy, bisimulation or differential fuzzing, is stronger than we need: differential measurement over the real case corpus already exists in this estate and agreed to zero metres on the control. The honest claim is that confidence transfers only over inputs actually compared, and only as far as that corpus reaches.

## Where the review was incomplete

**7. Consumption-scoped applicability needs an environment qualifier.** They state that a receipt stays applicable when components it never consumed change, because a test that never touched them cannot be invalidated by them. That holds only while consumption is complete for the environment being claimed. In this pair it is not. Two components are fetched by absolute URL and were aborted under the network cut, so they are pair components no run consumed. Under a purely consumption-scoped rule, changing either can never mark a receipt stale, yet either can change behaviour the moment the pair is served online. Applicability is therefore qualified by environment: a network-cut receipt says nothing about the online pair.

**8. Their assumption 2 is false here, and it matters.** They assumed `run_inputs` comprehensively records every component executed during a run. In our implementation the analyzer writes that list; the harness does not observe it. Sixteen rows stand for one hundred and three pair components. Every applicability verdict is therefore only as good as a declared list, which is a weaker claim than the corrected rule appears to make. Recorded in the export rather than papered over: `run_inputs` now carries a `source` column reading `declared-by-analyzer`.

## Where the review is rejected

**9. Merging parallel evidence with MAX would erase the unresolved edges.** They propose an ordering with `unresolved` at the bottom, `MIN` along a path and `MAX` across paths, and answer that where a `runtime-observed` edge and an `unresolved` edge reach the same component the result is "definitively runtime-observed".

`MIN` along a path and `MAX` across paths are both right for evidence about *one* proposition. The error is in treating those two edges as two routes to one fact. One says a named dependency was observed. The other says a dependency exists whose target we cannot name. They are different propositions, and `MAX` deletes the second. Our graph has exactly this shape: the sld-sandbox cartridge carries both, and the unresolved edge is the eight interconnector converters whose coordinates we do not hold. That gap is the thing our third demonstration exists to keep visible, and their rule would have hidden it on the next export.

So `unresolved` is kept outside the order entirely. Rank covers `declared` < `static-resolved` < `runtime-observed`; unresolved annotates the answer, which is then read as a lower bound on the impact set.

**10. The depth cap is not unnecessary.** They argue that correct cycle detection makes a depth cap mathematically unnecessary. True for termination, false for cost: this query enumerates paths rather than nodes, so a dense acyclic graph is still exponential in edges, and the query runs inside a fifteen-minute cycle. The cap stays. Their real point survives and has been implemented: a truncated answer must not read as a complete one, so truncation is now detected by running one level deeper and comparing, and reported in the output.

## What this changed in the running system

| change | where |
| --- | --- |
| Applicability by every consumed input at the same content hash | `relational/build.py`, demonstration D1 |
| Delimited cycle test, truncation detected and reported | the impact query and `impact-query.sql` |
| Evidence rank with unresolved held outside it | `relational/build.py`, demonstration D3 |
| Transitive quarantine predicate with recorded manual revocation | demonstration D4 |
| `INCOMPLETE` run outcome and a coverage block | `tests/run-pair.mjs` |
| `INCOMPLETE` accepted as a verdict; metric renamed to determinism rate | the pair runner on the SSD |
| `run_inputs.source` recording that inputs are declared, not observed | schema |

The runner was restarted so it reads the new vocabulary rather than escalating `INCOMPLETE` to the hosted lane. The next cycle's receipt should read `INCOMPLETE`, not `PASS`, because the far-converter direction still does not exist. That is a more truthful label for the same software, and the first thing the review bought us.

## Open, and not fixed by this round

- Making `run_inputs` observed rather than declared. Until then, finding 8 caps what any applicability verdict is worth.
- Recording the capabilities a control exercised, so the superset property in their finding 4 can be checked rather than asserted.
- The earth radius, the missing far-converter direction, and the red cartridge-proof gate are unchanged and still carried.
