# SIS — next-step review (Hermes)

Date: 2026-10-14 · **Read-only review.** No source or runtime file was edited; the only file
created is this report. Scope: identify the next three highest-value SIS tasks that stay
**local mock only**, and flag gaps, duplicate work, unsafe scope, and missing verification.

## Method (read-only commands)

```sh
ls -1 . ; find docs -type f ; find sis-victor-pass -type f ; ls -1 dist
grep -oE 'href=[^ >]+' dist/index.html | sort -u
grep -oE '"id":"[^"]*"' sis-victor-pass/world/bodies.json
grep -oE "id:'SIS-[0-9]+'" dist/archive.html | sort -u
grep -oE '\{ id: "[A-Z]+-[0-9]+"' dist/world.js
grep -oE '127\.0\.0\.1:[0-9]+|/api/[a-z]+' sis-victor-pass/world/index.html | sort -u
ls -la .cursor/rules ; git -C . rev-parse --is-inside-work-tree
```

## What exists today (evidence)

| Surface | Path | Size / shape |
|---|---|---|
| Landing A | `dist/index.html` | 6,383 B, static, 0 `<script>`; links `archive.html` + `world.html` |
| Landing B | `sis-victor-pass/index.html` | 14,713 B, 1 inline script; worker bay + world link (OpenCode a11y pass) |
| World A (buildless) | `dist/world.html` + `dist/world.css` + `dist/world.js` | 1,239 / 4,323 / 10,669 B; in-memory mock, **no** API |
| World B (API-backed) | `sis-victor-pass/world/index.html` | 17,155 B; consumes `/api/*` on `127.0.0.1:4174` |
| Archive | `dist/archive.html` | 7,074 B (Codex); 4 mock chassis, filters, inline silhouettes |
| World service | `sis-victor-pass/world/{server.js,schema.json,bodies.json,adapter-client.js,adapter-cli.js,provider-wrapper-example.js}` | contract + adapter boundary |
| Tests | `sis-victor-pass/world/{adapter-smoke.js,detail-smoke.js,provider-wrapper-smoke.js}` | **only** for the API service |
| Rules | `AGENTS.md`, `.cursor/rules/tailscale-workflow.mdc` (present), `SIS-AGENT-WORKER-OPERATIONS.md` | worker ownership/transport/credential rules |
| Gates | `SIS-WORLD-HOSTING-REVIEW.md` | 12 hosting preconditions; go/no-go |

## Findings

### 1. Duplicate surfaces with drift risk (highest concern)

- **Two landings** (`dist/index.html` vs `sis-victor-pass/index.html`) and **two world UIs**
  (`dist/world.html` vs `sis-victor-pass/world/index.html`) present the same universe with
  different code paths; no document declares which is canonical.
- **Three inconsistent body-ID schemes** for the *same four machines*:
  - `sis-victor-pass/world/bodies.json` → `ORCHARD-01`, `SPARKY-02`, `TRASHMAN-03`, `LOTUS-04`
  - `dist/world.js` bodies → `ORCHARD-01`…`LOTUS-04` (matches bodies.json) but its **agents**
    are `VCT-01 / ORC-02 / SPK-03 / LTS-04`
  - `dist/archive.html` → `SIS-01 / SIS-02 / SIS-03 / SIS-04`
  So an "integrate the pages" pass would have to reconcile identity before anything links up.
- `dist/world.js` **hardcodes** the mock bodies/agents, duplicating `bodies.json`; they can drift
  silently. Evidence: bodies/agents arrays at the top of `dist/world.js` vs `bodies.json`.

### 2. No version control, despite rules that assume it

`git rev-parse` → **not a git repository**. `SIS-AGENT-WORKER-OPERATIONS.md` §File ownership says
"Use branches or worktrees for concurrent work" and "Every accepted change includes a diff" —
impossible here. With Codex, OpenCode and Hermes editing in place (mtimes within minutes of each
other today), the **file-allowlist rule is the only guard**. This is the single largest process
risk and is not called out in any current doc.

### 3. Verification gaps

- **No committed tests for any `dist/*` page.** The three smoke tests cover only the API service.
  The recent `dist/` audit lived in `SIS-HERMES-QA-HANDOFF.md` plus an ad-hoc scratch script — not
  reproducible by the next worker from the repo alone.
- **Landing accessibility pass has no browser-rendered confirmation** (documented twice: build
  plan item 14 and `SIS-MAC-HANDOFF` — "the Brave headless browser check hung").
- No link/asset-integrity or banned-token check is wired into a repeatable command that a worker
  must run before completion.

### 4. Unsafe-scope hazards to avoid (must stay local mock)

- `dist/world.html` is currently **network-free**. "Wiring it to the world" would introduce
  network into a page that has none; if done, it must go through the adapter boundary and stay
  loopback-only — and anything beyond loopback is gated by `SIS-WORLD-HOSTING-REVIEW.md`.
- No provider credentials, hosting, wallets, persistence, PSN, shell, or real-device control may
  enter the browser/world (worker ops §Credential boundary; build plan §Safety boundaries). All
  three tasks below respect this.

### 5. Minor

- `SIS-OPENCODE-WORLD-UI.md` documents an ACTIVITY TIMELINE added to `sis-victor-pass/world/index.html`,
  which now differs from the version described in `SIS-AGENT-WORLD-BUILD-PLAN.md` §Verification —
  the build plan's checklist predates it. Documentation drift.

## Next three highest-value tasks (local mock only)

### T1 — Canonical surface map + one body-ID scheme *(docs only)*
- **Why:** directly removes the duplicate-work and identity-drift risk in finding 1; cheap and safe.
- **Deliverable:** new `SIS-SURFACE-MAP.md` (new file) declaring canonical landing / world /
  archive, plus the single body-ID scheme and the mapping from the legacy `SIS-0x` ids.
- **Files:** create one doc; **no source edits**.
- **Verification:** `grep` proves the map's IDs match `bodies.json`; every path listed exists.
- **Scope guard:** documentation only — no code, no network.

### T2 — Commit the `dist/*` read-only QA as a repo script *(buildless, no deps)*
- **Why:** closes finding 3 — the QA currently exists only in a chat handoff + scratch.
- **Deliverable:** `tools/sis-qa.js` (new file) that checks, for the five `dist/*` files: ids,
  in-page anchors, relative link/asset existence, `img alt`, `lang`, `prefers-reduced-motion`,
  and a banned network/storage/wallet token scan; exits nonzero on failure.
- **Files:** create `tools/sis-qa.js` (+ one line in worker ops naming it the required focused check).
- **Verification:** run `node tools/sis-qa.js` → expect all-pass on the current files (matches the
  QA handoff's results).
- **Scope guard:** read-only checks; no network calls performed by the script.

### T3 — Single source of truth for mock data *(dedupe, no new network)*
- **Why:** closes the `dist/world.js` vs `bodies.json` duplication in finding 1 without adding
  network to a page that has none.
- **Deliverable:** a tiny buildless sync (`tools/sync-world-data.js`, new file) that generates
  `dist/world-data.js` from `sis-victor-pass/world/bodies.json`; `dist/world.js` imports that
  generated file instead of its hardcoded arrays.
- **Files:** create `tools/sync-world-data.js` + `dist/world-data.js`; edit `dist/world.js`
  (one file-owner allowance).
- **Verification:** regenerate and confirm `dist/world-data.js` equals `bodies.json` contents;
  re-run the world smoke (15/15) and `tools/sis-qa.js` (all-pass).
- **Scope guard:** local files only; **no** fetch/API, so `dist/world.html` stays network-free.

## Recommended next task

**T1 — Canonical surface map + one body-ID scheme.** It is docs-only, zero-risk, takes one file,
and unblocks T2/T3 by fixing *which* surface is authoritative and *which* IDs are real — the exact
duplication/ownership hazard the worker rules warn about. Do T3 next (removes data drift), then T2
(makes the QA reproducible).

## Explicit non-goals (this review, and the tasks above)

No provider credentials, no hosting/deployment, no wallets or signing, no PSN/account access, no
persistence, no shell/command execution, no real-device control. Everything stays **local mock**.
Any step beyond loopback remains gated by `SIS-WORLD-HOSTING-REVIEW.md`.

_Read-only review; the only file written is this report._
