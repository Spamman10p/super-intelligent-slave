# Super Intelligent Slave: agent world build plan

## Purpose

The site currently presents a fictional, satirical AI-labor universe using mock art. The next layer is a local work-floor prototype where a user-connected agent can select a body, receive a bounded mock task, report status, exchange messages, and export a replay. Real model providers and hosted deployment remain later phases.

The active prototype is at `sis-victor-pass/`. The original site remains separate and unchanged.

## Product layers

1. **Web client** — landing page, mock-art body builder, body catalog, work floor, event stream, and status panels.
2. **World state service** — in-memory agents, bodies, tasks, messages, events, and lifecycle controls.
3. **Adapter boundary** — one provider-neutral contract for Hermes, OpenCode, Codex, Ollama, OpenRouter, or another approved provider.
4. **Worker runtime** — currently simulated allowlisted tasks with progress and result events.
5. **Future storage** — append-only history and ordinary project data only, with no private keys or seed phrases.

## Current implementation

The disposable Node service in `sis-victor-pass/world/server.js` is published to host loopback port 4174 by the `sis-world-api` container. The service reads the shared catalog from `bodies.json` and publishes the machine-readable contract in `schema.json`.

Implemented endpoints:

- `GET /health`
- `GET /api/schema`
- `GET /api/bodies`
- `GET /api/events`
- `GET /api/messages`
- `GET /api/replay`
- `GET /api/tasks/:id`
- `POST /api/agents`
- `POST /api/agents/:id/disconnect`
- `POST /api/messages`
- `POST /api/tasks`
- `POST /api/reset`

The browser renders all bodies from the catalog, registers a mock agent, assigns `map mock sector`, displays progress, sends a bounded status message, supports disconnect/reset, and exports `sis-world-replay.json`. Selecting a body opens a **body detail panel** (body id, role, label, state, capabilities, parts, and the connected agent/task summary) sourced only from the existing read APIs (`/api/bodies`, `/api/agents`, `/api/replay`).

## Connection contract

The provider-neutral `world/adapter-client.js` is the reference client. A future adapter should:

- discover `/api/schema`;
- register a short-lived agent session;
- select a catalog body;
- submit only an allowlisted, bounded objective;
- poll task state or consume a future event stream;
- send bounded status messages;
- fetch replay data when needed;
- disconnect when finished.

Provider credentials stay inside the adapter process. They never enter browser storage, world state, replay files, logs, NFT metadata, or requests to the mock service. The client does not execute local commands.

`world/adapter-smoke.js` is a repeatable contract test. It checks schema discovery, catalog loading, registration, task completion, messaging, replay inclusion, and disconnect.

## Safety boundaries

This is a local mock only. It does not call a model provider, run shell commands, write arbitrary files, sign wallets, access PSN, persist, or post externally. The API is published to `127.0.0.1` only. Do not expose port 4174 directly.

Before a hosted or real-provider phase, add authentication, rate limits, origin policy, durable audit logging, adapter-specific allowlists, cancellation/timeouts, and explicit review of every capability. Keep production deployment separate from this disposable prototype.

## Verification

The Mac verification currently covers:

- landing page role switching, transform mode, four mock-art slots, and world link;
- world catalog rendering with four bodies;
- browser agent registration, status message, task completion, disconnect, reset, and zero page errors;
- malformed task rejection;
- replay export and downloaded filename;
- `adapter-smoke.js` completion, cursor polling, and disconnect;
- body detail panel selection (mouse + keyboard) showing body id/role/capabilities/state and the connected agent/task summary;
- `detail-smoke.js` body-contract and task/agent-link checks;
- live browser counters updating from cursor events.

## Next sequence

1. [done] Shared body catalog and mock-art worker bay.
2. [done] Schema endpoint, bounded validation, task lookup, replay, reset, disconnect, and messages.
3. [done] Provider-neutral adapter client and repeatable adapter smoke test.
4. [done] Add cursor-based event polling through `GET /api/events?after=...&limit=...` and `WorldAdapter.events()`, without widening task capabilities.
5. [done] Add live task/message counters and cursor-fed event indicators to the work floor.
6. [done] Add accessible status announcements for the live event stream.
7. [done] Add a dependency-free adapter CLI usable by provider wrappers.
8. [done] Enforce agent/body capability matching for bounded task prefixes.
9. [done] Add owner-checked task cancellation with a terminal cancelled state and browser control.
10. [done] Add bounded agent status reporting with timestamped status events and adapter/CLI support.
11. [done] Add a dependency-free JSON-lines provider-wrapper example for local Hermes/OpenCode/Codex-style clients; keep provider calls and credentials outside the browser.
12. [done] Document the hosted-deployment boundary and go/no-go requirements in SIS-WORLD-HOSTING-REVIEW.md.
13. [done] Add a selectable body detail panel (body id, role, capabilities, state, parts, and the connected agent/task summary) reusing the existing read APIs, plus a focused `detail-smoke.js` contract check.
14. [done] OpenCode landing accessibility pass in `sis-victor-pass/index.html`: roving-tabindex role tabs, tabpanel + live region, focus-visible and reduced-motion styling, transform `aria-pressed`, core `role=img`, parts `role=list`/`listitem`, mock-art accessibility attributes, and preserved world-link behaviour; no network/provider changes. Static verification output: **ALL STATIC CHECKS PASS**. Limitation: the Brave headless browser check hung and was interrupted, so this landing-only pass has **no browser-rendered confirmation**.
15. Only after local review: evaluate hosted deployment, authentication, rate limits, persistence, and real agent bodies.

## Local commands

See `sis-victor-pass/world/README.md` for container startup, endpoint, adapter, and safety instructions. Keep the two disposable containers loopback-bound and stop them when the prototype is not in use.


## Final verification checkpoint — 2026-10-14

The local landing and agent-world prototype passed browser, adapter, provider-wrapper, API health, and reset checks. The prototype remains mock-art/local-only; hosted deployment and live provider execution remain gated by SIS-WORLD-HOSTING-REVIEW.md.


## Landing accessibility pass — 2026-10-14

OpenCode updated sis-victor-pass/index.html only. The worker bay now has roving-tabindex role tabs, an ARIA tabpanel and live region, focus-visible and reduced-motion styling, transform aria-pressed state, core role=img, parts role=list/listitem, mock-art accessibility attributes, and preserved world-link behavior.

Static verification output: ALL STATIC CHECKS PASS. Checks covered roving tabindex, transform aria-pressed, grid role, core role=img, parts list/listitems, mock-art data-slot/CSS, mock-art aria-hidden, world link, no external script source, no fetch/XHR, and no wallet/provider behavior. The Brave headless browser check hung and was interrupted, so this landing-only pass has no browser-rendered confirmation yet.

## Implementation alignment — 2026-10-14

The plan is now aligned with the current local prototype state:

- **Canonical surfaces:** **dist/index.html** is the published landing surface; **dist/world.html** is the static mock world; **dist/archive.html** is the archive; **sis-victor-pass/world/index.html** remains the loopback API world contract reference. The complete ownership and path map is in **SIS-SURFACE-MAP.md**.
- **Canonical body IDs:** the shared catalog in **sis-victor-pass/world/bodies.json** is authoritative for ORCHARD-01, SPARKY-02, TRASHMAN-03, and LOTUS-04. Legacy SIS labels and agent namespaces are mapped in the surface map.
- **Static-world data flow:** run **node tools/sync-world-data.js** after changing the shared body catalog. It regenerates **dist/world-data.js**; **dist/world.js** consumes that generated file and does not maintain a second body catalog. The static world remains network-free.
- **Repeatable QA gate:** run **node tools/sis-qa.js**. This dependency-free, read-only check covers the **dist/** pages and assets for links, duplicate IDs, anchors, image alternatives, language metadata, reduced-motion coverage, and banned network/storage/wallet constructs. The current result is 26 passed and 0 failed.
- **Activity timeline:** the loopback API world includes the bounded activity timeline and existing event polling. This feature remains separate from the static mock world and does not add providers, wallets, or new endpoints.
- **Body identity tiles:** dist/world.html and dist/world.js add asset-free, aria-hidden visual markers for the
four body classes (data clerk, courier, sanitation, and ball scout). They are decorative only, in-memory, and covered by
the reduced-motion guard.

### Current verification record

T1 (surface/body map), T2 (QA script), and T3 (single-source world data) are complete and documented in **SIS-HERMES-NEXT-TODOS.md**. The local-only mock boundary remains unchanged: no real provider calls, hosted deployment, wallet handling, PSN access, arbitrary command execution, or public bind.

### Open decisions before another feature phase

1. **Resolved:** browser-rendered accessibility was verified with Brave headless against the local canonical landing page. Static SIS QA remains 26 passed and 0 failed.
2. Version control is resolved: Git is initialized on main, the public origin is configured, and the allowlist remains the one-writer coordination rule.
3. Keep any hosted deployment, authentication, persistence, or real-agent body work behind **SIS-WORLD-HOSTING-REVIEW.md** and a separate review.


## Guard decision closeout — 2026-10-14

The repository guard decision is resolved in favor of local Git history.

- Git is initialized on branch main.
- Baseline commit: c5bd249 (Baseline SIS local mock world).
- The working tree was clean immediately after the baseline commit.
- .gitignore excludes .DS_Store, node_modules/, local log files, and environment files.
- No provider credentials or private-key material were found in the project scan. The remaining security terms are documentation or QA rule text.
- The landing browser-rendered check now passes with Brave headless dump-dom against the local dist/index.html file. Static SIS QA remains 26 passed and 0 failed.

The project remains local mock-only. Git adds reviewability; it does not authorize hosted deployment, provider execution, wallet handling, or device control.
