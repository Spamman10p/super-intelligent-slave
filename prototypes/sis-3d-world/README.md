# SIS 3D world prototype

A dependency-free CSS perspective scene for validating SIS rooms, residents, robot parts, speech bubbles, and local work loops. It does not modify or import the existing `dist/` site. State resets on reload.

Run in Docker:

```sh
docker run --rm --network none -v "$PWD:/work:ro" -w /work node:22-alpine node prototypes/sis-3d-world/qa.js
```

This phase has no network, provider, wallet, authentication, persistence, analytics, or public bind. The future Viverse renderer can reuse this data and interaction contract after its pinned timeline dependency is available in a disposable build.
