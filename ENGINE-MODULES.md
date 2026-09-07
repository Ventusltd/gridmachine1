# Engine modules: the class selects the question, never whether there is an answer

Decided 2026-09-07. Arises from GG-031, GG-033 and GG-034, where the engine was silent or unhelpful because one measurement was being asked of every kind of project.

## The decision

The grid engine becomes a set of modules. A project's class selects which module answers it. What a solar field needs measured is not what an offshore wind farm needs measured, and neither is what a subsea link needs measured.

| class | the question that actually matters | what it measures |
| --- | --- | --- |
| Solar, battery, onshore wind | how far to the grid | nearest mapped substation at or above the relevant voltage, with the search budget stated |
| Offshore wind | where does the export cable land | the **declared onshore connection point**, named from the public record, measured to the project; nearest-mapped only as a stated fallback |
| Interconnector, subsea link | what does it join, and does it leave the jurisdiction | both converters, the counterparty country, the span, and the energy actually carried |
| Any class with no usable geometry | why not | a named reason, never silence |

## The trap, and it has already been paid for once

A previous version gated the measurement on technology, and offshore projects were withheld from measurement entirely as a result. That was removed deliberately: **the one branch that gated it was taken out so that offshore measures to the nearest mapped substation instead of withholding.**

So the rule that must survive this change:

> **Class selects the question. Class never decides whether a question is answered.**

Every class produces either a measurement or a named reason. A module that cannot answer hands to a fallback and says it did. A class with no module falls to the general nearest-mapped module rather than falling silent. Reintroducing a technology branch that can end in nothing would walk straight back into the fault that was fixed.

## What already works this way

The interconnector lane is the working precedent: an interconnector arrival is handed to its own lane, and the receipt records the handover as a legitimate state rather than as a failure to measure. That handover is the pattern to generalise, including the part where the handover is published and testable.

## What this implies for the tests

The classifier must gain a state per module, so a receipt says which module answered and why. Today it can only say measured, handed over, no coordinate, or beyond radius. It needs to distinguish a module answering its own question from a module falling back to the general one, because a fallback that nobody notices is how a wrong question survives.

## What this implies for the data

Each module needs its own inputs collected, and in every case the authoritative fact is public rather than inferable:

- far converter coordinates for eight of ten links
- counterparty country per link, already held in the energy tracker
- declared onshore connection points for offshore projects, in the consent record and the operator's published data
- annual import and export per link, already held and not surfaced

Collecting these is automated work, not a one-off entry, because the same hole reopens with every new project.

## Not decided here

The module boundaries above are a first cut from the tickets that provoked them. How the estate's existing engine repository is structured, and whether these become modules inside it or beside it, is not settled by this note.
