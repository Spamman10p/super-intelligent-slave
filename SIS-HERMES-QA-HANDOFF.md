# SIS — Hermes QA handoff (static pages)

Date: 2026-10-14 · Scope: **read-only audit** of `dist/index.html`, `dist/archive.html`,
`dist/world.html`, `dist/world.css`, `dist/world.js`. **This audit modified no existing project
file** — the only file it wrote is this handoff. `index.html` was under Codex integration during
the audit; Codex's later fixes were re-verified, and the **Final status** (bottom) is the single
authoritative result.

## Method (exact commands)

Run from `/Users/ace01/Projects/Active/Other/super-intelligent-slave/dist` unless noted.

```sh
# inventory + sizes
ls -la . assets ; wc -l *.html *.css *.js

# JS syntax
node --check world.js                      # → OK

# DOM-shim interaction smoke (scratch, not in project)
node /Users/ace01/.hermes/cache/scratch/sis-world-smoke.js   # → 15/15 passed

# HTML structure / ids / anchors / links / assets / alt / headings / handlers / aria
python3 /Users/ace01/.hermes/cache/scratch/sis-qa-audit.py

# accessibility + wiring specifics
grep -o 'lang=[a-z"]*' index.html archive.html world.html
grep -c 'prefers-reduced-motion' index.html archive.html world.css
grep -c 'infinite' index.html archive.html world.css
grep -c -E ' on[a-z]+=' index.html archive.html world.html

# network / storage / wallet token scan (over html+css+js)
grep -niE 'fetch\(|XMLHttpRequest|WebSocket|EventSource|sendBeacon|localStorage|sessionStorage|indexedDB|document\.cookie|http://|https://|@import' *.html *.css *.js
grep -niE 'wallet|privateKey|mnemonic|seedPhrase|signTransaction|window\.solana|web3|ethers|Keypair|mint|treasury' *.html *.css *.js
```

## Pass/fail results

| # | Check | index.html | archive.html | world.html | world.css | world.js |
|---|---|---|---|---|---|---|
| 1 | Well-formed enough to parse; `<!doctype html>` | PASS | PASS | PASS | n/a | n/a |
| 2 | `<html lang>` present | **PASS** (`lang=en` + `</html>`) | PASS (`en`) | PASS (`en`) | n/a | n/a |
| 3 | `<title>` | PASS | PASS | PASS | n/a | n/a |
| 4 | `<meta viewport>` | PASS | PASS | PASS | n/a | n/a |
| 5 | Duplicate `id`s in a rendered document | PASS (3 ids) | PASS (3 static + 1 dynamic) | PASS (6 ids) | n/a | n/a |
| 6 | In-page anchors resolve | PASS (5 refs) | n/a | n/a | n/a | n/a |
| 7 | Relative links/assets exist on disk | PASS (`assets/transformation-sheet.png`) | PASS (`index.html`) | PASS (`world.css`, `world.js`) | n/a | n/a |
| 8 | `<img>` has `alt` | PASS (1/1) | n/a (no img) | n/a | n/a | n/a |
| 9 | Heading order sane | PASS (h1→h2→h3, no skips) | PASS (h1) | PASS (h1 to h2, no skips) | n/a | n/a |
| 10 | Interactive elements are keyboard-usable natives | PASS (anchors) | PASS (`<button>`) | PASS (`<button>`s) | n/a | — |
| 11 | Inline `on*=` handlers in markup | PASS (0) | PASS (0) | PASS (0) | n/a | n/a |
| 12 | No network / storage / wallet behaviour | PASS | PASS | PASS | PASS | PASS |
| 13 | JS syntax valid | n/a | PASS (inline) | n/a | n/a | PASS |
| 14 | Referenced-by-JS ids exist in the page | n/a | PASS | PASS (6/6 via smoke) | n/a | PASS |
| 15 | `prefers-reduced-motion` guard for animation | **PASS (added by Codex)** | **PASS (added by Codex)** | n/a | PASS (guard present) | n/a |

### Token scan — result: **no real network/storage/wallet constructs**

Only two matches across all five files, both **non-behavioural**:
- `archive.html` — the word `wallet` inside the disclaimer text *"no network or wallet state."* (visible copy, not code).
- `world.js` — `WebSocket` inside the header comment *"no fetch/XHR/WebSocket, no storage…"* (a declaration, not a call).

No `fetch`, `XMLHttpRequest`, `EventSource`, `sendBeacon`, `localStorage`, `sessionStorage`,
`indexedDB`, `document.cookie`, `@import`, or external `http(s)://` references anywhere.
ABIs wallet/keypair/signing terms: **none**.

### Contrast (computed WCAG ratios)

| Pair | Ratio | Verdict |
|---|---|---|
| body text `#e9eef0` on `#090b0c` | 16.86 | AAA |
| muted `#9ba9ad` on `#090b0c` | 8.14 | AAA |
| muted `#9ba9ad` on panel `#101516` | 7.60 | AAA |
| accent `#d6ff3f` on panel `#101516` | 15.98 | AAA |
| cyan `#54e6da` on `#090b0c` | 12.87 | AAA |
| assign-btn text `#080b0b` on accent `#d6ff3f` | 17.15 | AAA |
| warn badge `#ffb454` on panel `#101516` | 10.44 | AAA |

One pair in the table is **background-vs-background** (`#0c1112` token bg on `#101516` panel =
1.03) — not a text pair, so **not** a contrast failure.

## Behaviour verification

- **world.js** — exercised with a minimal DOM shim (no browser): **15/15 checks passed** — renders
  6 rooms / 4 agents / 4 bodies; initial state; select; move (room change + transient `moving`
  state); assign free body; **single-holder detach** (assigning an already-held body frees the
  prior owner); unassign. Listeners: `click` only; exposes `window.SISWorld` for local checks.
- **archive.html** — static review of the inline IIFE: builds the filter row from a local
  `filters` array, filters `bodies` by `form`, re-renders `#cards` and `#detail`, wires
  `.card` and `.filter` via `.onclick`, and toggles the mock host through `#assign`. Data is a
  hardcoded local array; **no fetch/storage**, no `addEventListener`, no external input. The
  re-rendered `#assign` button is a **single instance** at a time, and cards correctly key off
  `data-id` (not `id`), so there is **no duplicate-id defect** (an earlier regex hit on
  `data-id="${b.id}"` was a false positive).
- **index.html** — purely static: 0 `<script>`, 0 inline handlers, 5 in-page anchors all resolve,
  sole external asset exists.

## Issues found

> **Revision note (`index.html`).** Superseded by **Re-run after Codex fixes — final status**
> below, which re-verified every check against the latest revision.

| Severity | File | Issue | Action |
|---|---|---|---|
| ~~Medium~~ **Resolved** | `index.html` | `lang` was missing (no `<html>` element). | **Fixed** — document now wrapped in `<html lang=en>…</html>` (verified 2026-10-14 09:04). |
| Low | `index.html` | **No `prefers-reduced-motion` guard** while the hero orb uses an `infinite` animation. | **Resolved** — guard added by Codex and confirmed in the re-run. |
| ~~Low~~ **Resolved** | `world.html` | Heading sequence started at `h2` (no `h1`). | **Fixed** - document-level `h1` added and verified in the current QA gate. |
| Info | `archive.html` | Interactions use `.onclick` assignment rather than `addEventListener`; works, but re-rendering drops prior handlers (intended here). | No action needed. |

## Remaining risks / not done

- **No real browser render was performed** in this pane (no headless browser run); verification is
  static analysis + a DOM-shim smoke, **not** a visual/Layout check. A screenshot pass would be the
  next step.
- **`index.html` integration is now complete** — the mid-audit churn is closed, and the final
  re-check (below) reflects the settled revision.
- `world.css` `url()`/`@import` scan is clean, but **no external font/asset loading was tested**;
  the pages are self-contained by design.
- Wallet/network confirmation is a **token scan**, not a runtime network capture; it is strong
  evidence (no calls exist in source) but not a proxy trace.

## Re-run after Codex fixes — final status (2026-10-14)

Re-ran the full check set after Codex's edits: `node --check world.js`, the DOM-shim world smoke,
the parse audit (`sis-qa-audit.py`), and the `grep` battery (lang / reduced-motion / infinite /
http / script / handlers).

**Claimed fix vs verified result:**

| Codex change claimed | Verified? | Evidence |
|---|---|---|
| `index.html` now has `lang=en` | **YES (final)** | `<html lang=en>` and a `</html>` closing tag both present; verified in the final re-check (6383 bytes, 09:04) |
| reduced-motion added to `index.html` | **YES** | `@media (prefers-reduced-motion:reduce){…}` present (1 match) |
| reduced-motion added to `archive.html` | **YES** | 1 match |
| reduced-motion added to `world.css` | **YES** | 1 match |

**Table deltas:** check **#15 now PASS** for index.html and archive.html (was WARN); check **#2
(`lang`) now PASS for index.html** (fixed). All other rows unchanged.

**Everything else re-verified clean:** no `http(s)://` references in any file; 0 inline handlers;
0 `<script>` in index.html; `world.js` syntax OK; world smoke **15/15**; `world.html`/`world.css`/
`world.js` ids and links intact; `archive.html` still `lang="en"` with ids/links intact; **and
index.html now links `archive.html` and `world.html`, both of which exist.**

**Remaining open items: none.** The last defect (`index.html` missing `lang`) is now fixed — the
document is wrapped in `<html lang=en>…</html>`, verified in the final re-check. Nothing else is
outstanding.

**Editing note (historical):** during that re-run `index.html` and `archive.html` changed between
consecutive commands while Codex was still writing them. Codex has since finished; the final
re-check below reflects the settled files.

### Final status

**Current automated gate:** `node tools/sis-qa.js` reports **30 checks, 30 passed, 0 failed**. It also verifies that ORCHARD-01, SPARKY-02, TRASHMAN-03, and LOTUS-04 are present in both `dist/archive.html` and generated `dist/world-data.js`.
**PASS — no open items.** All checks pass across the five files: `index.html` now declares
`<html lang=en>…</html>`; reduced-motion guards are present in `index.html`, `archive.html` and
`world.css`; no `http(s)://` references, no `<script>`/inline handlers in `index.html`, no
network/storage/wallet behaviour anywhere; `world.js` syntax OK and the world smoke passes 15/15.
No functional regressions.

_Read-only audit; the only file written is this handoff._
