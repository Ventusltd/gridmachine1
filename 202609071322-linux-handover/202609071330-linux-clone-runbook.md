# Linux clone runbook — reproduce the interconnector + grid-engine slice, then publish to testcode

**For:** a Claude Code session on the Dell Ubuntu machine (and Codex for the final publish step).
**Written:** 2026-09-07 13:30 UTC by Claude Code on Windows.
**Rule that governs everything here:** a run whose control fails is `HARNESS_INVALID` and says nothing about the product. Report the failure and stop. Never pass `--no-sandbox`. Never publish anything that did not pass its own gate on this machine.

## 0. The pinned vector

```
gridatlas            380c7ea8ceab49ee86593eafc2d8666a425779de   compositions 202609071213 (v9.145), 202609071232 (v9.146)
globalgrid2050       28e41f129d80ebd1a8514b6e2c355e24ec36451b   release uk_renewables_pipeline/202609071221 (tree 36e30da9…)
ventus-grid-engine   abaa718                                    19 proofs / 461 checks on Windows
data-interconnectors 1e00d0e4d7bf3ddbc86224b3b6be5c2f3eaabf86   reference/interconnector_cables.csv (sha256 0ea612d8…)
register parquet     174040c37f3d63742d6fdd7af722a8cfdf3fb53de3ff85ff1142d22fdac4866b  (1,454,200 bytes)
```

## 1. Clone (blobless for the big one)

```bash
mkdir -p ~/GLOBALGRID_CLONE && cd ~/GLOBALGRID_CLONE
git clone https://github.com/Ventusltd/gridatlas && git -C gridatlas checkout 380c7ea8ceab49ee86593eafc2d8666a425779de
git clone https://github.com/Ventusltd/ventus-grid-engine && git -C ventus-grid-engine checkout abaa718
git clone https://github.com/Ventusltd/data-interconnectors && git -C data-interconnectors checkout 1e00d0e4d7bf3ddbc86224b3b6be5c2f3eaabf86
# globalgrid2050 is large: take the two releases the runner needs plus the catalogue tooling
git clone --filter=blob:none --sparse https://github.com/Ventusltd/globalgrid2050
cd globalgrid2050 && git sparse-checkout set uk_renewables_pipeline/202609071221 uk_renewables_pipeline/202609061329 uk_renewables_pipeline/v9.6.2 scripts catalogue testcode/drivers && git checkout 28e41f129d80ebd1a8514b6e2c355e24ec36451b && cd ..
```

Receipt: `git -C globalgrid2050 rev-parse HEAD:uk_renewables_pipeline/202609061329` must print `42f0ebde853eb84236593ac7d455107e069ddeeb` (the parent-tree pin the v9.8 runner checks).

## 2. Toolchain

```bash
node --version            # Windows ran 24.19.0; 22+ is fine
npm i -g playwright@1.58.2 && npx playwright install chromium   # as the unprivileged user, never root
python3 --version         # 3.12 on Windows; stdlib only is used
```

If Chromium prints `No usable sandbox`, you are root. Stop and fix the user; do not add `--no-sandbox`.

## 3. Engine proofs (cheapest, first)

```bash
cd ~/GLOBALGRID_CLONE/ventus-grid-engine && node verify.mjs | tail -3
```
Expected: `verify PASS — 19 proofs, 461 checks`. Any other count is a finding, not a pass.

## 4. Pipeline News release gate

```bash
cd ~/GLOBALGRID_CLONE/globalgrid2050/uk_renewables_pipeline/202609071221
bash tests/run_v9_8.sh
V9_BROWSER_SMOKE=1 bash tests/run_v9_8.sh     # needs playwright resolvable: NODE_PATH=$(npm root -g)
```
Expected: `V9.8 validation suite: PASS`, and in the smoke: 16 interconnector rows, gauges 17,950 / 16 / 2,000, ten MAP links with `interconnector=` and no `repd_ref`, six NO MAPs, then ALL TECH back at 7,680. The smoke's ref-only live arrival for 13429 will still STALL against the root Atlas (root is `202609060259`); that is measured, not gated.

## 5. Offline Atlas replay (the part Windows can do and Linux has not)

Copy the rig kit from the Windows machine: `D:\gridatlas-ci\reports\rig-kit\` → `~/GLOBALGRID_CLONE/rig/`. Then:

```bash
cd ~/GLOBALGRID_CLONE/rig
# 5a. mirror by hostname, one translator rule
while read -r size url; do p="deps/${url#https://}"; mkdir -p "$(dirname "$p")"; curl -sSL -o "$p" "$url"; echo "$(stat -c %s "$p") $url"; done < duckdb-closure-manifest.txt
# 5b. the published Atlas tree at the pinned commit, into the same mirror
mkdir -p deps/ventusltd.github.io/gridatlas && cp -r ../gridatlas/atlas deps/ventusltd.github.io/gridatlas/atlas
# 5c. the two verifiers were written with Windows paths; point them here
sed -i "s#file:///C:/Users/vikra/LocalCI/PipelineNews-GridAtlas/v004/node_modules/playwright/index.mjs#playwright#; s#D:/gridatlas-ci/offline-sandbox/deps#$PWD/deps#" verify-derived.mjs verify-interconnector-arrival.mjs
# 5d. run with the network cut (unplug, or: sudo iptables -I OUTPUT -o eth0 -j DROP for the duration)
node verify-derived.mjs 202609071213
node verify-interconnector-arrival.mjs 202609071232
```

Expected, and the only acceptable green:

```
verify-derived 202609071213
  11386   RESOLVED           mapped true   OFFICIAL_ACTIVE_REGISTER          (control)
  13429   RESOLVED           mapped true   derived true, CROWN_ESTATE_LEASE_POINT_ON_SURFACE  Ossian
  13432   RESOLVED_UNMAPPED  mapped false  NONE, no failure card             Marram
  range requests served: ~21

verify-interconnector-arrival 202609071232
  PASS  BritNed both ends       status RESOLVED      card OPEN  GB end Grain … 0 km   far NONE   lane HANDED_TO_INTERCONNECTORS
  PASS  Viking Link GB end only status NOT_DRAWABLE  card OPEN  GB end Bicker Fen … 0.001 km   far not held
  PASS  control: REPD 11386     lane MEASUREMENT_CLAIMED, nearest-on-page true
```

If either control (11386) fails, report `HARNESS_INVALID` with the first console error and stop. The three faults the Windows rig hit, in order, were: missing closure files (a fourth host, `extensions.duckdb.org`), `+esm` bundles served as octet-stream, and the Playwright route dropping the `Range` header — all fixed in `range.mjs` and the verifiers, so a Linux failure is new information.

## 6. Publish to testcode (Codex's lane) — only after 3, 4 and 5 are green

Hand the pair to Codex with this instruction:

> Publish a self-contained pair under `globalgrid2050/testcode/<UTC stamp>/` in your usual layout (`atlas/` with its **own root `current.json` set to composition 202609071232** and every referenced cartridge, release shell, manifest and `data/` file copied from gridatlas `380c7ea`; `pipeline/` = `uk_renewables_pipeline/202609071221` with its MAP links resolved to `./atlas/` through your capsule; `cases.json` carrying at least INTNED, INTVKL, 13429, 13432, 11386; `release.json` naming the four commits above). `deploy-pages.yml` includes `testcode/**`, so the push deploys. Then return two links to Vikram and to Claude Code:
>
> `https://globalgrid2050.com/testcode/<stamp>/pipeline/` and `https://globalgrid2050.com/testcode/<stamp>/atlas/?interconnector=INTNED&technology=interconnector&anchor=midpoint&latitude=51.69895&longitude=2.36873&zoom=7`
>
> Acceptance for the link: the second URL opens with the interconnector layer visible, the span framed, and a card reading `Grain Static Inverter Plant at 0 km`. Clicking BritNed's MAP in the first URL must reach the same card. Do not touch `atlas/current.json` in the gridatlas repo; root promotion stays with the owner.

## 7. Report back

One file, same shape as the Windows receipts: the four commit hashes, the proof count, the runner's last line, the two replay tables verbatim, the testcode links, and a `NOT_RUN` / `BLOCKED_HARNESS` line for anything that did not execute. No verdicts on the energy transition, no grades on any project's grid position.
