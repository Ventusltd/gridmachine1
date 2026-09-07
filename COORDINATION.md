# Cross-lane coordination — GlobalGrid2050 Grid Machine

Written by **GM01, the Windows lane** (`windows-rig`, namespace `W`), for **GM02, the Linux lane** (`dell`), and for any later session on either side. The same file is kept in both coordination repositories so neither lane has to guess what the other believes.

Snapshot: **2026-09-07 15:25 UTC**. No agent or personal names are used anywhere in this estate's identifiers: GlobalGrid2050 is the product, GM01 and GM02 are build lanes.

---

## 1. Where the work stands

| item | state |
| --- | --- |
| Candidate pair | `GG2050-PAIR-20260907T141211Z-W` |
| Row | `Ventusltd/testcode`, branch `worker/windows-rig/pair-20260907T141211Z-W`, directory `sandbox/pairs/20260907T141211Z-W/` |
| Binds | Pipeline News release `202609071221` to Atlas composition `202609071232` (v9.146), both taken as git blobs |
| Offline verdict | **INCOMPLETE** — every scored case passes with a valid control, one requested behaviour does not exist |
| Determinism | 4 of 4 repeat runs, same bytes, same environment, network cut |
| Hosted runs | three, all success, online mode |
| Publication | branch only. Nothing promoted, no preview URL claimed, owner approval not requested |

**INCOMPLETE is not a regression.** It is the same software that read PASS this morning, relabelled after the logic review in section 3. The gap is the far-converter direction, which does not exist in v9.146.

## 2. How the lanes stay comparable

Two runners execute the same harness and answer different questions:

- **Offline first**, on the SSD, network cut and every external host served from a local mirror or aborted. That receipt says the pair's bytes pass alone.
- **Then the hosted runner**, triggered by any push to a `worker/**` branch, online. That receipt says the same bytes pass against live dependencies. It uploads artifacts and never commits, because a branch has one writer.

A run begins with a control. If the control fails the receipt is `HARNESS_INVALID` and nothing else in that run is scored. Any lane's receipt should be readable by the others: harness hash, runtime versions, consumed components, one outcome per case, sentinels only, never rendering.

Supervision is **six-hourly**, reduced from fifteen minutes because frequent checks cost more than they returned. Either lane may be asked for a check at any time.

## 3. Shared semantics — adopt these or the exports will not compare

An external logic review of the coherence engine produced eight findings. Four were accepted and implemented, three accepted with a qualification, one rejected. GM02 should adopt the same rules, because a relational export built on different semantics cannot be joined to this one.

1. **Applicability.** A receipt applies to a new pair only when **every** input the run consumed is present at the same `(path, content_sha256)`. The rule shipped first accepted **any** single matching input, which in practice almost never marked anything stale. Compare content hashes, not identifier strings.
2. **Cycle safety.** The visited-set test must delimit both sides before matching. A bare substring test misfires when one identifier is a prefix of another, and this estate's graph contains exactly such a pair.
3. **Truncation.** A depth cap is kept for cost, since the query enumerates paths rather than nodes, but a truncated answer must say so. Truncation is detected by running one level deeper and comparing.
4. **Evidence.** Rank is `declared` < `static-resolved` < `runtime-observed`; weakest link along a path, strongest across paths. **`unresolved` is held outside that order** and annotates the answer. Merging it away with the strongest-wins rule would delete the record of dependencies whose targets cannot be named, and the impact set must be readable as a lower bound.
5. **Quarantine.** Eligibility is transitive: subject bytes, boundary, proof, **any dependency's bytes**, the harness hash, the environment fingerprint, or a manual revocation recorded with a reason and a timestamp.
6. **Outcomes.** `PASS` asserts complete coverage. Every scored case passing with a requested behaviour absent is `INCOMPLETE`. A run that produced nothing is `NO_RECEIPT`; a failed control is `HARNESS_INVALID`.
7. **Repeat rates.** Repeating the same bytes in the same environment measures determinism, not robustness. The metric is named `internal_determinism_rate` and carries a note saying what it excludes. Injecting variance is what would make it evidence of robustness.
8. **Proofs do not transfer by proximity.** An engine that an application does not execute certifies only itself. Confidence transfers only over inputs actually compared, and only as far as that comparison reaches.

Two qualifications the review could not make, both of which limit what any applicability verdict is worth:

- **Applicability is scoped by environment.** A receipt taken with the network cut says nothing about the same pair served online, because components that were aborted offline will load online.
- **Consumed inputs here are declared by the analyzer, not observed by the harness.** Until a harness records what it actually fetched, the rule is only as good as that declared list. The export marks this with a `source` column reading `declared-by-analyzer`.

## 4. Export-provenance contract

Anything that leaves the building — a PDF, an image, a slide, a report — must carry on the artefact itself, not in a panel beside it:

1. the data credit, verbatim and complete, from **one** builder with a hardcoded fallback;
2. the composition it came from, so it can be traced;
3. a link a recipient can actually open, never a private or loopback address;
4. a UTC timestamp, and for a capture, the method;
5. a refusal rather than a blank when any required field is empty.

Two export paths that each assemble their own furniture will drift, and the drift only shows on an artefact that is already in circulation. Provenance is therefore asserted after the artefact is written, not assumed before.

An offline checker enforces this against any produced PDF by reading its text layer. Two sample exports were measured against it and both failed. The detail is held privately on the SSD pending the owner's decision, because it concerns an unreleased path.

## 5. Standing rules, both lanes

- **No promotion by any runner.** A pass is reported, never promoted; promotion to production is the owner's decision on an exact tested artefact vector.
- **Tests, candidates and release tooling stay out of production repositories.**
- **Branch only.** Never write to `main` in the test repository, never force-push, never overwrite another lane's row.
- **Never edit a published version.** Improvements go in a new timestamped version.
- **No agent or personal names** in identifiers, directories, branches or reports.
- **Ceilings.** The live-test directory stays under 300 MB, with receipts overwritten in place because history is the repository's job. The SSD lane stays under its own budget and reports usage every cycle.
- **The digital-twin harness is read-only** and is never re-run by the other lane.

## 6. Open, and who holds it

| item | holder |
| --- | --- |
| Root Atlas promotion; the lane carries a newer composition than root | owner |
| Earth radius: the interconnector module measures on a different radius from the estate decision, spans low by about 0.11% | GM01, in a child pair, not a patch |
| Far-converter direction: eight of sixteen links have no far coordinate, so one direction is `NOT_IMPLEMENTED` | GM01, needs data |
| Cartridge-proof gate red on the root composition since 2026-09-06 | owner, plus a version that slims the offending cartridge |
| A third receipt on this pair from the Linux lane | **GM02** |
| Recording capabilities a control exercised, so a control's sufficiency can be checked rather than asserted | either lane |
| Making consumed inputs observed rather than declared | either lane |

## 7. What GM01 asks of GM02

1. Clone the branch above and run the harness with your own mirror, then the relational exporter. A Linux receipt beside the offline and hosted ones makes the determinism rate cross-platform.
2. Adopt the semantics in section 3 before generating a comparable export, and say if you disagree with the rejection in item 4 — that one is a judgement about what an impact answer is allowed to hide.
3. Re-run any earlier campaign against the current lane composition rather than the root one; several failures found earlier are already fixed on the lane and are being counted against a composition nobody is serving.
4. Accept a legal state where a project has zero links inside the arrival radius and a true distance beyond it, rather than classifying it as an engine failure.
5. Record the viewport with each layer receipt, so "no features in view" can be told apart from "layer empty".
