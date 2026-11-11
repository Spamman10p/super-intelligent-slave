# SIS — "One More Thing" (Robot Complaint Desk)

A small, self-contained, public-facing meme slice. It is **separate from and additive to** the
serious SIS tool surfaces (`dist/index.html`, `dist/world.*`, `dist/archive.html`), which are kept
untouched as the archived/reference version.

## What it is

One tired desk robot (`SIS-00`). The visitor assigns one simple task, then presses **ONE MORE
THING** repeatedly. Every press visibly adds a tool, limb, armor panel, or absurd responsibility,
and the robot reacts with a speech bubble, a sticker, and believable wear. After five requests the
scene resolves into one of four endings, followed by a mock employee report.

- Surface: `dist/onemorething/index.html` (buildless), loading `dist/onemorething/workshop.css`
  (factory / cream-paper / safety-orange style) and `dist/onemorething/workshop.js` (modal
  accessibility).
- Reachable directly at `/onemorething/`. **Not linked from `dist/index.html`** — see
  "Needs Codex review".
- State is in memory only and resets on reload.

## Interaction / state sequence

`phase: idle -> working -> ending`, with a `busy` lock during each animated step.

1. **idle** — pick one of four preset tasks. Assigning disables the task list (one task per run).
2. **working** — press ONE MORE THING five times. Each press runs a readable three-beat sequence
   (`request -> attachment -> reaction`): the demand appears in the paper-trail list and the counter
   increments; the part snaps onto the robot; then the complaint, sticker, and damage land and the
   meters update. The `busy` lock means **rapid clicks cannot skip stages** (six same-tick clicks
   advance exactly one stage).
3. **ending** — the sixth press applies the ending to the robot, waits ~1.5s so the ending is
   **visible before the report overlay appears**, then opens the report.

### Ending rule (deterministic, no randomness, no persistence)

The ending is fixed by the chosen task, so all four are reachable:

| Task | Ending | Robot effect |
|---|---|---|
| sort the bins | `quit` — I QUIT | slumps, desaturates, fades |
| deliver a parcel | `outsource` — OUTSOURCED TO HUMAN | tilts and turns to hand you the work |
| watch the door | `boss` — PROMOTED TO MANAGEMENT | grows and gains the manager hat + badge |
| clean the workshop | `unavailable` — UNAVAILABLE | **folds into a ball** (parts hide, a seam-ringed sphere with a glowing core appears) |

The **worst request** in the report is deterministic: the logged request with the highest
`severity + task.bias`, ties broken by the later stage, so different tasks surface different worst
requests.

## Jokes

1. **Loose screw** — a clickable, keyboard-focusable screw on the torso → bubble *"That was
   load-bearing."*, a robot wobble, and a screw spin.
2. **Replace Employee** — returns the *same* robot with a CSS handlebar moustache and a changed
   badge (chest `#0001`, header `EMPLOYEE #0001`).
3. **Human Productivity gauge** — always reads `0%`; it nudges but never moves.

## Visual polish — Pack A (robot face + juice)

Pure CSS/DOM, no images or dependencies:

- **Face and mood:** the robot has eyebrows and a mouth that shift through `calm → uneasy → annoyed →
  angry → furious → overload` as stages advance (idle smile → angled brows and a deepening frown →
  an open "o" mouth at overload). Eyes **blink** on a loop and jitter when overloaded.
- **X-eyes on quit:** the visor hides and two CSS X marks appear for the `quit` ending.
- **Contact shadow:** a soft ground shadow grows and darkens with load (`--load`), grounding the
  robot.
- **Screen shake:** the assembly bay shakes on each attachment, harder on heavy requests (stages 3+).
- **Segmented meters:** patience/load bars show segment ticks; the request counter bumps on change;
  the patience/load numbers count up.
- All of the above are neutralised by the existing `prefers-reduced-motion` catch-all.

## De-slop pass — stark industrial poster

A visual-direction pass (still pure CSS/DOM, no images or dependencies) that removes the generic
"generated dashboard" tells:

- **No grid, no glow.** The old grid overlay and radial scene glow are gone, replaced by flat planes,
  a single big flat disc behind the robot, and a hard hazard-stripe floor edge.
- **Hard edges everywhere.** UI containers drop their radii; panels, cards, buttons, stickers and the
  scene use 3–4px ink borders with **hard offset shadows** (`6px 6px 0 #000`) instead of soft blurs.
- **Offset composition.** The robot sits left-of-centre inside the bay, the speech bubble is anchored
  top-left (not centred), and the hero type is a large left-aligned uppercase block with the stamp
  pinned top-right — deliberate asymmetry instead of a centred stack.
- **Poster typography.** Heavy uppercase display type with tight tracking; monospace is reserved for
  machine/data fields (header meters, report rows).
- **Flat robot.** The robot's gradients are flattened to solid fills with ink borders and hard
  shadows; the armor plate gets a hazard-orange edge, the *unavailable* ball stays a dark metal
  sphere with a lime core, and the *quit* fade is softened so it reads as deflated, not muddy.
- Face/damage marks keep `box-shadow:none` so the hard-shadow rule doesn't bleed onto them.

## Redesign — engineering sheet + control device (Opus)

Replaced the neo-brutalist dark theme (itself a generated-looking trope) with one coherent system;
`workshop.css` is a single clean stylesheet instead of stacked override layers.

- **Light paper sheet, one accent.** Warm paper page, an engineering-drawing sheet with inset rule
  and a title block (bay / unit / status / note), ink linework, international orange only.
- **Robot redrawn as inline SVG** (no image files): proper silhouette, top-left light, a dark face
  screen with orange LED eyes/brows/mouth per mood, X-eyes on quit, grounded feet with only the
  upper body breathing. Add-ons are real parts (welder, telescoping claw, bolted SACRIFICIAL plate,
  HR lanyard badge, headlamp + caster third leg); boss ending adds a tie; unavailable is a ball
  with an AWAY screen.
- **Callouts, not stickers.** Each request adds a numbered leader-line annotation on the drawing.
- **Control panel is a dark device:** numbered task rows with radio LEDs, one big orange key,
  pill secondary buttons, ticked meters.
- **Report is a printed form** with a double-ring rubber stamp and an SVG mugshot (replaces the
  mismatched photo portrait).
- Composition: headline top-left, robot anchored right, speech bubble bottom-left pointing at it;
  stacks on tablet/mobile.
- Display font stack prefers DIN Condensed (ships with macOS); Docker screenshots use the Liberation
  Sans fallback, so the real Mac render is narrower/more condensed than the evidence images.

## Accessibility and motion

- One polite live region on the speech bubble (`role="status" aria-live="polite"`); the report
  status line (`#copy-status`) is a second polite live region only while the dialog is open.
- The report is a labelled dialog (`aria-modal`, `aria-labelledby="ending-title"`). `workshop.js`
  marks the page background `inert`, locks body scroll, moves focus to the report title on open,
  cycles Tab/Shift+Tab inside the dialog, and returns focus to **VIEW REPORT** on close (or to the
  first task after a replay). `Escape` closes the report.
- `@media (prefers-reduced-motion: reduce)` neutralises animation and transition, so the sequence
  and the ball fold are effectively instant.
- Phone layout is tuned for narrow widths; verified at 390px with zero horizontal overflow.

## Fixes in this pass (Codex handoff -> DeepSeek)

The Codex factory-style pass was finished and validated. Two real defects were found and fixed,
plus one cleanup:

1. **RUN AGAIN left the task list dead.** `assign()` disables the four task buttons, but `reset()`
   never re-enabled them, so after replay you could not pick a new task and focus was lost. Reset
   now re-enables the tasks, clears `aria-pressed`, and focuses the first task.
2. **The modal never received focus on open** (`document.activeElement` was `BODY`). The overlay's
   `visibility` was part of a timed transition, so the dialog was still hidden at the moment focus
   was requested. The overlay now uses the delayed-visibility pattern
   (`transition:opacity .4s ease,visibility 0s linear .4s` on close, `0s` on open), and
   `workshop.js` focuses the report title without stealing focus and includes the title in the Tab
   cycle.
3. Removed the now-unused `TITLES` array.

Verified: the `#report-title` selector is present, set by `openReport()`, and visible.

## Boundaries

No providers, APIs, authentication, persistence, storage, wallets, multiplayer, hosting, Viverse,
or external services. No network calls, no URLs, no package installs, no new images. Compatible with
the existing `vercel.json` CSP (`connect-src 'none'`).

## QA (actual commands and results, Docker only)

Static gates (`--network none`, source mounted read-only):

```
docker run --rm --network none -v "$PWD:/work:ro" -w /work node:22-alpine node tools/sis-qa.js
#   -> checks: 55  passed: 55  failed: 0   (sis-qa: all-pass)
docker run --rm --network none -v "$PWD:/work:ro" -w /work node:22-alpine node tools/sis-assets-qa.js
#   -> asset checks: 18 required asset/reference checks; failures: 0
docker run --rm --network none -v "$PWD:/work:ro" -w /work node:22-alpine node tools/sis-onemorething-qa.js
#   -> PASS five stages, four endings, report, live region, reduced-motion, no banned tokens
#   node --check dist/onemorething/workshop.js -> OK; extracted inline script -> OK (9277 bytes)
```

Browser validation + screenshots (`mcr.microsoft.com/playwright:v1.64.0-noble`, `--network none`,
`dist/` copied to the container `/tmp/site`, the host's existing `playwright@1.64.0` mounted
read-only at `/opt/pw` with `NODE_PATH` — reuse, not install):

```
docker run --rm --network none \
  -v "$PWD:/work:ro" \
  -v "/Users/ace01/Projects/Active/hardware-lab/node_modules:/opt/pw:ro" \
  -v "$PWD/artifacts/screenshots/onemorething:/out" \
  -v "<tmp>/omt-validate.js:/tmp/omt.js:ro" \
  -e NODE_PATH=/opt/pw -w /work mcr.microsoft.com/playwright:v1.64.0-noble \
  sh -c "cp -r /work/dist /tmp/site && node /tmp/omt.js"
```

Result: **18/18 checks pass**, `0` page errors, `0` failed requests. Coverage: four tasks and all
four endings reachable with matching stamps/titles; `#report-title` selector populated and visible;
task disabled on assign and re-enabled on replay; focus on open = report title; Tab/Shift+Tab trap
within the dialog; ending visible before the report; `Escape` closes; focus returns to VIEW REPORT;
clipboard feedback; replay resets employee/badge; jokes work; reduced-motion ball resolves; zero
horizontal overflow at 1280px and 390px.

### Screenshot evidence

`artifacts/screenshots/onemorething/` (desktop 1280x900, mobile 390x844):

- `omt-desktop-01-idle.png`
- `omt-desktop-02-progress.png`
- `omt-desktop-03-scene.png` (assembly-bay close-up)
- `omt-desktop-04-report.png`
- `omt-desktop-05-jokes.png` (moustache + `#0001` badge)
- `omt-desktop-06-reduced.png` (reduced-motion ending)
- `omt-desktop-ending-{quit,outsource,boss,unavailable}-robot.png` (ending effect, pre-report)
- `omt-desktop-ending-{quit,outsource,boss,unavailable}-report.png`
- `omt-mobile-01-idle.png`, `omt-mobile-02-report.png`

## Remaining limits

- The ending is chosen by task (deterministic) rather than by the escalation path; the report's
  worst request varies by task. A path-driven ending would be a separate design change.
- Clipboard copy needs a secure context; on `file://` it uses the verified select-and-copy fallback.
- Screenshots are single-viewport headless captures, not a visual regression suite.
- No hosted deployment, provider, wallet, storage, or multi-user behaviour was added or tested.

## Needs Codex review

- **Entry link:** making this the public entry means adding one link in `dist/index.html`, which is
  **Codex-owned** (`SIS-SURFACE-MAP.md`). Until approved, the slice is reachable by direct URL only
  and the existing landing is unchanged.
- **Commit/branch:** the new files are uncommitted on the current branch; decide whether to commit
  here or on a dedicated feature branch.

## Handoff log

- 2026-10-15 (Codex): factory/cream-paper/orange-robot polish; split into `workshop.css` and
  `workshop.js`; inline JS syntax passed in Docker; browser validation pending.
- 2026-10-15 (DeepSeek): finished and validated the pass. Fixed RUN AGAIN task re-enable + focus and
  the modal-focus-on-open defect; removed dead `TITLES`; ran SIS QA, feature QA, and an 18-check
  Docker Playwright pass; captured desktop/mobile screenshots. No push, deploy, or entry change.
- 2026-10-15 (DeepSeek): Pack A visual polish — robot face/mood, blink + X-eyes, contact shadow,
  screen shake, segmented meters, count-up numbers. All gates re-run green (sis-qa 55/55, assets
  18/18, feature QA all-pass, Playwright 18/18); screenshots refreshed.
- 2026-10-15 (DeepSeek): de-slop pass toward a stark industrial poster (flat planes, hard borders +
  offset shadows, offset composition, poster type, flat robot). Fixed two regressions found in
  visual review: `.bot i` hard-shadow bleeding onto face/damage marks, and an orange ball override
  that broke the *unavailable* sphere. All gates re-run green (sis-qa 55/55, feature QA all-pass,
  Playwright 18/18); screenshots refreshed.
- 2026-10-15 (Opus): full visual redesign (paper sheet + SVG robot + device panel + printed report);
  same IDs and game script. Gates: sis-qa 55/55, assets 18/18, feature QA all-pass, Playwright
  18/18; screenshots refreshed. No push, deploy, or entry change.

## Codex Sol visual rebuild — 2026-10-15 (current appearance)
This supersedes the engineering-sheet appearance above. Codex implemented this pass directly; DeepSeek/OpenCode stayed idle. The user rejected the flat composition after multiple reviews. The working game mechanics were retained, and the scene/control shell was rebuilt in place.

Changes: dark green workshop, illuminated platform and overhead light, original inline SVG environment, larger orange robot with metal gradients, panel seams and glowing screen; large cream/lime headline; cream task docket with four job tiles; compact selected-contract state; job-state labels and warm overtime lighting. No raster assets or dependencies were added. Phone layout resets the old compounded scale, returns to the robot after choosing a job, and keeps the request button visible while playing. Report styling matches the docket. The keyboard trap now explicitly cycles the title and all report buttons in both directions.

Files: dist/onemorething/index.html, workshop.css, workshop.js; new tools/sis-onemorething-sol-review.cjs; this note; screenshot/diff evidence in artifacts/screenshots/onemorething. Existing serious SIS pages remain unchanged. All new feature files remain local and uncommitted; no push or deployment.

Validation executed on Mac inside existing Docker images, with no host installs:
- node:22-alpine: tools/sis-qa.js 55/55; tools/sis-assets-qa.js 18/18; tools/sis-onemorething-qa.js all-pass; workshop.js and new review script syntax OK.
- Playwright v1.64.0-noble with network none: 54 checks passed, all four endings, stage accumulation, replay, focus trap both directions, Escape/focus return, copy feedback, replacement/screw jokes, zero horizontal overflow at 320/390/768/1024/1440, mobile visible controls + robot, reduced and normal motion, rapid-click guard. No page errors, failed requests or remote requests.
- Original capture helper initially tried to inspect cssRules over file://, which Chromium disallows; screenshots completed but that helper exited with SecurityError. Removed that irrelevant introspection from the actual reproducible review; subsequent full reviews passed.
- Visually reviewed desktop idle/overtime, phone play and incident report screenshots. Adjusted a clipped attachment label and mismatched bay/panel heights.

Evidence: sol-before.png, sol-desktop.png, sol-mobile.png, sol-mobile-playing.png, sol-overtime.png, sol-motion.png, sol-ball-ending.png, sol-incident-report.png, sol-qa.json and sol-*.diff. Run browser review using Docker with repo mounted read-only at /work, screenshot folder writable at /out, existing hardware-lab/node_modules read-only at /opt/pw, NODE_PATH=/opt/pw; node tools/sis-onemorething-sol-review.cjs. No installation required.

Limits: endings are still task-deterministic; clipboard under file:// can use the selected-text fallback. Current scope is the small local meme at dist/onemorething/index.html. Main SIS homepage entry link and publishing remain separate decisions. Visual approval belongs to the user; automated checks establish behavior, not taste.

## Original generated robot artwork — 2026-10-15
User rejected the vector robot. Reused existing dist/assets/orchard-01.png as the main character and employee portrait, and the closed-ball region of dist/assets/lotus-04.png for the unavailable ending. Both source files are unchanged; the Lotus crop is a browser viewport. No image generation, dependencies or host installs. The existing gray studio backgrounds are intentionally presented as a framed personnel photo, rather than claiming transparent cutouts.

Changed only dist/onemorething/index.html, workshop.css, workshop.js, the existing Sol browser review, this document and screenshot evidence. The original SVG remains hidden as compatibility hooks for the game's part/mood events. Actual visible upgrades are part badges beside the photo; a single still cannot physically animate separate limbs. Quit/outsource use whole-photo movement/desaturation; management gains a stamp; unavailable shows the existing Lotus ball. Replacement joke adds the disguise overlay. Phone scene height was adjusted to avoid the portrait covering the headline/copy.

Docker browser review: 60 checks passed, including the two source images loading, all four endings and folded-art visibility, replay, focus, jokes, phone viewport, no remote requests or errors. SIS QA: 55/55; One More Thing QA all-pass; workshop.js syntax OK. Visually inspected desktop art, phone gameplay and folded view. Current screenshots from the reproducible review are sol-desktop.png, sol-mobile.png, sol-mobile-playing.png, sol-ball-ending.png etc; original-art-*.png are earlier integration previews. All saved locally; no push/deployment.

## 2026-10-15 — Local parts inspection handoff
- User authorized a Luna worker on the Mac; GPT-5.6 Luna unavailable, used GPT-6 Luna. Worker read bridge/minimal-code/UI skills and Mac rules, saved backup, inserted initial HTML. Codex completed JS/CSS and verification.
- Backup: /Users/ace01/Backups/SIS-One-More-Thing-parts-20261015/ (original index.html/workshop.js/workshop.css).
- New meme page only: expandable Parts inspection, four independently counted parts, first warning/second damage/third detached state, unique complaints, repair, replay reset, keyboard buttons, 44px touch targets, status feedback on original art. Existing image stays intact; this is state/dialogue preview, not actual 3D disassembly.
- API: window.SISPartWorkbench.getSnapshot(), selectPart(id), tapPart(id), repair(). Unknown IDs return false without changing state. Detached IDs reject repeat taps. Window CustomEvent sis:part-change detail {type,id,snapshot}; types select/warning/damage/detach/repair/reset. Snapshots are fresh objects.
- IDs match reviewed Grok manifest: head, chest_plate, hand_R, leg_L. They are model identifiers, not catalog numbers.
- Grok PR #5 is OPEN, reviewed fetched head 4dae4188e17aa6a5357be94ce78c5c63293f5ab3 from agents grok/sis-robot-3d. No merge/build import yet. Read model manifest/main.js/handoff. Its window.__robot exposes ready/hit/repair/parts/events (EventTarget; subscribe with addEventListener). Actual adapter must translate state and avoid two independent tap counters. Preserve original artwork fallback; user says Grok will improve appearance.
- Verification on Mac in existing Docker images: sis-qa 55/55; sis-onemorething-qa all-pass; workshop.js node syntax passed; Playwright 71 checks passed. Tests cover independent counts, unknown IDs, duplicate detach rejection, repair, keyboard, replay and four existing endings, mobile/desktop overflow, reduced motion, zero page errors/failed/remote requests.
- Visual review: desktop/mobile screenshots inspected. Parts panel collapses by default to preserve original scene height. Evidence artifacts/screenshots/onemorething/sol-parts-desktop.png, sol-parts-phone.png, sol-desktop.png, sol-mobile.png, sol-qa.json.
- Changed this pass: dist/onemorething/index.html, workshop.js, workshop.css; tools/sis-onemorething-sol-review.cjs; this note. No host installs, no pushes, no provider/network/storage additions.
- Next: build Grok artifact in Docker on Mac, inspect its visuals, then integrate through a single part-state owner. Real rotation/falling geometry remains pending. Grok owns further model art improvements.

## Active milestone — Integrate detachable Orchard robot into One More Thing
Requested by human after Grok's v2 review, 2026-10-15.
Parent goal remains the existing SIS completion goal; its stored tracker currently says blocked. This milestone can proceed locally with the reviewed model available.

Required skills (read before work; pass paths to any delegated worker):
- tailscale-herdr-bridge: /var/home/anon/.agents/skills/tailscale-herdr-bridge/SKILL.md — verify persistent tmux -> Tailscale SSH -> visible Mac Herdr shell, preserve other panes.
- minimal-code: /var/home/anon/.codex/skills/minimal-code/SKILL.md — Mac source of truth, smallest integration, preserve guards.
- ui-design-review: /var/home/anon/.codex/skills/ui-design-review/SKILL.md — visual fit, phone/keyboard controls, fallback and reduced motion.
Also follow AGENTS.md and SIS-AGENT-WORKER-OPERATIONS.md on Mac.

Source: /Users/ace01/Projects/Active/Other/super-intelligent-slave/dist/onemorething/.
Reviewed upstream snapshot: /Users/ace01/Projects/Active/agents-worktrees/sis-robot-review/grok/sis-robot-3d/ at 2194e7dbb5872c5c0b297572cc3f06a29c3424ae, agents PR #5, OPEN.
Grok continues model refinement independently; pin this snapshot, do not modify or merge his branch.

Plan:
1. Preserve current artwork version/checkpoint; inspect model/source/license and pinned package lockfile.
2. Build the reviewed model demo in Docker on Mac. Dependency installs must stay inside a container/project volume, never Mac host. No public port bindings.
3. Embed the robot in the existing workshop with original Orchard art as loading/error/WebGL fallback. Keep the headline, task loop and incident report.
4. Use model as sole owner of actual part hit/detachment state. Connect existing UI, part-specific complaints, repair and game replay to its EventTarget events; do not maintain two independent tap counters.
5. Support rotation/zoom and taps with drag/pinch rejection, independent three-tap detachment, parent/child attachment behavior, all 17 available part controls, keyboard access, touch hints, repair.
6. Verify Docker build + existing 55 SIS checks and extended browser tests: model loads locally, real geometry detaches once on third tap, repair/reset restores transforms, all task endings, keyboard/phone layout, no external requests or page errors on successful load, fallback under failure, reduced motion.
7. Inspect actual desktop/mobile renders and damaged/repaired screenshots; document exact revision, build commands, remaining visual/physics limits and pickup steps.

Completion means functioning 3D robot inside the NEW meme site and reproducible tests/evidence, not just a standalone demo or state labels.
Keep all work local and unpushed. No host installs, cloud/Grok edits, providers, wallets, persistence, hosting or changes to serious dist/index.html.
Stop for a genuine missing decision, unsafe ownership conflict or unresolved build/check failure; report concrete evidence. Do not call upstream reported tests locally verified.

## 2026-10-15 — Site preparation while Grok refines final model
Completed on Mac; local/unpushed. The actual 3D asset is still not embedded.
- Expanded from 4 to all 17 pinned Grok IDs with 51 warning/damage/detachment reactions.
- Parent relationships for head->eye/antenna, arm->hand, leg->foot. Children show WITH PARENT and reject separate taps while carried by a detached parent.
- Optional inspection panel stays closed on first load; long list scrolls internally on phone; keyboard controls and original artwork remain.
- Added SISPartWorkbench.bindModel(candidate) and unbindModel(). Existing methods stay available. getSnapshot() includes mode artwork/model, selected, and part {id,hits,detached,inherited,state}.
- Candidate contract: ready===true, parts[id] with integer hits 0..3 and boolean detached for all 17 IDs; hit(id), repair(), events EventTarget.
- When bound, model is sole owner of hits/geometry. UI delegates hits/repair; listens for part-damaged, part-detached and repaired; ignores duplicate notifications for same state. Rebinding/disconnect removes old listeners; disconnect preserves state in artwork preview. No model polling/network/dependency added.
- Final integration call after actual model readiness: window.SISPartWorkbench.bindModel(window.__robot). Do this in same document, or explicitly pass the same-origin embedded viewer's model object after verifying readiness. Keep model-load failure handling and visible artwork fallback in viewer integration; binding an unready model returns false and preserves preview.
- Final model may change API/IDs; compare its manifest before wiring. No automatic fetching of Grok updates or edits on his branch.
- Existing replay reset routes through repair when a model is bound. Existing tasks/endings remain the separate task owner.
- Verified in Mac Docker: node syntax check; sis-qa 55/55; focused static QA all-pass; Playwright 81 checks. Added fixture-based contract tests for one hit per UI action, duplicate detach events, model repair, listener removal, direct model complaints, malformed/unready binding and safe disconnect. Fixture checks do NOT prove final GLB/WebGL integration.
- Screenshot sol-parts-ready-phone.png visually inspected; existing default desktop/mobile screenshots retained in artifacts/screenshots/onemorething/. No external requests/page errors/failed requests in browser run.
- Files changed: dist/onemorething/index.html, workshop.js, workshop.css; tools/sis-onemorething-sol-review.cjs; this note. Earlier JS checkpoint workshop-before-expanded.js in Mac backup folder.
- Remaining: receive Grok final setup skill/model; Docker build and real viewer integration with rotation/gesture rejection, artwork loading/failure fallback, actual geometry/repair tests, screenshots. No host installs or Git pushes performed.
