# Engineering plan

2026-09-07. Ventus is a cables and connectivity company, and the clue is in the name: **what we measure is cables.** Every engine models a cable, every fix below serves one, and anything that does not connect to a cable is not on this plan.

Sources: [BUGS.md](BUGS.md) for the tickets, [CABLE-ENGINES.md](CABLE-ENGINES.md) for the rule, [CABLE-ENGINE-DATASHEETS.md](CABLE-ENGINE-DATASHEETS.md) for the contracts, [the capsule](reports/20260907T230000Z-engine-capsule/README.md) for the pattern to copy.

## The state, in one paragraph

Two engines work and are protected: the substation finder within a radius, and the 400 kV transmission engine. They are the pattern for everything else, and they are sealed with their hashes so they cannot be lost. Interconnectors draw for two links of ten. The offshore export cable engine does not exist, which is why offshore arrivals look broken. The 132 kV engine is not built although its assets are already in the map. Thirty-five tickets are open or recorded. Nothing is published beyond what shipped this morning, and the root map still serves an older composition than the tested one.

## Gate zero, before any fix

**GG-001, the firing rate, measured on an iPhone.** Every report from the owner is from a phone, and no harness in this estate covers iOS. Six hundred and fifteen offline runs passed on desktop Chromium against a local mirror, which is structurally blind to what is failing. Until a rate exists per case on the platform where faults appear, no intermittent ticket can be prioritised and no fix can be shown to have worked.

**Retest every owner report against the tested composition.** All of them were made on the root map, which loads a different set of parts, not merely older ones. Some tickets may already be closed. Root promotion is the owner's decision and is also the cheapest way to make the reports and the tests describe the same software.

## The order of work

Each version changes **one** thing, carries the test that failed before it, and leaves the previous version standing as its control.

### 1. Offshore export cable engine · GG-034, GG-002, GG-018

The highest priority because it does not exist and offshore is where the capacity is. Bind an offshore project to its **declared onshore connection point**, named from the public record, and measure that. Fall back to the substation finder only when no declaration is held, and say so in the output. Collect declared connections and landfalls as an automated job, not a typed list.

### 2. Interconnectors · GG-031, GG-033, GG-003, GG-013

Eight of ten links have no far converter, so eight links present as though they never leave the country. Three things, in this order because each is independently useful:

1. **Say where a link goes.** The counterparty is already held in the energy tracker. No collection needed.
2. **Distinguish a link inside the UK from one that leaves it.** Same engine, different jurisdiction answer.
3. **Collect the eight far converters**, automated, and draw the spans.

Also: the card reports the link's own converter at 0.00 km, which measures a thing against itself; and the two applications disagree, ten links against sixteen records.

### 3. Protect what works · GG-011, GG-012

Scaling, not fixing. Add the boundary test so a bounded search cannot return a nearest it did not prove, and carry the mapped-only caveat with its count into the receipt and the export, not only the page. The existing receipts are the control set and must stay green.

### 4. Identity and presentation · GG-035, GG-029, GG-026

The table and the map disagree about which projects exist, so a project the table names arrives with a placeholder title. Fix the disagreement, and use the name the link carries meanwhile. Open the card minimised so the engine firing is visible. Add the missing technology filters, which is a gap rather than a regression.

### 5. Numbers that overstate · GG-004, GG-014, GG-015, GG-016

Compute distances on the ellipsoid rather than a sphere. Stop applying one corridor multiplier to every terrain. Type placeholder ratings as absent. Rename the hop count to what it is.

### 6. Confident wrong answers · GG-010

The power flow can converge to numerical artefacts on a disconnected network and pass every check we make. One slack bus per component containing the injection, and a conditioning check before an answer is accepted. Low visibility, high consequence.

### 7. Provenance and supply · GG-005, GG-007, GG-030

Exports must carry their credit and their composition. The news feed's sources need approving as one reviewable list before anything is added. The feed itself is fetched from a moving branch and should be pinned.

## Structural changes that make the rest cheaper

**The pipeline declares the engine.** Engine category becomes a field on the row, shown in the table, carried in the map link, asserted in the receipt. Routing becomes testable before a browser opens and cannot silently disagree with itself.

**Collection is automated.** Far converters, declared connection points, distribution connection data. Typed once, the hole reopens with the next project.

**Cured faults become vaccines.** The cured diseases go into the amnesia repository with the check that catches each returning, after confirming that runner is alive.

## What is protected

The substation finder and the 400 kV engine, by their current receipts. A version that improves offshore while moving a protected number is rejected rather than negotiated. The capsule records their hashes and the three places their bytes survive.

## What is not on this plan

Anything that does not serve a cable. New surfaces, new dashboards and new visual features wait until the engines above answer their own questions.
