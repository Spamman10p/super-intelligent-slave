# SIS Codex Archive Notes

Date: 2026-10-14

Codex-owned deliverable: `dist/archive.html`.

The page is a buildless, local-only body archive. It contains four illustrative mock chassis (`SIS-01` through `SIS-04`) with form filters, a selected-body inspector, mock host assignment/release, and inline robot silhouettes. It has no network calls, wallet state, persistence, or backend dependency.

Validation performed on the Mac shell: the file exists at 7,074 bytes and contains all four body IDs. The page remains separate from `dist/index.html` and Hermes's world files.

## Collaboration boundary

Hermes owns `dist/world.html`, `dist/world.css`, `dist/world.js`, and `SIS-HERMES-WORLD-NOTES.md`. Codex owns this archive page and this note. No agent edits the same file concurrently. Landing-page links and any adapter integration are intentionally deferred to a sequential integration pass after both halves are reviewed.

## Canonical ID alignment - 2026-10-14

The archive now displays the canonical body IDs alongside the legacy archive IDs:

- ORCHARD-01 -> SIS-01
- SPARKY-02 -> SIS-02
- TRASHMAN-03 -> SIS-03
- LOTUS-04 -> SIS-04

The archive remains buildless and local-only. This change is presentation and documentation only:
it adds no network, persistence, wallet state, provider behavior, or backend dependency.
