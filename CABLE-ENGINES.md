# Cable engines

Decided 2026-09-07, superseding the working title of engine modules. Arises from GG-031, GG-033 and GG-034.

## The idea, in the owner's terms

The Central line and the District line are both railways, and that is where the similarity ends. They run different routes, serve different stops, and obey different rules. Nobody runs one timetable across both because both are trains.

The same holds here. What connects a project to the grid is a **cable**, and cables differ in kind. So the engine is not one measurement applied to every project. It is a set of **cable engines**, each defined by the cable it models: where that cable starts, where it ends, what route it can take, and what is publicly known about it.

The boundary is the cable, not the label on the project. That is a better cut than technology, because two projects with the same technology label can be joined by different cables, and the cable is the thing being measured.

**Each engine has a datasheet: [CABLE-ENGINE-DATASHEETS.md](CABLE-ENGINE-DATASHEETS.md).** The datasheet is the contract a test asserts against, so an engine without one is not ready to be built.

## The engines, first cut

| cable engine | the cable it models | endpoints | what it measures | what it needs |
| --- | --- | --- | --- | --- |
| **Onshore connection** | AC connection from a site to the network | site, substation | distance to the nearest mapped substation at or above the relevant voltage, with the search budget stated | mapped substations, voltages |
| **Export cable** | offshore array to shore, then to the connection point | array, landfall, onshore connection point | distance to the **declared** onshore connection point, named from the public record | declared connections, consent record |
| **Subsea link** | HVDC cable between two converter stations | converter, converter | separation between converters, the counterparty jurisdiction, and the energy carried | both converter coordinates, counterparty country, per-link energy |
| **Declared connection** | a point of connection that is consented but not yet built | site, consented point | the declared connection, marked as not yet built | consent documents |

A subsea link inside the same jurisdiction is the same cable engine with a different jurisdiction answer, not a different engine. That is how Moyle and Greenlink can be told apart without inventing a category.

## Each engine owns its own route model

This is the practical payoff, and part of it already exists. The corridor estimate now on the cards is calibrated on cable circuits, which follow the highway network, and the product already refuses to apply that factor to an overhead-line question. That refusal is exactly right and it generalises: **a cable engine states its own route model and never borrows another engine's calibration.** A subsea cable does not follow a road. An export cable's route is set by landfall and consent, not by proximity. An overhead line crosses open country. One multiplier across all of them is the fault recorded as GG-014.

## The rule that must survive

> **A cable engine selects the question. It never decides whether a question is answered.**

An earlier version gated measurement on technology and offshore projects were withheld from measurement altogether; that branch was removed deliberately so offshore would measure to the nearest mapped substation rather than going quiet. Reintroducing engines carelessly walks straight back into it.

So: every project reaches an engine. An engine that cannot answer hands to the onshore-connection engine as the general case and **says that it did**. A project with no usable geometry gets a named reason, never silence.


## Priority, and what is protected

Set by the owner, 2026-09-07.

| rank | engine | why |
| --- | --- | --- |
| 1 | **E3 offshore export cable** | Does not exist. It is the reason offshore arrivals look broken, and offshore is where the capacity is |
| 2 | **E2 interconnectors** | Draws for two of ten. The missing facts are public and already partly held |
| 3 | **E1 substation finder within a radius** | **Protected.** Works today and must keep working |
| 3 | **E4 400 kV overhead line and transmission connection** | **Protected.** The most complete engine in the estate |

**Protection is a test rule, not a wish.** E1 and E4 have passing receipts today, including a solar control that measures to a named substation and a transmission card that reports published circuits and ratings. Those receipts become the control set. Any version that touches the engines must leave them green, and the previous candidate pair stands as the control it is compared against. A change that improves offshore while moving a protected number is rejected, not negotiated.

**Scale what works, replace what does not.** E1 and E4 are scaled: more coverage, better bounds, the same question. E2 and E3 are not scaled, they are given different logic, because their fault is that the wrong question was being asked. A radius search will never find a far converter or an export cable's landfall no matter how far it is widened.

## The pipeline declares the engine

A project's engine category is decided **in the Pipeline News pipeline** and carried as a field on the row, rather than being guessed by the map at arrival. The table shows it, the MAP link carries it, and the receipt asserts it.

| technology in the register | engine category | fallback |
| --- | --- | --- |
| Solar, battery storage | E1 substation finder | none needed; E1 is the general case |
| Onshore wind | E1, or E4 where a transmission connection is declared | E1 |
| **Offshore wind** | **E3 export cable to the declared onshore connection** | E1, declared as a fallback in the output |
| **Interconnector** | **E2 subsea link** | none; a link with no far converter reports the far end as not held |
| Any project with a declared transmission point of connection | E4 declared connection | E1 |
| Distribution-scale projects | E5 132 kV, when it exists | E1 |

Three reasons this belongs in the pipeline rather than in the map:

1. **It is testable before a map ever opens.** A row asserting the wrong engine is a table-level failure, caught in seconds rather than by driving a browser.
2. **It makes the routing visible to a reader.** Someone looking at an offshore row can see that it will be answered by an export-cable question, not by a proximity search.
3. **It removes the guess.** The map currently infers what to do from technology at arrival, which is exactly the inference that made offshore look broken. A declared field cannot silently disagree with itself.

The assignment is made from the declared connection where one is held, and from technology and capacity where one is not. The rule from above still governs: the category selects the question, never whether a question is answered.

## Consequences

**For the tests.** The classifier gains a state per engine, and must distinguish an engine answering its own question from an engine falling back to the general one. A fallback nobody notices is how a wrong question survives.

**For the data.** Each engine needs its inputs collected, and in every case the authoritative fact is public rather than inferable: far converter coordinates for eight of ten links, counterparty country per link (already held), declared onshore connection points for offshore projects, annual energy per link (already held, not surfaced). This is automated collection, because the hole reopens with every new project.

**For the precedent.** The interconnector handover already works this way: the arrival is passed to its own lane and the receipt records the handover as a legitimate state. That published, testable handover is the pattern to generalise.

## Not decided here

Whether these live inside the existing engine repository or beside it, and how they are named in code, is not settled by this note.
