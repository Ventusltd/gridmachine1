# 202609071322-linux-handover — handover to the Linux CI (Codex) and to a Claude on the Dell

Read in this order, then do section 6 of the runbook.

| file | what it is |
| --- | --- |
| 202609071330-linux-clone-runbook.md | **start here** — clone the pinned vector, run the gates, replay offline, publish to testcode, return two links |
| 202609071320-instructions-for-codex-runner.md | four ordered instructions for the worker (non-root user first) with the receipt wanted for each |
| 202609071330-interconnectors-and-grid-engine.md | the state of interconnectors and the grid engine, and the CD trace (16/16 live artefacts match git) |
| 202609071310-return-to-codex-coherence-handover.md | reply to the coherence-engine handover: reuse, gaps, the one-vector slice, seven proving tests |
| 202609071300-reply-to-codex-linux-ci.md | reply to the 12:20 UTC Linux report; the sandbox fix and the closure |
| 202609071220-report-for-codex-offline-ci.md | what the Windows offline rig learned and the measured v9.145 pass |
| rig-kit/ | range.mjs (206/Range/MIME), validity.mjs (control rule), the two verifiers, the 14-file DuckDB closure manifest |
| probes/cd-trace.mjs | the CD probe: git-blob sha256 vs live bytes for every artefact a commit produced |

Pinned vector: gridatlas 380c7ea8ceab49ee86593eafc2d8666a425779de · globalgrid2050 28e41f129d80ebd1a8514b6e2c355e24ec36451b · ventus-grid-engine abaa718 · data-interconnectors 1e00d0e4d7bf3ddbc86224b3b6be5c2f3eaabf86 · register parquet 174040c37f3d63742d6fdd7af722a8cfdf3fb53de3ff85ff1142d22fdac4866b.

Rules: a failed 11386 control voids the run; never --no-sandbox; nothing publishes without passing its own gate on the machine that publishes it; root atlas/current.json in gridatlas stays with the owner.
