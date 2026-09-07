# Study brief for an external reviewer: geodesy, network maths, and the pipeline-to-map firing chain

**Self-contained.** You have no access to our repositories or machines and need none. Every number, rule and contract you are asked about is written out below. Do not ask for a link or a file. Where a question cannot be settled from what is here, write `UNVERIFIABLE-FROM-BRIEF` and say what fact would settle it.

**What we want.** The maths checked and the state machine checked. Not a rewrite, not encouragement. Where a rule is wrong, give the smallest concrete counterexample and then the corrected rule. Arithmetic is welcome and will be checked against ours.

**Deliverable.** Markdown, roughly 2,500 to 3,500 words, in the order of the questions below. Each answer opens with a verdict: `SOUND`, `UNSOUND`, `UNDERSPECIFIED`, or `UNVERIFIABLE-FROM-BRIEF`. End with every assumption you had to make, one line each.

---

## Part A — The system

A public register of energy projects is presented as a searchable table. Each row carries a MAP control. Pressing it opens a separate map application at that project, which then measures the project's distance to grid infrastructure and reports it. Two applications, one handover, and a computation at the end of it.

### A1. The handover contract

The table builds a link carrying: a register reference, a project name, a technology, a capacity in MW, a latitude, a longitude, and a zoom. The destination is not hard-coded: the table fetches a small contract document that names the canonical receiver and its route, then resolves the link against it. Interconnector rows use a different key, because they have no register reference, and add an anchor parameter naming which end of the link to arrive at.

On arrival the map must do four things in order: resolve the project's identity, place the camera, draw the project, and fire the measuring engine. Identity resolution consults an authoritative register, which may disagree with the coordinates in the link or may hold no coordinate at all.

### A2. The states the arrival can end in

Identity: `RESOLVED` (found, mapped), `RESOLVED_UNMAPPED` (found, no coordinate anywhere), `NOT_IN_ACTIVE_REGISTER` (the link's own fields are used), `FAILED`.

Engine: `MEASUREMENT_CLAIMED` (a distance was produced), `HANDED_TO_INTERCONNECTORS` (a different lane owns this arrival), or nothing at all. A separate flag records that the nearest infrastructure was found but lies beyond the search radius.

Known facts about the data: about 13,970 of 13,995 register rows have a usable coordinate. Of the published grid connection points, 384 of 886 have no coordinates at all, so the nearest *mapped* point may not be the nearest point. Some register rows resolve only to a lease-area polygon, from which a point on the surface is derived.

### A3. Concurrency, as currently handled

Register lookup is asynchronous. A reader can select a different project, or clear the selection, while a lookup is in flight. The current design issues a token per arrival; a selection or a clear invalidates the pending token, and a late identity carrying a stale token is discarded rather than allowed to move the map.

### A4. The classifier we just wrote

Every case in a test run is put in exactly one state from its recorded values alone:

```
if it is an interconnector arrival:
    OK_INTERCONNECTOR_LANE            if handed over, or an interconnector status exists
    else D-01_SUSPECT
if identity is RESOLVED_UNMAPPED or not mapped:  OK_NO_COORDINATE
if identity is not RESOLVED:                     NOT_APPLICABLE
if a distance, or drawn links, or a printed nearest line exists:  OK_ENGINE_MEASURED
if nearest_beyond_radius is true:                OK_BEYOND_SEARCH_RADIUS
otherwise:                                       D-01_SUSPECT   (identity resolved and mapped, engine silent)
```

## Part B — The maths, with our numbers

### B1. Earth model

All straight-line distances use the haversine formula on a sphere of radius R. Two radii are in use across the estate and they disagree:

- `R = 6378.137 km` (the WGS84 equatorial radius), declared as the default.
- `R = 6371.0088 km` (the IUGG mean radius), used by one module.

Measured difference on two real spans:

| span | on 6371.0088 | on 6378.137 | difference |
| --- | --- | --- | --- |
| a subsea link, GB to continent | 234.900 km | 235.163 km | +0.263 km |
| a shorter subsea link | 59.934 km | 60.001 km | +0.067 km |

All the geography concerned lies between about 50°N and 59°N.

### B2. Nearest-infrastructure search

The map finds the nearest substation to a project by searching outward and reporting the closest found. Two budgets exist: an arrival radius of about 40 km for projects, and a per-end budget of about 10 km for interconnector converters, with a separate count of how many lie within a wider band. If nothing is found inside the budget, the design reports either a true distance with a "beyond radius" flag, or nothing.

Sample results: one converter measured at 0 km from a named inverter plant, another at 0.001 km from a named substation, a solar project at 2.258 km with 5 links drawn.

### B3. The drawn span and its label anchor

A subsea link is drawn as a straight line between two converter coordinates, and its label is anchored at the arithmetic mean of the two endpoint latitudes and longitudes. On the 235 km span above, that anchor sits about 1.44 km from the true great-circle midpoint. A route factor of about 1.043 is applied elsewhere to convert a straight line into an indicative road-corridor estimate.

### B4. Network computation

A linear DC injection-response calculation, on a published node and branch model, reports which circuits would carry a project's stated capacity and what fraction each takes. Declared properties:

- 100 MVA base, a named slack bus, published reactances used untouched.
- The published 400 kV network has **238 connected components**. A transfer between two of them does not exist, and is refused before the solver is asked.
- An answer is accepted only on all three of: solver convergence, a global residual test, and Kirchhoff's current law satisfied **at every bus**, not only at the injection bus.
- Parallel circuits are counted as the separate published rows they are, rather than collapsed when they share a reactance.
- Validated to 1e-9 against small networks whose solutions are exact by hand.
- No loading is ever stated, because existing flows are published nowhere.

Seasonal ratings are reported per circuit and per season, scoped to the connection voltage. Four circuits are published at 9,999 MVA on spans of a kilometre or less; these are named as placeholders, excluded from the reported range, and still reported individually.

Electrical distance is counted in hops through the published model, where voltage changes only across a named transformer; a circuit that appears to change voltage without one is refused and recorded. Planned future assets are never walked as though they exist today.

Fault levels are only ever quoted as published by the network operator, at the voltage the connection is made at, and are never calculated by us.

---

## Part C — The questions

**1. Which radius, and does it matter?** Our default is the equatorial radius. Judge that choice for great-circle distances at 50 to 59°N. State the error a spherical haversine already carries against a WGS84 ellipsoidal distance at that latitude, and whether the equatorial radius makes it better or worse than the mean radius. Then say which radius, if either, is defensible, and whether the honest answer is instead to compute on the ellipsoid. Give the size of each error in metres on a 235 km span, so we can compare it to the 263 m difference above.

**2. Is a bounded nearest-search correct?** State the conditions under which a search bounded by a radius or a bounding box can return something that is not the true nearest, and give the smallest counterexample. Cover the degrees-to-kilometres conversion by latitude explicitly. Then state the termination rule a correct nearest-search must satisfy, and what it must report when it stops without one.

**3. What does "beyond the search radius" license?** A project with zero infrastructure inside the radius but a true nearest distance beyond it is treated as a legitimate answer, not a failure. Is that sound, given that 384 of 886 published connection points have no coordinates? State precisely what such a result may and may not claim.

**4. The label anchor.** The drawn span is a straight line on a projected map, and the label sits at the arithmetic mean of the endpoints, 1.44 km from the great-circle midpoint on a 235 km span. Derive the correct midpoint, say when a planar mean is acceptable and when it is not, and state whether a straight drawn line on a web-mercator map is itself a misrepresentation at this length.

**5. The route factor.** A single multiplier of about 1.043 turns a straight line into a road-corridor estimate. State what would have to be true for one multiplier to be defensible, what its error distribution would look like in practice, and what the honest way to present such an estimate is.

**6. The DC injection response.** Judge the acceptance criteria in B4. Is convergence plus a global residual plus Kirchhoff at every bus sufficient to accept an answer? Identify what those three miss, including ill-conditioning, a slack bus in the wrong component, and numerically near-singular cases. Then rule on the refusal of cross-component transfers, on counting parallel circuits separately, and on the claim that no loading can be stated because existing flows are unpublished.

**7. Sentinel values in published data.** Four circuits published at 9,999 MVA are treated as placeholders, excluded from a reported range, and still shown. Is exclusion-with-disclosure the right treatment of a suspected sentinel value, and what rule should decide when a number is a placeholder rather than a measurement?

**8. Electrical distance and the refusal rule.** Voltage may change only across a named transformer, and a circuit that appears to change voltage without one is refused and recorded. State what this rule is protecting against, what legitimate topology it might wrongly refuse, and how a hop count should be reported so it is not mistaken for a distance.

**9. Is the firing chain total?** Take the states in A2 and the classifier in A4. Are the outcomes mutually exclusive and jointly exhaustive over what can actually happen on arrival? Identify any real outcome that falls through, and any state where the classifier would call a genuine failure legitimate. Pay particular attention to `OK_BEYOND_SEARCH_RADIUS` and to the interconnector branch.

**10. The handover under concurrency.** Given the token scheme in A3, enumerate the interleavings that can still produce a wrong result: a camera on one project and a measurement from another, a measurement attributed to the wrong identity, or an arrival that never fires. State the minimum invariant that must hold between camera, drawn project, identity and measurement for the result to be trustworthy, and how a test could observe a violation from published values alone rather than from the screen.

**11. Two sources, one coordinate.** The register and the link may both carry a coordinate and disagree; some projects have only a lease polygon, from which a surface point is derived. State the rule that should decide which coordinate wins, what must be published alongside the winner, and what a derived point may legitimately be used to claim.

---

## Part D — Rules for your answer

- Reason only from what is written here. Do not credit us with safeguards not described.
- Prefer a counterexample and a number to an adjective.
- Show the arithmetic where you assert an error in metres.
- Do not propose new tooling, services or dependencies. The question is whether the maths and the logic are right.
- Finish with your assumptions, one line each.
