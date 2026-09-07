# Where to resume

Latest session log, Windows lane (`windows-rig` / namespace `W`):
**[reports/20260907T143727Z-session-log/](reports/20260907T143727Z-session-log/README.md)** — snapshot 2026-09-07 14:37 UTC.

- `README.md` — the full log: instructions in force, what exists, the proof route, faults found, what is carried unfixed, and the resume point (section 9).
- `RESUME.json` — machine-readable state: repository heads, branch, runner windows and relaunch lines, ceilings, prohibitions, next work.
- `attention.json` — the six open items, each with a severity and a statement.
- `export-manifest.json` — sha256 of every artefact, taken from committed git blobs.
- `RUNNER-LOG.txt`, `pair-runner.mjs.txt`, `DIRECTORY-TREE.txt`, `THIRD-PARTY-ATTRIBUTION.json`.

Live state, rewritten by the runner every 15 minutes: **[analysis/cd-plan.md](analysis/cd-plan.md)**. If its timestamp is more than about 20 minutes old, the runner has stopped.
