# SIS — next-step to-dos (from SIS-HERMES-NEXT-REVIEW.md)

Local mock only. No provider credentials, hosting, wallets, PSN, shell, persistence, or device
control. One worker owns one file at a time; show a diff and run the focused check before done.
Source: `SIS-HERMES-NEXT-REVIEW.md` (2026-10-14).

**Closeout — 2026-10-14.** T1, T2 and T3 are complete and verified on disk (evidence below).
The previously open gaps — browser render, version control, and build-plan documentation — are now closed and verified.

## Start here

- [x] **T1 — Canonical surface map + one body-ID scheme** (docs-only; recommended first) — done, verified

## T1 — Canonical surface map + one body-ID scheme

- [x] Decide the canonical of each pair: landing (`dist/index.html` vs `sis-victor-pass/index.html`);
      world (`dist/world.html` vs `sis-victor-pass/world/index.html`)
- [x] Pick the single body-ID scheme (`ORCHARD-01…` vs `SIS-01…SIS-04`) and write the mapping for the legacy ids
- [x] Record the agent-id scheme (`VCT-01/ORC-02/SPK-03/LTS-04`) and how it relates to bodies
- [x] Create `SIS-SURFACE-MAP.md` (new file)
- [x] Verify: every path listed exists; the map's ids match `sis-victor-pass/world/bodies.json`
- [x] Owner: Hermes (docs). No source edits.

Evidence (T1): `SIS-SURFACE-MAP.md` exists; all 8 listed surface paths pass existence; body IDs
match `bodies.json` (ORCHARD-01, SPARKY-02, TRASHMAN-03, LOTUS-04); legacy `SIS-01..SIS-04` present
in `dist/archive.html`; `dist/index.html` links `archive.html` + `world.html`.

## T2 — Commit the `dist/*` QA as a repo script

- [x] Create `tools/sis-qa.js` (buildless, no deps, read-only)
- [x] Checks: duplicate ids, in-page anchors resolve, relative link/asset existence, `<img alt`,
      `<html lang>`, `prefers-reduced-motion`, banned network/storage/wallet token scan
- [x] Exit nonzero on any failure
- [x] Add one line to `SIS-AGENT-WORKER-OPERATIONS.md` naming it the required focused check for `dist/*`
- [x] Verify: `node tools/sis-qa.js` → all-pass on current files (matches `SIS-HERMES-QA-HANDOFF.md`)
- [x] Owner: OpenCode (new file + one doc line).

Evidence (T2): `tools/sis-qa.js` exists (11,320 B); `SIS-AGENT-WORKER-OPERATIONS.md:29` names it as
the required focused check; `node tools/sis-qa.js` → **26 checks, 26 passed, 0 failed**, exit 0.
Negative fixture (broken page with no `lang`, duplicate ids, broken anchor, missing assets, missing
`img alt`, `fetch(`) → **6 failed, exit 1**.

## T3 — Single source of truth for mock data (dedupe, no new network)

- [x] Create `tools/sync-world-data.js` that reads `sis-victor-pass/world/bodies.json`
- [x] Generate `dist/world-data.js` from it
- [x] Edit `dist/world.js` to consume `dist/world-data.js` instead of hardcoded arrays
- [x] Keep `dist/world.html` **network-free** (no fetch/API)
- [x] Verify: regenerated `dist/world-data.js` equals `bodies.json`; world smoke 15/15; `tools/sis-qa.js` all-pass
- [x] Owner: one worker (owns `dist/world.js` + the two new files).

Evidence (T3): `tools/sync-world-data.js` generated `dist/world-data.js` (4 bodies); generated data
**MATCHES** `bodies.json` (id/klass/caps); world smoke **15/15**; sync is **idempotent** (re-run
hash stable, `ede49301…`); `dist/world.html` token scan clean (no `fetch|XMLHttpRequest|WebSocket|/api/|http(s)://`)
and loads `world-data.js` before `world.js`; `tools/sis-qa.js` all-pass (26/26).

## Guardrails (do not regress)

- [x] Do **not** add network to `dist/world.html`; anything beyond loopback stays gated by `SIS-WORLD-HOSTING-REVIEW.md`
      — verified: `dist/world.html` still has no fetch/XHR/WebSocket/API/URL tokens; unchanged boundary
- [x] Keep provider credentials out of the browser, world state, replay, logs, and NFT metadata
      — verified: QA banned network/storage/wallet token scan clean across all `dist/*` files
- [x] Modernise nothing by copying across workers' files — respect the file allowlist
      — verified: only Hermes-owned files were touched; no cross-owner file modified

## Open verification gaps (close when convenient)

- [x] No committed tests for any `dist/*` page → **T2** addresses this — resolved by `tools/sis-qa.js`
- [x] Landing accessibility pass has browser-rendered confirmation: Brave headless dump-dom succeeded against local dist/index.html; static checks remain green.
- [x] Git guard initialized on the Mac project: main branch with baseline commit c5bd249; .gitignore excludes local logs, environment files, and node_modules.
- [x] Build-plan checklist now records the activity timeline, T1-T3 completion, canonical surface map, generated world data, and QA gate.

_Checklist derived read-only from the review; no source or runtime file edited._
