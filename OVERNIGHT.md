# Overnight run — scope, order and acceptance

Started 2026-09-07 23:30 UTC. Ten hours, ending about 09:30. One ticket at a time. The runner tests, I make the change, I check it in a mobile viewport and in the browser, and only then does the next one start.

## Machine budget, deliberately conservative

The laptop stays cool and usable. The runner is capped well below what it managed earlier today.

| setting | value | why |
| --- | --- | --- |
| Browser copies | **1** | Earlier runs at three copies pushed free memory to 2.8 GB and the host killed its own tasks |
| Memory reserved for the host | **5 GB** | Up from 4 |
| Floor before a run starts | **4 GB free** | Up from 3 |
| Pause between studies | **90 s** | Lets the machine settle rather than running batches back to back |
| Repeats per study | **3** | Enough to catch a flapping result; the determinism question is already answered |

Compute is not the constraint tonight. Deciding what to change is.

## Serial, and the session closes

**One runner. One fix. One browser session, closed before the next begins.** Nothing runs in parallel tonight: no repeat batches, no second copy, no lingering browser between studies. A session is opened for a study, it does its work, it is closed, and the memory goes back to the machine before anything else starts.

**The runner deploys.** When a fix has a green receipt, the runner commits the new stamped version and pushes it, then repoints where it should be served. No waiting for a person between a green receipt and a deployment.

## The loop

1. **Study.** The runner measures the ticket's current behaviour and writes a receipt. No code has changed yet.
2. **Change.** One ticket, one version, carrying the test that failed.
3. **Verify.** The runner re-runs the study in a phone viewport with touch, portrait and landscape, and on desktop. I look at it myself.
4. **Move on**, or record why not, and rescope.

**Hourly rescope.** On the hour: what is done, what the receipts say, what is slower than expected, and whether the order should change. Written into this file, not held in my head.

## Order, cheapest and highest value first

| # | ticket | study first measures | accepted when |
| --- | --- | --- | --- |
| 1 | **GG-027 layers** | The same project on the tested composition and on root, portrait and landscape, phone and desktop, layers pressed on each | The control opens and closes the panel in all four combinations, and the map does not blank |
| 2 | **GG-041 remove Save image** | That the control exists and what it emits | The control and handler are gone; Print still produces a sheet carrying credit and composition |
| 3 | **GG-043 remove version menu** | That the links exist on the served page | The links are gone; the published versions still resolve at their own URLs |
| 4 | **GG-029 card opens minimised** | Whether the card covers the map on arrival at a phone width | The card arrives minimised with its restore control visible, and the drawn lines are unobscured |
| 5 | **GG-042 landscape** | Rendered map height at phone landscape | The map has non-zero height and paints in landscape at three phone sizes |
| 6 | **GG-040 rename to Elements** | Where the label appears | The label reads Elements; nothing else moves |
| 7 | **GG-037 Scope** | Whether the arming function is called by anything | Scope arms, a click measures at that point, and the receipt shows which engine answered |
| 8 | **GG-033 counterparty** | Which links hold a counterparty already | Every link states where it goes and whether it leaves the UK |
| 9 | **GG-035 title fallback** | How many table projects the register misses | A link-only arrival shows its own name, never a placeholder |
| 10 | **GG-036 print layout** | Margins and placement on the emitted sheet | The view is centred with balanced margins; a scale control exists |
| 11 | **GG-038 size slider** | Which release last carried it | The control is back and filters the table |
| 12 | **GG-026 technology filters** | Which technologies the register holds against those offered | The long-tail technologies are selectable |

Two per hour is the target. It will not hold evenly: the deletions are minutes, Scope and the interconnector work are not. The order puts the cheap certain wins first so the night banks progress early.

## Promotion, authorised

The owner has authorised promotion without waiting: when a line is fixed and its receipt is green, promote to the Atlas and to Pipeline News, and publish the homepage when all are done.

Conditions I am keeping, because they are what makes promotion safe rather than fast:

- **Nothing promotes without a passing receipt** naming the exact composition it was tested against.
- **No published version is edited.** Every change is a new stamped version; promotion repoints the root at one.
- **The protected engines stay green.** The substation finder and the 400 kV engine have passing receipts, and a change that moves them is rejected rather than argued about.
- **Every promotion is recorded here** with its stamp, its receipt and what changed.

## Log

Appended as the night goes. Each entry: time, ticket, what the study measured, what changed, what the verification said.

### 22:42 UTC · GG-027 layers · study complete, fault located

**The control is not dead. It half works, and that is worse.** Measured on one project, on both compositions, in three shapes, with the panel read identically before and after the tap:

| shape | label before | label after | panel height | map height |
| --- | --- | --- | --- | --- |
| phone portrait | LAYERS | HIDE LAYERS | 591 -> 591 | 844 -> 844 |
| phone landscape | LAYERS | HIDE LAYERS | 273 -> 273 | 390 -> 390 |
| desktop | HIDE LAYERS | LAYERS | 342 -> 5 | 518 -> 886 |

On a desktop the panel collapses and the map grows into the space it leaves. **On a phone the label flips and nothing else moves at all.** The tap registers, the button answers, and the panel it names ignores it. That is exactly what the owner reported, and it explains why it feels dead rather than broken.

**Identical on root and on the tested composition**, so promotion would not have fixed it. The cheap hypothesis is closed and the ticket goes back to the code.

**A caution recorded against my own work.** The first version of this study reported all six shapes as working. It read the label after the tap with a stricter matcher than it used before, found nothing, and treated a string differing from null as a change. My own test produced the vacuous pass I have spent the evening cataloguing in other code. Fixed by measuring both sides identically, which is now the rule in this harness.

**Thermal guard added.** This firmware exposes no temperature sensor, so the runner watches the processor clock against its rated maximum and waits two minutes whenever it sits below three quarters of rated. Measured at idle: 2400 of 2400 MHz, no throttling.

**How the runner is actually driven, since the question was asked.** The runner does not read this file and does not understand English. This file is for a person and for me. What the runner executes is a study written as code, with explicit selectors, explicit measurements and an explicit receipt. The translation from a sentence like "check whether the layers button fires" into a script that measures a panel height before and after a tap is the work, and it is mine. That is also why the vacuous pass above was possible: a badly written study runs just as obediently as a good one.

### 00:25 UTC · GG-027 · diagnosis complete, from the owner's own screenshots

The owner tapped layers on an iPhone 16 Pro Max and photographed both states. The label reads HIDE LAYERS in one and LAYERS in the other, on the same page, with no other visible difference. **The toggle fires. The panel opens where the reader cannot see it.**

Emulation agreed and I misread it twice: the panel wrapper goes 0 to 345 on a Pixel and 0 to 132 in landscape, so it is opening. What emulation could not show is that on a phone the panel lives in the document below the map, while the project card is a fixed full-width bottom sheet sitting over that space. A ledger entry from v9.90 records the same collision from the other side: the card was made fixed, and the layer panel remained underneath it.

So GG-027 is not a dead control and not a broken toggle. **It is a panel opening behind a sheet.** Three consequences:

- The fix belongs with GG-029. If the card opens minimised, the space the panel needs is free, and one change serves both tickets.
- The panel should open as an overlay within the map area on a phone, not in flow beneath a fixed element, so it cannot be covered again by the next sheet someone adds.
- The one shape where it genuinely does not open, 658x320, is a separate and smaller fault: the collapse attribute never clears there.

Recorded against my own work again: I called this dead, then broken on all phones, then working everywhere. Three readings, three wrong, corrected each time by measuring something better. The owner's two screenshots settled it in one message.
