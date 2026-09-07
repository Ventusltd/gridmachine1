# Response to the second review: geodesy measured, firing chain corrected

Snapshot 2026-09-07 19:30 UTC, Windows lane. Eleven answers received. **Six accepted, three accepted with a correction to the reasoning, one rejected on measurement, one already true of the product.**

Before accepting the geodesy verdict I measured it, because the review's own numbers were checkable and the conclusion overturned an estate decision.

## 1. The radius: the verdict is right, the reasoning is backwards

The review states that the local radius of curvature at 55°N averages "closer to the IUGG mean radius than to the equatorial radius", giving a meridian radius of about 6362 km. That is wrong. Computed on WGS84:

| latitude | meridian radius M | prime vertical N | Gaussian √(MN) |
| --- | --- | --- | --- |
| 51.5°N | 6374.6 | 6391.3 | 6382.9 |
| 55°N | 6378.4 | 6392.5 | 6385.4 |
| 58°N | 6381.5 | 6393.5 | 6387.5 |

Every one of those is **larger** than both radii in use. The Earth's radius of curvature at GB latitudes is greater than the equatorial radius, not smaller, because curvature flattens toward the poles even as the geocentric radius shrinks. The two are different quantities and the review conflated them.

Measured against a true ellipsoidal geodesic (Vincenty inverse, WGS84) on our own two spans:

| span | ellipsoid | on R = 6371.0088 | on R = 6378.137 |
| --- | --- | --- | --- |
| the 235 km subsea link | 235.613 km | 234.900, **713 m short** | 235.163, **450 m short** |
| the 60 km subsea link | 60.104 km | 59.934, **170 m short** | 60.001, **103 m short** |

Both spheres understate. The equatorial radius is the **better** of the two here, not the worse, so the estate's declared default survives and the module that used the mean radius was indeed the wrong one. The sphere that would reproduce these geodesics is about 6389 to 6390 km, close to the local prime-vertical radius and unavailable as a single constant across a large area.

**Accepted where it counts:** the review's final recommendation is right even though its argument for it is not. The honest fix is not a third radius, it is to compute on the ellipsoid. A spherical model chosen to be right on one span is wrong on another bearing. This supersedes the earlier plan to regenerate spans on a different sphere.

## 2 to 8. The measurement and network questions

**Bounded nearest-search: accepted.** The cosine-of-latitude counterexample is correct and the termination rule is the right one: a bounded search may only return a nearest if the best candidate is closer than the distance to the nearest boundary of the search space, otherwise it must return an explicit not-found state. Our arrival budget and per-end budget both need that test made explicit.

**Beyond-radius: accepted, and it sharpens a claim we already half-make.** With 384 of 886 published connection points holding no coordinates, a beyond-radius result licenses only "the nearest **mapped** infrastructure is X away". The product already says the mapped caveat in one place; the receipt and the exported artefact must carry it too, or the number travels without it.

**Label anchor: accepted.** The planar mean is not the great-circle midpoint, the normalised chord midpoint is, and a straight line drawn on web mercator over 235 km is a rhumb line rather than the shortest path. Both are cosmetic only until someone measures off the picture.

**Route factor: accepted.** A single multiplier presented to three decimal places implies an empirical precision that a right-skewed penalty distribution cannot support. A geodesic floor with a bracketed range is the honest presentation.

**DC injection response: accepted, and this is the most valuable finding.** Convergence, a global residual and Kirchhoff at every bus do not exclude a singular or near-singular system. With 238 connected components the matrix is block-diagonal, and a regularised or pseudo-inverse solve will converge to numerical artefacts that still satisfy every check we make. Two tests are missing: exactly one slack bus per component actually containing the injection, and a condition-number check before the answer is accepted. The review confirms the three things we already do are sound: refusing cross-component transfers, counting parallel circuits separately, and refusing to state loading when base flows are unpublished.

**Sentinel ratings: accepted in part.** Excluding a 9,999 MVA placeholder from a range while still printing the raw figure invites a reader to treat it as a rating. It should be typed as absent at ingestion and rendered as unrated. The proposed statistical rule for detecting placeholders is weaker than the obvious one: a repeated exact round number across unrelated assets is a sentinel, and a threshold based on standard deviations would also catch genuine large ratings.

**Voltage-change refusal: accepted.** Three-winding transformers modelled through a fictitious star point are exactly the legitimate topology the rule would refuse, and the refusal is currently recorded rather than investigated. The naming point is right too: a hop count is a topological edge count, not an electrical distance, and impedance is what that phrase means to an engineer.

## 9. The classifier: three real holes, all mine

**Accepted in full.** The classifier I wrote this afternoon has the precedence bug described: the interconnector branch is tested first, so an interconnector arrival with no coordinate is recorded as a clean handover and never has its mapping checked. The catch-all also cannot distinguish an engine that answered emptily from one that threw and died. And the most dangerous point is correct: if the beyond-radius flag were ever true by default rather than by measurement, a failure would be classified as a legitimate outcome.

Fixed in a new test version rather than by editing the tested one: the mapping test now runs before the lane test, a thrown-error state is separated from a silent one, and the beyond-radius state is accepted only when it carries a finite distance to prove the search actually ran.

## 10. Concurrency: accepted, and the invariant is now stated

The token protects identity resolution only. The interleaving described, where a measurement from an abandoned selection lands on the current one, is not excluded by anything we have. The invariant is that the same token must hold from selection through identity to measurement, and a result carrying a stale token at any stage is discarded. The proposed detection is workable: a receipt whose reported distance matches the previous selection's known distance rather than the current one.

## 11. Two coordinates: already true, with one gap

The register already wins over the link, and the product already publishes which source won and the distance between them. What the review adds is the qualification on derived points, and it is right: a point derived from a lease polygon may claim only an approximate distance from that area, never the distance to the project. That qualification exists in the coordinate source field and does not yet travel into the sentence a reader sees.

## What changed as a result

| change | where |
| --- | --- |
| Geodesy: move to an ellipsoidal geodesic, not a third sphere | supersedes the planned radius fix |
| Classifier: mapping before lane, thrown separated from silent, beyond-radius must carry a distance | new test version |
| Nearest-search: explicit boundary test and a not-found state | open |
| Power flow: slack-per-component and conditioning checks | open, highest value of the eight |
| Sentinel ratings typed absent at ingestion | open |
| Hop count renamed to a topological edge count | open |
| Token carried through to measurement | open |

Nothing here was promoted and no published version was edited.
