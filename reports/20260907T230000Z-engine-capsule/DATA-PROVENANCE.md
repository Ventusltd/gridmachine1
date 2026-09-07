# Where the voltage layers actually come from

Checked 2026-09-07 against the files themselves, because the owner asked whether these might have been generated rather than sourced.

## The answer

**They are OpenStreetMap extracts. Nothing here looks generated.** The evidence is in the tags, and it is not the kind of thing a model produces.

| layer | features | named | operators seen | voltage tag |
| --- | --- | --- | --- | --- |
| 400 kV | 4,106 | 553 | National Grid, National Grid Electricity Transmission, SP Energy Networks | `400000`, and 60 tagged `400000;275000` |
| 275 kV | 2,935 | 328 | National Grid Electricity Transmission, SP Energy Networks | `275000`, 60 shared with 400 kV |
| 220 kV | 126 | 45 | Scottish Power Renewables | `220000` |
| 132 kV | 6,227 | 865 | UK Power Networks, National Grid Electricity Distribution, SP Energy Networks | `132000`, 52 tagged `132000;33000` |
| 66 kV | 1,171 | 43 | YEDL, National Grid Electricity Distribution, Northern Powergrid | `66000` |
| substations | 5,800 | 4,460 | National Grid Electricity Distribution, UK Power Networks | 2,075 at `33000`, 1,498 at `33000;11000`, 573 at `132000` |

## Why this is certainly OpenStreetMap

**The `source` tags are surveyor's notes.** Alongside `Bing` and `OS_OpenData_VectorMap_District`, three features in the 220 kV layer carry: *"Digging scars visible on 2018 Sentinel-2 imagery"*, and two more add *"and 2019 Maxar imagery"*. That is a human mapper explaining how they traced a line that was under construction. No generator writes that, and no generator would write it on five features out of 126.

**The voltage tags use OpenStreetMap's own multi-value convention.** Values like `400000;275000`, `132000;33000` and `66000;11000` are how a shared tower carrying two circuits at different voltages is tagged in that project. A fabricated dataset would carry one clean number per feature.

**The operators are real and unevenly distributed**, in the way real tagging is: 513 features credited to one form of a company's name and 375 to a longer form of the same company, exactly the inconsistency that accumulates when thousands of people tag over years.

**Coverage is uneven in the way reality is.** 4,106 features at 400 kV but only 553 named. 126 features at 220 kV, which matches a voltage barely used in Great Britain outside a few Scottish connections.

## What follows from that

**Attribution is required and is already carried.** OpenStreetMap data is licensed under the Open Database Licence, so any rendering or export must credit OpenStreetMap contributors. The shell does this in the map credit, and the export path does it too, which is why the missing credit found earlier today is a real defect rather than a nicety. Where a feature's source names Ordnance Survey open data, that flows through the same licence as part of the OpenStreetMap database.

**The limits are the map's, not ours.** Only 553 of 4,106 features at 400 kV carry a name, and 4,460 of 5,800 substations do. An engine that needs a named asset must say so when it cannot get one, which the working engine already does by naming the nearest named alternative beside an unnamed nearer one.

**This settles the data question for the 132 kV engine.** It was recorded as missing its inputs; it is not. There are 6,227 features at 132 kV with operators attached, and 573 substations tagged at that voltage, plus 2,075 at 33 kV. The assets are there. What is missing is the question being asked, and the distribution operators' own connection and headroom data, which OpenStreetMap does not hold.

## Not claimed

No check was made of how current the extract is, or against a later state of the source database. Where features carry no `source` tag at all, which is the majority in every layer, the individual provenance is whatever the contributing mapper recorded in the changeset rather than on the feature, and that has not been traced.
