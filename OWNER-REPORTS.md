# Owner reports, consolidated

Every item reported on 2026-09-07, with the ticket it became. All were reported on an iPhone. Nothing here is fixed.

| # | what was reported | ticket | status |
| --- | --- | --- | --- |
| 1 | Pipeline News shows only five technology filters; the long-tail technologies and their dropdown are missing | [GG-026](BUGS.md) | Open. Not a regression: no release held has ever had them. The technologies exist in the Atlas. Awaiting a decision to build the filter |
| 2 | The layers control does not fire | GG-027 | Open. Reconfirmed 22:48 on a working arrival, so it is not specific to one project. Reported on the root map, which loads different parts than the tested version |
| 3 | Print launches on some links and not others | GG-028 | Open. My earlier claim that print could not be activated was wrong and is withdrawn. Needs one failing URL beside a working one |
| 4 | The project card covers the map, hiding the engine firing | GG-029 | Open. Reconfirmed. Should open minimised with its restore control visible |
| 5 | News coverage inconsistent; solar stories missed; any UK project above 1 MW should reach the feed | GG-030 | Open. Rules recorded verbatim, including UK priority and 49 MWp for international |
| 6 | Why the international threshold exists: comparison against the UK, watch the board, play the local shape | GG-030 | Recorded as the rule behind the number, so the number cannot be argued down without arguing the rule |
| 7 | An interconnector shown as though it never leaves the UK | GG-031 | Open. Confirmed worse than reported: eight of ten links hold no far converter |
| 8 | The pipeline table is awkward on a phone; the earlier dashboard was better under a thumb | GG-032 | Open. Recorded as an interface direction: driveable one-handed first, more columns second |
| 9 | A subsea link that does not say what it is or where it goes, while our own market data holds it | GG-033 | Open. The counterparty country is already held per link, so this is partly free |
| 10 | The engine does not fire on many offshore wind sites | GG-034 | Open. The wrong question is being asked: offshore connects to a named onshore point, not to whatever is nearest |
| 11 | The engine needs modules, firing per project class | [CABLE-ENGINES.md](CABLE-ENGINES.md) | Recorded as a design rule, with the trap named: class selects the question, never whether there is an answer |
| 12 | Specify the correct cables for the correct engines, each with a datasheet | [CABLE-ENGINE-DATASHEETS.md](CABLE-ENGINE-DATASHEETS.md) | Five datasheets written: substation finder, interconnector, offshore export cable, 400 kV, 132 kV |
| 13 | A battery project arrives titled "Deep-linked project" instead of its name | GG-035 | Open. Underneath it, the table and the map disagree about which projects exist |
| 14 | The working engines are the example to learn from and must be protected | [capsule](reports/20260907T230000Z-engine-capsule/README.md) | Sealed with hashes, three surviving copies, and eight rules distilled from what makes them good |
| 14b | Verify whether the voltage layers were generated | [provenance](reports/20260907T230000Z-engine-capsule/DATA-PROVENANCE.md) | Verified: OpenStreetMap, not generated. A mapper's own note about digging scars on satellite imagery settles it |
| 15 | Print should be centred on the page with a scaling control; the attribution is good | GG-036 | Open, new |
| 16 | The Scope control has no function. It should fire like the onshore grid engine at any chosen point | GG-037 | Open, new. **Confirmed in the code:** the computation, the drawing and the arming function all exist, and nothing calls the arming function |
| 17 | An offshore project that **does** fire, and Scope still dead. Scope should be its own cartridge, built like the poly tool, dispatching by class: onshore to the substation finder, offshore to the new offshore rule, interconnector to the interconnector rule | GG-034, GG-037 | Evidence added to both. The offshore observation changes the diagnosis and is written up below |
| 18 | A slider for filtering by project size, and sorting by the capacity column, were there before and are gone | GG-038 | Open. Sorting by capacity **is still present** in every release held, including the current one. A size **slider** is present in none of them, so it is a gap rather than a regression, on the evidence available |
| 18b | No primary key across the two applications, so versions get mixed up. The other lane's inventory looks like the beginning of one | GG-039 | Open, and the most structural item of the night. A key already exists in the candidate-pair work and does not exist in production |
| 18c | The spiders role: nervous system, backup to the engine, neural links to the amnesia repository, home of the maths and logic capsules; and rename the Spider printer label to Elements | [SPIDERS.md](SPIDERS.md), GG-040 | Recorded as architecture with one label ticket. The graph has already found a duplicate geodesy implementation, structurally, before anyone measured a span |
| 19 | A well-working onshore solar arrival, but the layers control is dead and so is Scope from its dropdown. **Layers is the main priority: it worked before.** | GG-027, GG-037 | GG-027 raised to first priority and reclassified as a **regression**, on the owner's statement that it previously worked |
| 19b | Remove Save image from the File menu. A reader can screenshot | GG-041 | Open, new. Print stays, image save goes |

## GG-036 · Print layout

| field | value |
| --- | --- |
| **Report** | Print launches and the attribution is correct, but the sheet is not centred and there is no way for the reader to choose a scale |
| **URL** | https://ventusltd.github.io/gridatlas/atlas/?repd_ref=8053&technology=solar&latitude=53.0989705&longitude=0.1807074&zoom=12 |
| **Solved** | No |
| **How** | Two separate things. The **centring** is ours: the printed sheet should place the view centrally with balanced margins rather than pinned to a corner, at whatever paper size and orientation the reader chose. The **scaling control** is also ours and should not be confused with the browser's own scaling field, which the reader can already reach: our control decides how much map is in the frame, the browser's decides how large the sheet prints. The attribution is already right and must stay: it carries the data credit and the composition stamp, which is the export-provenance contract working as intended |


## GG-037 · Scope has no function

| field | value |
| --- | --- |
| **Report** | The Scope entry in the menu does nothing. It should fire like the onshore grid engine, at any point the reader chooses rather than only at a project |
| **URL** | Reported on the root Atlas, menu SCOPE, entry Scope |
| **Solved** | No |
| **How** | **Confirmed by reading the code, and the diagnosis is narrow.** The scope computation exists as its own module. The drawing exists, with its own source, ring layer, dot layer and a deliberately distinct colour, chosen so a scope reads as neither a project nor a declared connection. The arming function exists and is published on the link object so that a reviewer can ask the page which modes are live. **Nothing calls it.** No cartridge invokes the arming function anywhere, so the menu entry is wired to nothing. This is not a broken engine; it is a missing call between the menu and an engine that is already built. The comment beside it states the intent exactly: until an earlier version, clicking blank map cleared everything, which treated everywhere that is not a consented project as empty, and it is not empty, it is unexamined. |

### The two questions asked with it

**How many directions should it shoot, and is five the current number of substations?** Observed rather than proven: five lines are drawn on every project arrival I have screenshots or receipts for, and the control case records exactly five links drawn. That pattern is consistent with a fixed count of nearest assets rather than everything inside a radius, but **I could not find the constant in the source with the searches I ran, so I am not asserting it.** Settling that is the first task inside this ticket, because the answer decides whether Scope should copy the behaviour or take a count from the reader.

**Is there a 50 km limit, to keep the Atlas stable?** No evidence of one. What is established: the radius control in the shell accepts 1 to 160 km with a default of 10, and the interconnector engine uses a 10 km budget per converter while counting what lies within 20 km. The project arrival budget is a separate number that I have not verified, and I will not repeat a figure I cannot show. **Whether a cap exists, and whether it is there for stability or for meaning, is part of this ticket rather than an assumption behind it.**

### What Scope should do when it is wired

Fire the substation finder at the clicked point, with the same discipline the working engine already has: state the radius used, state how many assets were invisible to the search, name the nearest and the nearest named if they differ, and refuse rather than guess where the separation is too small for the geometry to mean anything. It is the same engine answering the same question at a different origin, which is why it is cheap and why it should not be allowed to drift into a second implementation.


## Item 17 · What the floating wind example proves

A floating wind demonstrator off the north coast fires perfectly: five lines drawn, the nearest three labelled 15.40 km at 275 kV, 20.73 km at 275 kV and 22.55 km at 132 kV.

**This changes the offshore diagnosis and makes it sharper.** Offshore is not broken as a class. The engine works offshore whenever mapped substations lie inside its budget, and this project sits close enough to shore that they do. The projects that fail are the far ones, and they fail for the reason the geometry demands: there is nothing within the budget, because their connection is a hundred kilometres of export cable, not a short hop to whatever is nearest.

**It also bounds the search budget by measurement rather than by reading constants.** A drawn link at 22.55 km proves the budget is at least that. A large offshore project tens of kilometres further out draws nothing, so the budget is smaller than that distance. The exact number is still to be read from the source, but the behaviour is now bracketed by evidence.

**And it confirms the fix is not a wider radius.** Widening the budget until Hornsea reaches something would return the nearest coastal substation, which is not where that project connects. The answer is the declared onshore connection point, which is GG-034 as written. This example is now the control case for that engine: whatever is built must leave this project's five lines exactly as they are.

## Item 17 · Scope as its own cartridge

The owner's design, and it unifies two things I had been treating separately.

**Scope becomes its own cartridge**, built the way the poly zone tool is built, so it owns its arming, its drawing and its state rather than being a menu entry hoping something else answers.

**Scope is the cable-engine router with no project attached.** At any point the reader chooses, it asks which cable question applies there and fires that engine: onshore, find the substations to snap to; offshore, use the offshore rule; interconnector, fire the interconnector rule. That is exactly the routing the pipeline will declare per row, applied to a bare coordinate instead of a register entry.

Two consequences worth stating. First, this makes Scope the **cheapest possible test of the router**, because it exercises the dispatch without needing a project, a link or a table row. Second, it means Scope must not grow its own copy of the measurement: it is the same engines answering at a different origin, and a second implementation would drift from the first within a version or two.

## GG-038 · Size filter — CORRECTED, the owner was right

**My first answer was wrong, and wrong in a way worth recording.** I searched one repository, then wrote "every release held", which was a claim about the estate made from a search of part of it. The owner said the slider was there, and it is.

**Found in the other repository.** A dual range control, `sizeMinRange` and `sizeMaxRange`, labelled for the smallest and largest project size in MW. It appears in **34 releases**, most recently `202609060232-pipelinenews`.

**So this is a genuine regression, not a gap.** The control exists in one lineage and is absent from the one now being served. Sorting by capacity survived the move; the size slider did not.

**And it is the first concrete instance of GG-039.** Two release lineages, no key joining them, so a control can be lost in the crossing and nobody can say when. The owner's line about picking up old random code is exactly this: without a key, neither of us can tell which lineage a build came from, and the burden lands on memory.

**The technology filters are different.** I checked the same release for GG-026: it carries the same five technology buttons and no dropdown. So the missing long-tail technologies remain a gap rather than a regression, while the size slider is a regression. Two remembered controls, two different answers, and only a search of the right repository could separate them.

**Assigned to a runner**, as the owner directed: sweep every repository in the estate for controls present in an older lineage and absent from the served one, and report them as a list rather than one at a time.

### What the evidence actually showed, first pass (kept, because the error matters)

Checked across every release held: v9.5, v9.6, v9.6.2, v9.7, and the three September stamped releases including the current one.

**Sorting by capacity is present in all of them, including today's.** The control is the sort selector, and the table opens sorted by capacity by default.

**A range slider is present in none of them.** No release in this repository contains a range input or a minimum and maximum capacity control.

So on the evidence held this is a gap rather than something lost, exactly like the missing technology filters in GG-026. That is now twice tonight that a remembered control appears in no release I can find: either it lived in a build that is not in this repository, or it was prototyped and never shipped. **That question is settled by the key in GG-039, not by more searching.**

## GG-039 · A primary key for the pair, and why the version confusion is structural

The most important item of the night, and the owner's diagnosis is right: without a key there is nothing to work from, and a version mix-up is the expected outcome rather than an accident.

**The key already exists, in one place only.** The candidate pairs built today carry exactly this: an immutable identity binding one Pipeline News release to one Atlas composition at a stamp, with a relational record of every component, its repository, its path and its content hash. The reverse-impact query answers what changed and which recorded results still stand.

**Production carries none of it.** A Pipeline News release is stamped, an Atlas composition is stamped, and nothing joins them. So the map and the table can disagree about which projects exist, which is GG-035, and a report can be made against a composition the tests never saw, which is every owner report tonight. Those are not separate bugs. They are one missing key seen from three sides.

**The other lane's inventory is a different instrument, and both are needed.** That inventory is a filesystem census: every path with its logical and allocated bytes and its modification time. It answers what exists on a machine. The pair key answers what was bound to what, and what was tested together. A census cannot tell you a table and a map were tested as one thing, and a key cannot tell you what is on disk.

**What to do, in order.**

1. **Give every production release the pair key it already deserves.** A Pipeline News release names the Atlas composition it was built and tested against; the composition names the release. Both write it where a reader and a test can see it.
2. **Put the key in the artefact.** The export provenance contract already requires the composition stamp on anything that leaves the building. Extend it to the pair key, so a printed sheet says exactly which two things produced it.
3. **Make the key the subject of the register.** Tickets then attach to a pair rather than to a URL, and "does this still happen" becomes answerable instead of a matter of memory.

Once that exists, the question behind GG-026 and GG-038 stops being archaeology: a remembered control either belongs to a keyed pair or it never shipped, and either answer is a fact rather than a search.

## GG-041 · Remove Save image

| field | value |
| --- | --- |
| **Report** | The File menu offers Save image, which produces a download prompt for a PNG. It is not needed: a reader can screenshot |
| **URL** | https://ventusltd.github.io/gridatlas/atlas/?repd_ref=6502&technology=solar&latitude=51.338767&longitude=0.913885&zoom=12 |
| **Solved** | No |
| **How** | Remove the control and its handler. **Print stays**, because a printed sheet carries the data credit and the composition stamp, which a screenshot does not. Removing the image path also removes the half of the export code that was found today to lose its attribution, so this closes part of GG-005 by deletion rather than by repair, which is the cheaper cure. Keep the blank-image check's lesson in the register even after the code goes, because the lesson outlives the path |

## GG-027 raised · Layers is the main priority, and it is a regression

The owner's statement changes its class: **it worked before.** So this is not a control that was never wired, it is one that stopped working, and the question is which version broke it.

That makes it the same investigation as the missing size slider: a control present in an earlier lineage and absent or broken in the served one. Both are answered by the same runner sweep, and both are instances of GG-039, the missing key between lineages.

Two facts already held that narrow it. The layer panel has a history of phone-specific faults, including one where hiding layers collapsed the element containing the map. And every report tonight is against the root composition, which loads a different set of cartridges from the tested one. So the first measurement is cheap: **the same project on the tested version and on root, layers pressed on each.**
