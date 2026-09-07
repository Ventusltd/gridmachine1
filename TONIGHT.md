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

### Windows lane · interconnectors, and the free half first

**GG-033 step one, which needs no data collection.** The counterparty country is already held per link in the energy tracker. Bind it and say where each link goes, and distinguish a link that stays inside the UK from one that leaves it. This closes the visible half of GG-031 without waiting for any collection.

**GG-031 step two.** Collect the eight missing far converters as an automated job, not a typed list, and draw the spans.

**GG-029, as the small visual version.** The card opens minimised so the engine firing is visible. Self-contained, cheap, and it is the one the owner will see immediately.

Files touched: the interconnector data build and the arrival card. No overlap with the other lane.

### Linux lane · measurement and identity

**GG-001, the firing rate, with its limitation stated.** Neither lane can drive a real iPhone, so build the harness that repeats each arrival against the published version online, cold, and reports a rate per case, and **label it a proxy rather than iOS**. A desktop WebKit run is closer than Chromium and still not Safari on a phone. The honest deliverable tonight is a rate plus a written statement of what it cannot see.

**GG-035, the identity disagreement.** Data-level work, no browser needed: the table lists projects the map's register snapshot does not contain. Quantify it, name the boundary, and propose which source wins.

Files touched: the test harness and the register comparison. No overlap with the Windows lane.

### For the owner, and only the owner can do it

A scripted pass on the phone, because every report so far came from there and nothing else can see it:

1. Open the same project on the **tested** version and on root, and say whether the layers control fires on each. That single comparison decides GG-027 and tells us whether root promotion would close it.
2. Do the same for print, and capture **one URL where print does not launch**, beside the one where it does. GG-028 cannot move without that pair.

## Gates

- No fix begins on an intermittent ticket until GG-001 produces a rate, or until the owner's phone comparison settles it.
- The substation finder and the 400 kV engine are protected by their current receipts. A version that moves a protected number is rejected rather than negotiated.
- Every candidate runs offline first. Only if offline cannot produce a verdict does the proof route move to the hosted runner.

## Not tonight

Geodesy on the ellipsoid, the power flow conditioning checks, the news source list, the 132 kV engine. All are in the plan and none is urgent enough to compete with the four items above.
