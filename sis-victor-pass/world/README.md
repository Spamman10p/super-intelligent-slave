# Agent World mock service

This folder contains the disposable, mock-only world service used by the Super Intelligent Slave prototype.

## Run locally

From the project root on the Mac:

```sh
docker rm -f sis-world-api 2>/dev/null || true
docker run -d --name sis-world-api \
  -p 127.0.0.1:4174:4174 \
  -v "$PWD/sis-victor-pass/world:/app:ro" \
  -w /app node:22-alpine \
  node server.js
```

The landing-page preview is served separately on port 4173. The world page expects the API at `http://127.0.0.1:4174`.

## Contract

The machine-readable contract is [schema.json](./schema.json). The service exposes:

- `GET /health`
- `GET /api/schema`
- `GET /api/bodies`
- `GET /api/agents`
- `GET /api/events?after=<event-id>&limit=1..50` (cursor polling)
- `GET /api/messages`
- `GET /api/replay`
- `GET /api/tasks/:id`
- `POST /api/agents`
- `POST /api/agents/:id/disconnect`
- `POST /api/agents/:id/status`
- `POST /api/messages`
- `POST /api/tasks`
- `POST /api/tasks/:id/cancel`
- `POST /api/reset`

The event endpoint returns the newest events plus `latest` and `nextAfter`; pass the last `latest` value as `after` on the next poll. The browser work floor consumes the same cursor and displays live task/message counters. The provider-neutral [adapter-client.js](./adapter-client.js) demonstrates the intended client boundary. It sends only bounded JSON requests and never accepts, stores, or forwards provider credentials.

## Body detail panel

The work floor lets you select any of the four catalog bodies. Selecting a body opens the **BODY DETAIL**
panel, which shows the body **id**, **role** (`class`), **label**, **state**, its **capabilities** and
**parts**, and a **CONNECTED AGENT / TASK** summary (which agents have run work on that body, the task
count, and the latest objective + status/progress). It reuses the existing read APIs only — `GET
/api/bodies`, `GET /api/agents`, and `GET /api/replay` (tasks joined by `bodyId`/`agentId`) — and adds no
new endpoint, capability, credential, or provider call. Nodes are keyboard-selectable (focus + Enter/Space)
and report `aria-pressed`; the panel re-renders on the live event poll, so the summary tracks new tasks
without a reload.

## Adapter smoke test

With the service running:

```sh
node adapter-smoke.js
```

The test registers a mock agent, discovers the catalog and schema, submits an allowlisted mock task, waits for completion, sends a bounded message, checks replay output, and disconnects. It exits nonzero if any lifecycle step fails.

## Detail panel smoke test

With the service running:

```sh
node detail-smoke.js
```

It checks the data contract the detail panel depends on: every catalog body exposes id/class/label/state/capabilities, a completed task links to its selected body and agent in the replay payload, task ids are unique, and the selected body's state is present after a run. It exits nonzero if any check fails.

## Adapter CLI

`adapter-cli.js` is a dependency-free compatibility client for Hermes, OpenCode, Codex, or a provider wrapper. It uses the same bounded contract:

```sh
node adapter-cli.js schema
node adapter-cli.js bodies
node adapter-cli.js agents
node adapter-cli.js run --body ORCHARD-01 --objective "map mock sector"
node adapter-cli.js message --text "status from agent" --channel work-floor
node adapter-cli.js replay
node adapter-cli.js cancel --task <task-id>
node adapter-cli.js status --state working --note status-update
printf '%s\n' '{"action":"agents"}' '{"action":"disconnect"}' | node provider-wrapper-example.js --provider hermes
node provider-wrapper-smoke.js
```

It has no credential flags, does not execute commands, and disconnects its short-lived session after each action. The provider-wrapper-example.js bridge accepts one JSON action per line for schema, bodies, agents, status, task, message, events, or disconnect. It is a local compatibility boundary for Hermes, OpenCode, Codex, or an external runner; it never accepts provider keys or invokes a model.

## Capability policy

The service maps objective prefixes to capabilities (`map` to `map`, `route` to `route`, and `sort`, `label`, `inspect`, `scan`, `report`, or `mock` to `inspect`). A task is accepted only when both the registered agent and selected body advertise the required capability. A mismatch returns HTTP 403 and creates no task. A registered owner can cancel a non-terminal task through `WorldAdapter.cancelTask()` or the browser cancel control; cancellation is terminal and timers cannot complete it afterward.

## Safety boundary

This is a local prototype. Tasks are simulated; no model provider is called and no command, shell, wallet, filesystem, PSN, or external posting capability is exposed. Do not publish port 4174 directly. A future hosted deployment needs authentication, rate limiting, explicit provider adapters, audit logging, and a separate review before it can leave the local prototype boundary.


## Final verification checkpoint — 2026-10-14

The local landing and agent-world prototype passed browser, adapter, provider-wrapper, API health, and reset checks. The prototype remains mock-art/local-only; hosted deployment and live provider execution remain gated by SIS-WORLD-HOSTING-REVIEW.md.
