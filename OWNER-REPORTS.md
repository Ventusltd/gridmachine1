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

## GG-036 · Print layout

| field | value |
| --- | --- |
| **Report** | Print launches and the attribution is correct, but the sheet is not centred and there is no way for the reader to choose a scale |
| **URL** | https://ventusltd.github.io/gridatlas/atlas/?repd_ref=8053&technology=solar&latitude=53.0989705&longitude=0.1807074&zoom=12 |
| **Solved** | No |
| **How** | Two separate things. The **centring** is ours: the printed sheet should place the view centrally with balanced margins rather than pinned to a corner, at whatever paper size and orientation the reader chose. The **scaling control** is also ours and should not be confused with the browser's own scaling field, which the reader can already reach: our control decides how much map is in the frame, the browser's decides how large the sheet prints. The attribution is already right and must stay: it carries the data credit and the composition stamp, which is the export-provenance contract working as intended |
