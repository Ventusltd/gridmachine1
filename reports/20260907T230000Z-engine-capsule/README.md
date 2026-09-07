# The working engine, sealed as a capsule

Sealed 2026-09-07. **The 400 kV down to 33 kV engines work, and this is the record of what they are, where their bytes live, and what makes them good enough to copy.** Everything built after this borrows from here.

## 1. What is sealed

Composition `202609071232`, shell `202608300453-atlas-v9`, verified from the published lane:

| part | version | sha256 (first 16) | bytes |
| --- | --- | --- | --- |
| streaming-parquet-bridge | v9.112 | `4a6b594f7705bc4d` | 13,316 |
| place-global-search | v9.145 | `15f324e5c2790508` | 41,120 |
| sld-sandbox | v9.146 | `8916fa66f2cae3b1` | 382,999 |
| substation-intelligence | v9.140 | `d94b0de50deddac7` | 451,935 |
| current.json | — | `42a8fa3933a6b361` | 47,496 |

## 2. Where the bytes survive, three times over

1. **Published and immutable:** `https://ventusltd.github.io/gridatlas/atlas/v/202609071232/`. A published version is never edited, so this URL is a fixed point.
2. **Inside two candidate pairs** on their own branches in the test repository, copied as content-addressed blobs and verified against the composition at build. Each pair carries the whole closure, so a pair directory alone can be served offline.
3. **In the source repository**, at the paths above.

Any of the three can be checked against the table in section 1. If all three ever disagree, the published lane version is the one to trust, because it is the one that cannot be rewritten.

## 3. What makes these engines good, quality by quality

This is the part to lift. The value is not in the arithmetic, it is in the discipline around the arithmetic.

**It states its own scope, with counts.** The card does not say "nearest substation". It says nearest of the 278 mapped substations at 400 kV or above that this search could see, that the operator publishes 355 connection points at that class, that 214 carry coordinates, and therefore that 141 cannot be measured to at all. Then it says plainly: a nearer one may exist that nothing here can see. **A measurement that names what it could not see is worth more than a smaller number that hides it.**

**It refuses rather than guesses.** Below about a kilometre it declines to offer a corridor estimate at all, and explains why: site-centroid resolution dominates at that separation, median published length 0.59 km against a median error of 52.5%, so a straight line between centroids is not measuring a route factor. **A refusal with its reason attached is a result.**

**It will not lend its calibration to a different question.** The corridor factor is calibrated on cable circuits, which follow the highway network. The card says so, gives the overhead-line figure of 1.13 separately, and states that the cable factor is not applied to an overhead-line question. **This is the seed of the whole cable-engine idea and it was already here.**

**It separates what is published from what is computed.** Fault levels and circuit ratings are quoted as the operator publishes them, at the voltage the connection is made at, marked as a site-wide envelope rather than a value for one bus. Nothing is invented to fill a gap.

**It names the alternative when the nearest is anonymous.** Where the closest asset is unnamed, it reports the nearest named one beside it, with distance, and adds the public record: a new four-bay substation under construction at that site.

**It says when a join could not be made.** Where no substation matches a published network site by name, it says nothing is stated about their circuits, rather than silently omitting the section.

**It qualifies its own identity.** Where a project is not in the register snapshot, it says so and says the details came from the arrival link. That honesty is what made ticket GG-035 findable at all.

## 4. The rules distilled, for the engines that come next

1. State the scope and the count of what was invisible, every time.
2. Refuse with a reason rather than produce a number you cannot defend.
3. Never lend a calibration to a question it was not measured on.
4. Keep published facts and computed facts visually and textually apart.
5. Name the alternative when the best answer is anonymous or weak.
6. Say when a join failed, rather than dropping the section.
7. Say where the identity came from.
8. Publish a marker when the engine fires, so a test can read the state instead of the picture.

## 5. Known faults carried in the capsule

Sealing is not endorsement of every line. Carried and recorded: distances computed on a sphere where the ellipsoid is the honest model, an interconnector module measuring on a different radius from the estate default, a bounded search with no stated termination rule, a placeholder rating printed raw, and a hop count labelled an electrical distance. All are in the register. **The capsule is the pattern to copy, not a licence to copy the faults with it.**

## 6. How to recover from this capsule

Take the published lane version as the source, verify each part against section 1, and serve the directory. A candidate pair directory can be served offline directly and comes with its own test harness, which is the faster route if the network is unavailable. The composition file is self-describing: it names its shell, its parts and their hashes, so nothing has to be reconstructed by hand.
