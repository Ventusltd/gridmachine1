# Cable engines

Decided 2026-09-07, superseding the working title of engine modules. Arises from GG-031, GG-033 and GG-034.

## The idea, in the owner's terms

The Central line and the District line are both railways, and that is where the similarity ends. They run different routes, serve different stops, and obey different rules. Nobody runs one timetable across both because both are trains.

The same holds here. What connects a project to the grid is a **cable**, and cables differ in kind. So the engine is not one measurement applied to every project. It is a set of **cable engines**, each defined by the cable it models: where that cable starts, where it ends, what route it can take, and what is publicly known about it.

The boundary is the cable, not the label on the project. That is a better cut than technology, because two projects with the same technology label can be joined by different cables, and the cable is the thing being measured.

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

## Consequences

**For the tests.** The classifier gains a state per engine, and must distinguish an engine answering its own question from an engine falling back to the general one. A fallback nobody notices is how a wrong question survives.

**For the data.** Each engine needs its inputs collected, and in every case the authoritative fact is public rather than inferable: far converter coordinates for eight of ten links, counterparty country per link (already held), declared onshore connection points for offshore projects, annual energy per link (already held, not surfaced). This is automated collection, because the hole reopens with every new project.

**For the precedent.** The interconnector handover already works this way: the arrival is passed to its own lane and the receipt records the handover as a legitimate state. That published, testable handover is the pattern to generalise.

## Not decided here

Whether these live inside the existing engine repository or beside it, and how they are named in code, is not settled by this note.
