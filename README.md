# Super Intelligent Slave (SIS)

SIS is a fictional, satirical AI-labor world prototype.

The current repository contains a local mock landing page, a local mock agent world, canonical body data, research and architecture notes, and dependency-free verification tools. It does not connect to model providers, wallets, PSN, hosted services, or external devices.

## Current local checks

From the project root:

    node tools/sis-qa.js
    node tools/sis-assets-qa.js
    node --check tools/sync-world-data.js
    node --check dist/world-data.js
    node --check dist/world.js

The static QA gate checks links, duplicate IDs, accessibility metadata, reduced-motion coverage, and banned network/storage/wallet constructs. The asset gate verifies every canonical body image and every Design Library sheet exists and is referenced by the landing page.

## Project map

- dist/ — published static landing, archive, and mock world surfaces
- sis-victor-pass/world/ — loopback mock API world and adapter contract
- tools/ — world-data generator and static QA
- SIS-SURFACE-MAP.md — canonical surfaces, bodies, and ownership
- SIS-AGENT-WORLD-BUILD-PLAN.md — architecture and phased plan
- SIS-WORLD-HOSTING-REVIEW.md — requirements before any hosted or real-provider phase
- SIS-STATIC-DEPLOYMENT.md — Vercel and static-host deployment steps and boundaries
- SIS-MAC-HANDOFF-2026-10-14.md — current stop point and next-session plan

All art is currently mock/local material. Hosted deployment, real provider execution, authentication, persistence, wallet features, and device control require a separate review.
