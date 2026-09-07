# Cable engine datasheets

One datasheet per engine, 2026-09-07. A datasheet says what the engine answers, what cable it models, what it needs, what it publishes, and how it is allowed to fail. Nothing here is built yet; three of the five exist in part.

Read with [CABLE-ENGINES.md](CABLE-ENGINES.md), which holds the rule these all obey: **an engine selects the question, it never decides whether a question is answered.**

## Rules common to every engine

| rule | why |
| --- | --- |
| Distances are computed on the WGS84 ellipsoid | Measured 2026-09-07: on a 235 km span a sphere understates by 450 to 713 m depending on the radius chosen. No single sphere is right across an area. |
| A bounded search returns a nearest only if the best candidate is closer than the distance to the search boundary | Otherwise the answer is an ellipse in metres, and the nearest returned may not be the nearest. Ticket GG-011. |
| Every distance says it is to the nearest **mapped** asset, and states how many were invisible | 141 of 355 published connection points at 400 kV carry no coordinates. Ticket GG-012. |
| An engine states its own route model and never borrows another's calibration | A subsea cable does not follow a road. Ticket GG-014. |
| An engine publishes a sentinel when it fires, and a named reason when it cannot | Silence is indistinguishable from failure. Tickets GG-002, GG-034. |
| Every engine that falls back to another says so in its output | A fallback nobody notices is how a wrong question survives. |

---

## E1 · Substation finder within a radius

| field | value |
| --- | --- |
| **Question** | What is the nearest connectable substation to this site, and how far? |
| **Cable modelled** | Onshore AC connection from a site to the network |
| **Endpoints** | Site point → substation point |
| **Voltage scope** | 33 kV and above, reported with the voltage of the asset found |
| **Geometry** | Ellipsoidal straight line. Corridor estimate only where a calibration exists for that cable type |
| **Search rule** | Radius budget, stated in the output. Must satisfy the boundary test above, or return a named not-found state |
| **Inputs held** | Mapped substation set with voltages, currently reported at 33 kV and above |
| **Inputs missing** | None known; coverage is the limit rather than the data model |
| **Outputs** | nearest name, distance, voltage, count within budget, budget used, mapped-only caveat |
| **Legitimate silence** | Nothing inside the budget, with a true distance reported beyond it |
| **Status** | **Exists.** This is the general case and the fallback for every other engine |
| **Open tickets** | GG-011, GG-012 |

## E2 · Interconnector, subsea link

| field | value |
| --- | --- |
| **Question** | What does this link join, does it leave the jurisdiction, and what does it carry? |
| **Cable modelled** | HVDC subsea cable between two converter stations |
| **Endpoints** | GB converter → far converter |
| **Voltage scope** | HVDC; the GB converter is measured at its own connection voltage |
| **Geometry** | Converter-to-converter separation on the ellipsoid. **Not cable length**, and labelled as such. No road calibration applies |
| **Jurisdiction** | Counterparty country is an output, not an inference. An internal link, such as one between Great Britain and Northern Ireland, is the same engine with a different jurisdiction answer |
| **Inputs held** | 10 links; 10 GB converters; **2 far converters**; counterparty country per link, already in the energy tracker; annual import and export per link |
| **Inputs missing** | **8 far converters**, all publicly documented. Reconciliation with the 16 records the table shows |
| **Outputs** | both converter names, separation, counterparty, energy carried, drawable or not, and why not |
| **Legitimate silence** | Far converter not held: the GB end is measured and the far end is declared as not held. Never presented as a domestic asset |
| **Status** | **Partial.** Draws for 2 of 10 |
| **Open tickets** | GG-003, GG-031, GG-033, GG-013 |

## E3 · Offshore export cable to its onshore connection

| field | value |
| --- | --- |
| **Question** | Where does this project's export cable land, and what does it connect to onshore? |
| **Cable modelled** | Offshore array to landfall to onshore connection point |
| **Endpoints** | Array centroid or lease area → landfall → **declared onshore connection point** |
| **Voltage scope** | Connection point voltage as declared, typically transmission |
| **Geometry** | Measured to the declared connection point. Route is set by landfall and consent, never by proximity, so no nearest-asset shortcut and no road calibration |
| **Inputs held** | Offshore coordinates including lease-derived points; declared connections dataset; published connection points |
| **Inputs missing** | Declared onshore connection point for most offshore projects; landfall locations |
| **Outputs** | declared connection name, distance, whether the point is built or consented only, coordinate provenance including lease-derived |
| **Legitimate silence** | No declaration held: hands to E1, **says it did**, and reports the nearest mapped substation as a fallback rather than as the connection |
| **Status** | **Missing.** This is why offshore arrivals look like the engine is broken |
| **Open tickets** | GG-034, GG-002, GG-018 |

## E4 · 400 kV overhead line and transmission connection

| field | value |
| --- | --- |
| **Question** | What is the transmission-level connection, declared or nearest, and what does the operator publish about it? |
| **Cable modelled** | Overhead line at 400 kV, and the consented point of connection |
| **Endpoints** | Site → 400 kV substation, or site → consented point of connection |
| **Voltage scope** | 400 kV and above |
| **Geometry** | Ellipsoidal straight line. Overhead lines cross open country and measure about 1.13 against published length, so **the cable-circuit corridor factor is not applied here**. That refusal already exists in the product and is correct |
| **Inputs held** | 278 mapped substations at 400 kV or above; operator publishes 355 connection points at that class, 214 with coordinates; declared connections from consent orders; circuits, seasonal ratings, fault levels as published |
| **Inputs missing** | Coordinates for 141 published connection points, which are not ours to invent |
| **Outputs** | named substation or declared point, distance, published circuits and ratings, fault level as published, mapped-only caveat |
| **Legitimate silence** | No 400 kV asset within budget, with the true distance beyond it reported |
| **Status** | **Exists**, and is the most complete engine |
| **Open tickets** | GG-012, GG-015, GG-016 |

## E5 · 132 kV distribution connection

| field | value |
| --- | --- |
| **Question** | What is the distribution-level connection for a project too small or too far for transmission? |
| **Cable modelled** | 132 kV and below, distribution network operator assets |
| **Endpoints** | Site → 132 kV or lower substation, or declared distribution connection |
| **Voltage scope** | 132 kV, 66 kV, 33 kV |
| **Geometry** | Ellipsoidal straight line. Corridor calibration must be established separately for distribution cable routes and not inherited from transmission |
| **Inputs held** | More than recorded earlier. Verified in the layer files: 6,227 features at 132 kV with operators attached, 1,171 at 66 kV, 5,800 substations of which 573 are tagged 132 kV and 2,075 at 33 kV. The assets are present; see [DATA-PROVENANCE](reports/20260907T230000Z-engine-capsule/DATA-PROVENANCE.md) |
| **Inputs missing** | Distribution operator connection data, headroom and constraint publications, and a route calibration of its own. Not the assets, which exist |
| **Outputs** | named asset, voltage, distance, operator, and the constraint position where published |
| **Legitimate silence** | No mapped distribution asset in budget, with the true distance beyond it |
| **Status** | **Missing as an engine, but not for want of data.** The assets are there and the question is simply not asked |
| **Open tickets** | new |

---

## What has to be true before any of these is built

1. **A firing rate exists**, measured on the platform where faults are actually seen. Ticket GG-001. Until then no engine can be shown to have improved anything.
2. **Each engine's datasheet above is approved**, because the datasheet is the contract the test asserts against.
3. **One engine per version.** The version carries the test that failed before it, and the previous version stands as the control.
4. **Collection is automated, not typed.** Far converters, declared connection points, distribution data: the same hole reopens with every new project otherwise.
