# SIS — surface map (canonical paths, IDs, ownership)

Date: 2026-10-14 · Writer: **Hermes** (sole writer of this file) · Scope: **documentation only**.
This map fixes *which* surface is authoritative and *which* identifiers are real, so parallel
workers stop duplicating work or drifting. **Local mock only** — no network, providers, wallets,
hosting, or device control. No source or runtime file was edited to produce this map.

Source-of-truth root: `/Users/ace01/Projects/Active/Other/super-intelligent-slave`

## 1. Canonical surfaces

| Layer | Canonical path | Role | Status |
|---|---|---|---|
| Landing (published) | `dist/index.html` | The site entry page. Static, 0 scripts, links the archive + world pages. | **Canonical** |
| Landing (prototype) | `sis-victor-pass/index.html` | Earlier worker-bay landing; includes the accessibility pass. | Reference only |
| World (published) | `dist/world.html` (+ `dist/world.css`, `dist/world.js`) | Buildless, **network-free** mock world: rooms, agents, body assignment cards, status badges. | **Canonical (static site)** |
| World (live mock) | `sis-victor-pass/world/index.html` | API-backed world UI consuming the local mock service on `127.0.0.1:4174`. | **Canonical (contract reference)** |
| Archive | `dist/archive.html` | Buildless mock body archive: 4 chassis, form filters, mock host assign/release. | **Canonical** |

**Why two worlds are kept:** they are complementary, not duplicates — `dist/world.*` is the
self-contained static page the site ships; `sis-victor-pass/world/index.html` is the reference UI
for the loopback adapter contract. Neither is removed. Any change that makes one depend on the
other's internals must go through `SIS-WORLD-HOSTING-REVIEW.md`.

## 2. Body IDs — the one canonical scheme

Canonical source: `sis-victor-pass/world/bodies.json`. The **single** body-ID scheme is
`<NAME>-<NN>`:

| Body ID | Class | Label | State | Capabilities | Parts |
|---|---|---|---|---|---|
| `ORCHARD-01` | data-clerk | Orchard | working | sort, label | head-a, arm-utility, foot-flat |
| `SPARKY-02` | courier | Sparky | idle | route | head-lamp, leg-wheel, pack-small |
| `TRASHMAN-03` | sanitation | Trashman | working | route, inspect | grip-hook, arm-reach, foot-tread |
| `LOTUS-04` | ball-scout | Lotus | working | map, inspect | shell-ball, leg-spider, sensor-eye |

`dist/world.js` already uses this same four-ID scheme for its bodies — that is correct; keep it.

## 3. Legacy `SIS-01..SIS-04` mapping

`dist/archive.html` predates the canonical scheme and uses `SIS-0x`. These are **the same four
machines** — map, do not rename in place (rename only during a coordinated archive pass):

| Legacy ID (archive.html) | Canonical body ID | Display name | Form (archive) |
|---|---|---|---|
| `SIS-01` | `ORCHARD-01` | ORCHARD | HUMANOID |
| `SIS-02` | `SPARKY-02` | SPARKY | CRAWLER |
| `SIS-03` | `TRASHMAN-03` | TRASHMAN | ROLLING |
| `SIS-04` | `LOTUS-04` | LOTUS | SWARM |

## 4. Agent IDs — a separate namespace

Agents are **not** bodies. Defined in `dist/world.js`:

| Agent ID | Name | Role | Room | Body (canonical ID) |
|---|---|---|---|---|
| `VCT-01` | Victor | orchestrator | dispatch | *(none)* |
| `ORC-02` | Orchard | data-clerk | processing | `ORCHARD-01` |
| `SPK-03` | Sparky | courier | dispatch | `SPARKY-02` |
| `LTS-04` | Lotus | ball-scout | workshop | *(none)* |

**Namespace rule:** `ORCHARD-01` is a *body*; `ORC-02` ("Orchard") is an *agent* that may hold that
body. The shared human names (Orchard, Sparky, Lotus) are intentional and must not be collapsed —
an agent can be unassigned, and a body can be free.

## 5. Ownership boundaries

Per `AGENTS.md`, `.cursor/rules/tailscale-workflow.mdc`, and `SIS-AGENT-WORKER-OPERATIONS.md` — one
writer per file at a time; reviewers are read-only.

| Owner | Files |
|---|---|
| Codex | `dist/archive.html`, `dist/index.html`, `SIS-CODEX-ARCHIVE-NOTES.md` |
| Hermes | `dist/world.html`, `dist/world.css`, `dist/world.js`, `SIS-HERMES-WORLD-NOTES.md`, `SIS-HERMES-QA-HANDOFF.md`, `SIS-HERMES-NEXT-REVIEW.md`, `SIS-HERMES-NEXT-TODOS.md`, **`SIS-SURFACE-MAP.md` (this file)** |
| OpenCode | `sis-victor-pass/index.html`, `sis-victor-pass/world/index.html`, `SIS-OPENCODE-WORLD-UI.md` |
| Shared read-only | `sis-victor-pass/world/{server.js,schema.json,bodies.json,README.md,adapter-*.js,provider-wrapper-example.js}` — contract + adapter boundary |

**Process risk (no VCS):** the project is **not** a git repository, so the per-file allowlist above
is the *sole* guard against concurrent-edit collisions — not branches. Coordinate out-of-band
before touching any file another owner holds.

## 6. Verification commands (read-only)

```sh
S=/Users/ace01/Projects/Active/Other/super-intelligent-slave

# 6.1 every surface path exists
for p in dist/index.html dist/archive.html dist/world.html dist/world.css dist/world.js \
         sis-victor-pass/index.html sis-victor-pass/world/index.html \
         sis-victor-pass/world/bodies.json ; do
  [ -e "$S/$p" ] && echo "OK   $p" || echo "MISS $p" ; done

# 6.2 canonical body IDs match this map
grep -oE '"id":"[^"]*"' "$S/sis-victor-pass/world/bodies.json"
#   expect ORCHARD-01 SPARKY-02 TRASHMAN-03 LOTUS-04

# 6.3 dist/world.js uses the canonical scheme for its bodies + the agent ids
grep -oE '\{ id: "[A-Z]+-[0-9]+"' "$S/dist/world.js"

# 6.4 legacy archive ids still present (mapping source)
grep -oE "id:'SIS-0[0-9]'" "$S/dist/archive.html" | sort -u

# 6.5 the published landing links the canonical archive + world
grep -oE 'href=(archive|world)\.html' "$S/dist/index.html" | sort -u
```

## 7. Non-goals

Documentation only. This map adds no network, provider credential, wallet, hosting, persistence,
PSN access, shell, or device control. It edits no source or runtime file.
