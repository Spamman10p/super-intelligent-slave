# SIS 3D World Prototype Plan

Updated 2026-10-14. This plan is intentionally separate from the existing static SIS site.

## Decision

Use `@react-three/viverse` as the first prototype foundation, with React Three Fiber and Drei. It is MIT licensed, exposes a `<SimpleCharacter />`, `<Viverse />`, `<BvhPhysicsBody />`, and `<PrototypeBox />), and produces a static Vite build. Keep the fallback of plain R3F + `ecctrl` available if the viverse package becomes a maintenance or integration problem.

## Reproducibility evidence

A disposable project was created at `/tmp/sis-3d-foundation-check/app` on the Mac. The live SIS repository was not changed.

Environment:

- Node 22.23.1
- npm 10.9.8
- Vite 8.3.4
- React 19.3.1
- three 0.186.1
- @react-three/fiber 9.8.2
- @react-three/drei 10.7.9
- @react-three/viverse 0.2.29

The package's documented sample was compiled with `Viverse`, `Sky`, `SimpleCharacter`, `BvhPhysicsBody`, and `PrototypeBox`.

Important compatibility finding:

- A normal install selected `@react-three/timeline 0.3.10`.
- `npm run build` then failed because viverse 0.2.29 imports the misspelled export `GrapthState`, which is absent from timeline 0.3.10.
- Pinning `@react-three/timeline@0.3.7` with `npm install @react-three/timeline@0.3.7 --save-exact` fixed the mismatch.
- The same sample then passed `npm run build`.
- The successful build emitted the default mannequin, walk/jump animation, prototype texture, and Draco assets. Vite warned about a large JavaScript chunk; this is a performance follow-up, not a build failure.
- npm reported zero vulnerabilities in the disposable install.

The prototype must keep the timeline pin exact until a newer viverse release removes this mismatch. Re-test before upgrading.

## License and asset boundary

The viverse package is MIT code. Its README credits the default model and animations to Quaternius, prototype texture to Kenney, and other libraries including three-vrm and three-mesh-bvh. Code licensing does not automatically grant rights to every bundled asset.

For SIS:

- Keep code attribution and license notices.
- Use SIS-owned or separately verified CC0/commercial assets for the worksite and robot bodies.
- Record each imported model, texture, font, and audio source in the SIS art manifest before publication.
- Do not copy proprietary VIVERSE account, publishing, analytics, or identity integrations.

## Isolated prototype layout

Create a separate project or branch, for example:

`prototypes/sis-viverse-world/`

It should have its own package lockfile and build output. Do not merge it into `dist/` or replace the existing landing page until the prototype has its own acceptance checks.

Suggested modules:

- `src/world/Worksite.tsx`: local mock geometry and camera.
- `src/agents/agents.json`: mock agent IDs, bodies, parts, loops, complaints, and status.
- `src/agents/MockAgent.tsx`: waypoint movement and work-loop state machine.
- `src/robots/RobotBody.tsx`: named attachment points for head, torso armor, arms, hands, legs, feet, joints, and accessories.
- `src/robots/parts.ts`: validated part catalog and safe swaps.
- `src/ui/StatusBubble.tsx`: local complaint/status bubbles.
- `src/ui/WorksitePanel.tsx`: local status and selected-agent panel.

## Prototype phases

1. **Foundation:** reproduce the pinned sample in the isolated project and retain the lockfile.
2. **Mock worksite:** replace the prototype box with primitive worksite zones and no external assets.
3. **Mock agents:** add three to five local agents with deterministic loops and speech bubbles.
4. **Robot parts:** load placeholder meshes and swap named body attachments; add a reversible transform tween.
5. **SIS art:** replace placeholders with only assets whose provenance is recorded.
6. **Static gate:** build to a separate output directory, run a local smoke test, and confirm no network, wallet, auth, provider, or persistence calls.
7. **Integration review:** only after those checks pass, decide whether to link the world from the existing SIS landing page.

## Explicit non-goals for v1

No multiplayer, database, wallet, token gating, live LLM calls, provider credentials, PSN/device control, private-key collection, analytics, public server bind, or VIVERSE account integration.

## Current status

Foundation is reproducibly buildable with the exact timeline pin. The isolated SIS prototype has not been created yet. The next implementation task is Phase 1 in a separate project or branch.
