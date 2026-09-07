# Study brief for an external reviewer: the applicability logic of a release-coherence engine

**Self-contained.** You have no access to our repositories, our machines, or our running systems, and you need none. Everything you are asked to reason about is written out below. Do not ask for a repository, a link, or a file. If a question cannot be settled from what is pasted here, say so in the words `UNVERIFIABLE-FROM-BRIEF` and move on.

**What we want.** Not code, not a rewrite, not encouragement. We want the logic checked: definitions that do not mean what they claim, rules that admit counterexamples, and decision procedures stated precisely enough that we can implement them. Where our rule is wrong, give the smallest concrete counterexample that breaks it, then give the corrected rule.

**Deliverable.** Plain Markdown, roughly 2,000 to 3,000 words, structured as the eight numbered questions below, in that order. Each answer: verdict first (`SOUND`, `UNSOUND`, `UNDERSPECIFIED`, or `UNVERIFIABLE-FROM-BRIEF`), then the counterexample if there is one, then the corrected rule. End with a list of every assumption you had to make.

---

## Part A — The system, stated without reference to any repository

We build software in **pairs**. A pair is one data-and-map application (call it the **table**) bound to one interactive map application (call it the **atlas**), taken together at exact content hashes. A pair is identified by an immutable key and is never edited once allocated; a change means a new pair with a new key and a recorded parent.

A pair is exercised by a **harness** that drives a real browser against the pair's own bytes with the network cut, and writes a **receipt**. The receipt records: the harness's own hash, the runtime versions, the set of components consumed, and one outcome per **case**. Cases assert on **sentinels** — values the product writes at the moment a state becomes true, never inferred from rendering.

Every run begins with a **control**: a known-good case whose failure means the environment, not the product, is broken. If the control fails, the receipt is marked invalid and no other case in that run is scored.

Facts are then loaded into a relational store, and the store is asked questions of the form *"this input changed; which recorded results are still worth anything?"*

### The schema, exactly as it stands

```sql
CREATE TABLE release_pairs(pair_id TEXT PRIMARY KEY, parent_pair_id TEXT, implementation_lane TEXT, experiment_id TEXT, allocated_utc TEXT);
CREATE TABLE component_versions(component_id TEXT PRIMARY KEY, repository TEXT, commit_sha TEXT, path TEXT, content_sha256 TEXT, kind TEXT);
CREATE TABLE pair_components(pair_id TEXT, component_id TEXT, role TEXT, consumption_status TEXT, PRIMARY KEY(pair_id, component_id));
CREATE TABLE dependency_edges(edge_id INTEGER PRIMARY KEY, consumer_id TEXT, dependency_id TEXT, relation TEXT, evidence_status TEXT, evidence_ref TEXT, analyzer_version TEXT);
CREATE TABLE test_definitions(test_id TEXT PRIMARY KEY, implementation_sha256 TEXT, required_control TEXT);
CREATE TABLE test_runs(run_id TEXT PRIMARY KEY, pair_id TEXT, test_id TEXT, environment_fingerprint TEXT, outcome TEXT, control_run_id TEXT, receipt_sha256 TEXT, run_utc TEXT);
CREATE TABLE run_inputs(run_id TEXT, component_id TEXT, PRIMARY KEY(run_id, component_id));
CREATE TABLE test_cases(run_id TEXT, case_name TEXT, outcome TEXT, direction TEXT, expect TEXT, measured TEXT, PRIMARY KEY(run_id, case_name));
CREATE TABLE quarantine(fingerprint TEXT PRIMARY KEY, test_id TEXT, outcome TEXT, first_seen TEXT, reason TEXT);
```

`component_id` is a human-readable string such as `gridatlas:atlas/current.json` or `globalgrid2050:pipeline/scripts/core/atlas-receiver-v9-7.js`. Component identity is *path plus content hash* in intent, but the primary key is the string above; a component whose content changes is inserted under a new id with a suffix.

`evidence_status` on an edge is one of four values, meaning how we came to believe the edge exists:

| value | meaning |
| --- | --- |
| `declared` | a manifest or config says so |
| `static-resolved` | an import or reference was resolved by reading the source |
| `runtime-observed` | the dependency was actually fetched or called during a recorded run |
| `unresolved` | we know a dependency of this kind exists but cannot name its target |

`consumption_status` on a pair component records how the pair got it: copied as a content-addressed blob, rebound for the pair, reached by absolute URL outside the pair (pinned or unpinned), or unresolved.

### The reverse-impact query, exactly as it stands

```sql
WITH RECURSIVE up(component_id, depth, path) AS (
  SELECT :changed, 0, :changed
  UNION
  SELECT e.consumer_id, up.depth + 1, up.path || ' > ' || e.consumer_id
  FROM dependency_edges e JOIN up ON e.dependency_id = up.component_id
  WHERE up.depth < 12 AND instr(up.path, e.consumer_id) = 0
)
SELECT DISTINCT up.component_id AS affected_component, up.depth, pc.pair_id, tr.run_id, tr.test_id,
  tr.outcome AS recorded_outcome,
  (SELECT group_concat(evidence_status) FROM dependency_edges d WHERE d.consumer_id = up.component_id) AS edge_evidence
FROM up
LEFT JOIN pair_components pc ON pc.component_id = up.component_id
LEFT JOIN run_inputs ri ON ri.component_id = up.component_id
LEFT JOIN test_runs tr ON tr.run_id = ri.run_id
ORDER BY up.depth, up.component_id
```

### The applicability rule, exactly as it stands

When a new pair is derived from an old one with a changed input, we decide whether the old pair's receipts still say anything about the new pair with this rule:

```sql
SELECT tr.run_id, tr.outcome,
  CASE WHEN EXISTS (
    SELECT 1 FROM run_inputs ri
    JOIN pair_components pc ON pc.component_id = ri.component_id AND pc.pair_id = :child
    WHERE ri.run_id = tr.run_id)
  THEN 'APPLICABLE' ELSE 'STALE' END AS applicability
FROM test_runs tr WHERE tr.pair_id = :parent
```

### The outcome vocabulary, exactly as it stands

Run-level: `PASS`, `FAIL`, `HARNESS_INVALID` (the control failed), `NO_RECEIPT` (the harness produced nothing).
Case-level: `PASS`, `FAIL`, `NOT_IMPLEMENTED` (the product has no such capability; recorded so the gap is countable).
Elsewhere in the estate: `BLOCKED_HARNESS`, `BLOCKED_DEPENDENCY`, `NOT_RUN`, `STALE`.

A run is `PASS` when the control passed and every **scored** case passed. `NOT_IMPLEMENTED` cases are not scored. Our most recent receipt therefore reads: *"6 of 6 scored cases passed with a valid control; 1 direction NOT_IMPLEMENTED."*

### The quarantine rule, exactly as it stands

A known failure whose inputs have not changed is not re-run. Its fingerprint is `test + subject + the threshold it violated`, for example a file of 451,935 bytes against a 368,640-byte limit. Eligibility to run again returns *"only when the subject's bytes, the boundary, or the proof change."*

### The repetition rule, exactly as it stands

After the first run of a cycle, the same harness is run again in parallel copies against the same bytes with the network cut, and we report a **pass-rate**, currently 4 of 4. We call this "the only honest measure of repeatable".

### Three facts about the current data, for grounding

- One edge is `unresolved`: a map component reads a set of eight geographic endpoints whose coordinates are not known to us. The edge exists, the targets do not.
- Two components are reached by absolute URL from outside the pair. One is pinned to an exact commit; one tracks a moving branch head. Both failed to load under the network cut, and every case still passed.
- One dependency is recorded as a `comparator`: a separate engine that our applications do **not** import, whose own proofs pass, and whose contract file we copied. Its proofs certify a copy the browser never executes.

---

## Part B — The eight questions

**1. The applicability rule.** Is `EXISTS(any child component among the run's inputs) ⇒ APPLICABLE` a correct test of whether a receipt still speaks about a new pair? Give the smallest counterexample. Then state the correct predicate. In doing so, define precisely what a receipt's *scope* is: the components it consumed, the components it could have consumed, or the components the pair declares. Say what should happen when the run consumed a **strict subset** of the pair's components, and when the harness itself changed but no component did.

**2. Cycle safety and truncation.** The visited-set test is `instr(up.path, e.consumer_id) = 0` — substring containment on concatenated identifier strings. Identifiers are paths. Give a concrete counterexample where this is wrong, in either direction, and state the correct formulation. Separately: `depth < 12` silently truncates. What must the answer carry so that a truncated result is not read as a complete one, and is a depth cap ever the right instrument here?

**3. An algebra for evidence.** The four evidence values are currently reported as a comma-joined list per component, which loses which value belongs to which path. Propose an ordering or lattice, then define two operations: how evidence combines **along** a path, and how it combines **across** multiple paths reaching the same consumer. State the answer for the specific case where a `runtime-observed` edge and an `unresolved` edge both reach the same component, and say what the impact answer should then claim.

**4. What a valid control licenses.** Our inference is: control passed ⇒ the environment was sound ⇒ the other cases' results are about the product. Under what conditions is that inference invalid? Enumerate the failure modes, including a control insensitive to the fault the other cases probe, a control sharing no inputs with them, and partial environment degradation. Then state the minimum property a control must have relative to a case for the case's result to be trustworthy, and how one would check that property without inspecting the product.

**5. The outcome partition.** Are the run-level and case-level vocabularies above mutually exclusive and jointly exhaustive over the states a run can be in? Identify overlaps and gaps. Then rule on this specific claim: is it honest to report a run as `PASS` when one requested behaviour is `NOT_IMPLEMENTED` and therefore unscored? If not, what should the run-level outcome be, and what is the least misleading single word for it?

**6. Quarantine eligibility.** The rule re-opens a quarantined failure when the subject's bytes, the boundary, or the proof change. Enumerate the state changes that should also re-open it, including transitive ones. Then state the full eligibility predicate. Address the case where nothing about the subject changed but the *reason it was quarantined* was itself mistaken.

**7. What a repeat pass-rate measures.** The repeats run the same bytes, in the same environment, with the network cut. State what a 4-of-4 pass-rate does and does not license us to say. Identify the sources of legitimate variance that this design admits and those it excludes by construction. Then say what would have to be varied for a pass-rate to be evidence of robustness rather than of determinism, and what the honest label for the current number is.

**8. The comparator that is never executed.** A component's proofs pass; our application does not import it; we copied its contract. State what, if anything, those proofs entitle us to claim about our application. Then define the weakest relation that would have to hold between two artefacts for one's proofs to transfer to the other, and how that relation could be established by measurement rather than assertion.

---

## Part C — Rules for your answer

- Reason only from what is written above. Do not assume our implementation contains anything not stated here, and do not credit us with safeguards not described.
- Where a question turns on something not in this brief, write `UNVERIFIABLE-FROM-BRIEF` and say exactly what fact would settle it.
- Prefer a counterexample to an adjective. "This is unsound because of X" beats "this could be improved".
- No code beyond short pseudocode or SQL fragments where a rule is easier to state that way.
- Do not propose new tooling, new services, or new dependencies. The question is whether the logic is right, not what else could be built.
- Finish with the list of assumptions you made, one line each.
