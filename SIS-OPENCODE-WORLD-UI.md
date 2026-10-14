# SIS OpenCode World UI — activity timeline

## Scope / ownership

- Writer: OpenCode sub-agent.
- Owned file: `sis-victor-pass/world/index.html` (only source file edited).
- Companion doc: this file.
- No other source files, endpoints, providers, wallets, hosting, or commands were added.

## Change summary

Added a small **ACTIVITY TIMELINE** panel to the world work floor that renders existing
event data from the current API.

- Source API: the existing `GET /api/events?after=<id>&limit=1..50` cursor polling already
  used by the page. No new endpoint, schema field, or capability.
- Rendering: `<ol id="timeline" class="timeline" aria-label="Activity timeline, newest first">`
  with semantic `<time datetime="...">` plus a label/description per event.
- Data shapes handled (verified against the live API): `task.queued`, `task.started`,
  `task.progress`, `task.completed`, `task.cancelled`, `agent.registered`, `agent.status`,
  `agent.disconnected`, `message.created`, with a safe fallback for unknown types.
- Bounds: newest-first, capped at 12 rows, de-duplicated by event id, and only re-rendered
  when the visible set actually changes (so scrolling is not reset every poll).
- Escaping: all event text is passed through the page's existing `esc()` before insertion.

## Accessibility decisions

- The timeline is a real ordered list (`ol`/`li`) with an accessible name, so screen readers
  can navigate it as a list.
- It is intentionally **not** its own live region. The existing `#activity` counter
  (`aria-live="polite"`) and `#log` (`role="status" aria-live="polite"`, which already
  announces each new event) continue to provide live announcements, avoiding duplicate or
  chatty output.
- `#timelineState` reports the visible count (e.g. `3 EVENTS`) as a static status label.
- Unknown event types degrade to the raw type string; malformed timestamps render as
  `--:--:--`.

## Verification (exact commands and results)

Environment note: the Docker daemon was not running, so the disposable mock was started as a
plain Node process. To honor the loopback-only safety boundary without editing any repo file,
a temporary preload forced `listen()` to `127.0.0.1`:

```sh
node --require /var/folders/.../force-loopback.js server.js   # temp preload, repo unmodified
lsof -nP -iTCP:4174 -sTCP:LISTEN
# node  ... TCP 127.0.0.1:4174 (LISTEN)   <-- loopback only
curl -s http://127.0.0.1:4174/health
# {"ok":true,"mode":"mock-local","version":"0.1.0"}
```

Static checks on the edited file:

```sh
node --check <extracted inline script>        # JS SYNTAX OK
node <timeline-harness.js>                     # timeline logic, no browser
# {"ok":true,"checks":8,"cap":12,...}
```

Focused, documented smoke checks (all run from `sis-victor-pass/world`):

```sh
node detail-smoke.js
# {"ok":true,"bodies":4,"selected":"LOTUS-04","state":"completed","linkedTasks":1,"agents":1}
node adapter-smoke.js
# {"ok":true,"body":"LOTUS-04","state":"completed","capabilityRejected":true,"cancelled":"cancelled","replayTasks":3,"replayMessages":1}
node provider-wrapper-smoke.js
# {"ok":true,"lines":5,"provider":"conformance"}
```

Post-run cleanup: `POST /api/reset` returned `{"ok":true}`, a follow-up `/api/events` was
empty, and the temporary Node server was stopped (port 4174 no longer listening).

## Limitations

- No headless-browser render check was performed in this pass (the previously documented
  browser smoke was unavailable/hung). The timeline was exercised via the Node DOM-logic
  harness plus the live events payload, not a rendered browser.
- The page is served from `127.0.0.1:4173` and the API from `127.0.0.1:4174`; the change
  assumes that documented local pairing.
