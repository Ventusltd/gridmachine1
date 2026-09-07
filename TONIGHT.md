# Tonight's build plan

2026-09-07, from [ENGINEERING-PLAN.md](ENGINEERING-PLAN.md). Two lanes work in parallel without touching the same files. Nothing is promoted. One change per version, each carrying the test that failed before it, each leaving its predecessor as the control.

## Where things are committed, and why

| what | where | why |
| --- | --- | --- |
| **This plan and every engineering document** | `Ventusltd/gridmachine1` | The owner's instruction: this repository is for analysis. It is the single source of truth for what is being built and why |
| **The same plan, mirrored for the other lane** | `Ventusltd/gridmachine2` | So neither lane has to ask what the other believes. Coordination only; evidence stays in each lane's own repository |
| **Candidate versions and their tests** | `Ventusltd/testcode`, branch `worker/<lane>/<ticket>-<stamp>` | Tests, candidates and release tooling stay out of production repositories. Branch only, never main, never force-push |
| **Receipts and evidence** | inside each candidate pair, committed on its own branch | A receipt travels with the bytes it describes |
| **Nothing at all** | `gridatlas`, `pipelinenews`, `globalgrid2050` | No production repository is touched until the owner promotes a tested pair |

## Lane split, chosen so the lanes cannot collide

### Windows lane · layers first, then interconnectors

**GG-027, the layers control, is the owner's first priority and is now classed as a regression.** Before any code changes, settle which version broke it: the same project on the tested composition and on root, layers pressed on each. If it works on the tested version, the ticket is root promotion rather than a repair. If it fails on both, sweep the earlier lineage for the version where it last worked, the same sweep GG-038 needs.

**GG-041 goes with it**, because it is deletion rather than construction: remove Save image from the File menu, keep Print.

### Windows lane · interconnectors, and the free half first

**GG-033 step one, which needs no data collection.** The counterparty country is already held per link in the energy tracker. Bind it and say where each link goes, and distinguish a link that stays inside the UK from one that leaves it. This closes the visible half of GG-031 without waiting for any collection.

**GG-031 step two.** Collect the eight missing far converters as an automated job, not a typed list, and draw the spans.

**GG-029, as the small visual version.** The card opens minimised so the engine firing is visible. Self-contained, cheap, and it is the one the owner will see immediately.

Files touched: the interconnector data build and the arrival card. No overlap with the other lane.

### Linux lane · measurement and identity

**GG-001, the firing rate, on Android.** The owner's decision, 2026-09-07: **target Android phones and assume iPhone follows.** That removes the blocker rather than working around it. Android Chrome runs the same engine the harness already drives, so a phone-shaped run with touch input, a phone viewport and a device pixel ratio is materially the platform rather than a stand-in for it. Build it that way: cold cache, real network, each arrival repeated, a rate per case.

What that still cannot see, said plainly so nobody over-reads the number: a real device's memory pressure and thermal behaviour, and any fault that only exists in Safari on iOS. The second is now an accepted risk by the owner's instruction, not an oversight.

**GG-035, the identity disagreement.** Data-level work, no browser needed: the table lists projects the map's register snapshot does not contain. Quantify it, name the boundary, and propose which source wins.

Files touched: the test harness and the register comparison. No overlap with the Windows lane.

### For the owner, and only the owner can do it

A scripted pass on the phone. Less is needed now that the target is Android, but two comparisons still need a human hand:

1. Open the same project on the **tested** version and on root, and say whether the layers control fires on each. That single comparison decides GG-027 and tells us whether root promotion would close it.
2. Do the same for print, and capture **one URL where print does not launch**, beside the one where it does. GG-028 cannot move without that pair.

## Harness rule, added 2026-09-07

**Every case runs portrait and landscape, phone and desktop, in the same run.** Landscape on a phone is currently a black screen and no harness has ever looked at it. Testing orientations separately, or not at all, is how a whole class of fault stays invisible.

## Gates

- No fix begins on an intermittent ticket until GG-001 produces a rate, or until the owner's phone comparison settles it.
- The substation finder and the 400 kV engine are protected by their current receipts. A version that moves a protected number is rejected rather than negotiated.
- Every candidate runs offline first. Only if offline cannot produce a verdict does the proof route move to the hosted runner.

## Not tonight

Geodesy on the ellipsoid, the power flow conditioning checks, the news source list, the 132 kV engine. All are in the plan and none is urgent enough to compete with the four items above.
