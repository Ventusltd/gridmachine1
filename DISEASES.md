# Disease list — named defects the runners watch

A disease is a defect that recurs, hides, or is carried deliberately. Each has a symptom a machine can look for, so a runner can report it rather than a person rediscovering it. Nothing here is graded and nothing here is promoted.

Snapshot 2026-09-07 15:30 UTC, Windows lane. Both lanes should add to this list rather than keeping private ones.

| id | disease | symptom a runner can detect | state | holder |
| --- | --- | --- | --- | --- |
| D-01 | **MAP button does not fire the grid engine** | An arrival reaches the map and the engine never measures: no links drawn and no nearest distance, while identity resolved. Detect by reading the arrival sentinel and the engine's reconciliation state in the same run, not by looking at the screen. | open, watched every cycle | GM01 |
| D-02 | **Interconnectors: one direction only** | Arrival at a far converter measuring toward GB does not exist; eight of sixteen links have no far coordinate. A receipt must record `NOT_IMPLEMENTED`, never a pass. | open, needs data | GM01 |
| D-03 | **Interconnector spans measured on the wrong earth radius** | Span lengths about 0.11% low against the estate's decided radius. Per-end measurements unaffected. Detect by recomputing one known span both ways. | carried, declared | GM01, in a child version |
| D-04 | **Exported artefacts lose their provenance** | A print or capture that carries no data credit, or no composition stamp, or a link nobody outside the machine can open. Detect by reading the artefact's own text layer after it is written. | checker built and run offline; detail held privately | owner decides |
| D-05 | **Proof gate red on a composition nobody serves** | The gate resolves the root composition, which is older than the lane, so lane work cannot turn it green and root promotion alone would not either. | open | owner |
| D-06 | **A dependency that tracks a moving branch** | A component fetched by absolute URL with no commit pin. It aborts offline, so no receipt notices, and it can change under a passing pair at any time. | recorded as a component and an edge | GM01 |
| D-07 | **Consumed inputs are declared, not observed** | The relational export lists what an analyzer believes a run consumed, not what the harness fetched. Every applicability verdict inherits that weakness. | open | either lane |
| D-08 | **A pass that hides a gap** | A run reported as passing while a requested behaviour does not exist. Cured by the outcome partition: such a run is `INCOMPLETE`. | fixed 2026-09-07 | GM01 |
| D-09 | **A verdict that survives its inputs** | A receipt still treated as applicable after an input it consumed changed. Cured by requiring every consumed input at the same content hash. | fixed 2026-09-07 | GM01 |
| D-10 | **A silent blank** | Any path that produces an empty field, an empty image or an empty answer and presents it as success. Two instances found and fixed; treat as a class, not an incident. | recurring class | both lanes |

## How a runner uses this

At each cycle, a runner reports the state of every open disease it can observe from the receipts it already produces, and says plainly when it cannot observe one. A disease is closed only by evidence, never by silence. A disease that is deliberately carried stays on the list with its measurement, so it is never mistaken for a clean result.

## Vaccines — to be added to the CVAA repository

**Open task, not yet done:** every cured disease above should become a vaccine in the coding-vaccines-against-amnesia repository, so the cure survives the session that found it. Each vaccine is a rule plus the measurement that catches its disease returning:

- **D-08, D-09, D-10** are cured and ready to be written as vaccines now: a pass must assert complete coverage; a verdict must not outlive the inputs it consumed; a silent blank is a failure, never a success.
- **D-04** carries a checker already; the vaccine is the export-provenance contract itself.
- **D-01 to D-03, D-05 to D-07** stay diseases until measured cured, and get vaccines then.

A vaccine that is not accompanied by a check is a note, not a vaccine. The CVAA runner should be confirmed working before the batch is added, since it has previously reported findings from a dead runner.
