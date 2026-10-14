# SIS Agent Worker Operations
Updated 2026-10-14. Mac source of truth: /Users/ace01/Projects/Active/Other/super-intelligent-slave.

## Worker layout
Codex coordinates and reviews. The normal route is Bazzite tmux -> Tailscale SSH -> Mac Herdr.
Cursor CLI runs in the authorized Distrobox account for coding and tests.
Hermes handles research, planning, documentation, and bounded implementation.
OpenCode handles independent implementation or review.
Grok cloud bots are a future layer for approved research, content, and issue triage.

## Credential boundary
Cursor, OpenCode, Hermes, and Grok credentials stay in their own approved environment. Never copy tokens, API keys, browser credentials, Mac SSH keys, wallet keys, or provider secrets into source files or the browser. Grok bots receive no unrestricted Mac filesystem or shell access.

## File ownership
One worker writes a file or feature at a time. Reviewers are read-only unless reassigned. Use branches or worktrees for concurrent work. Every accepted change includes a diff, focused verification, and unresolved-item report. Mac is the project source of truth; Bazzite and Distrobox are worker/model environments, not competing checkouts.

## Cursor rules
The repository should contain AGENTS.md and .cursor/rules/tailscale-workflow.mdc. These rules require Tailscale/Herdr routing for Mac work, assigned-file allowlists, secret protection, diffs before completion, relevant tests, and stopping if the bridge is unavailable.

## Task lifecycle
1. Codex states scope, writer, files, and verification.
2. Worker reads the existing flow.
3. Worker makes the smallest change.
4. Worker runs focused checks.
5. Codex reads the diff and output.
6. Change is accepted, revised, or rejected.
7. Handoff notes are updated when state changes.

The focused check for dist/* static pages is: node tools/sis-qa.js (dependency-free, read-only; exits nonzero on any failure).

## Transport
Do not use SMB as normal project transport. Use the existing visible Tailscale/Herdr route, Git, or controlled SSH transfers. Do not create a second live filesystem authority.

## SIS provider boundary
The browser and mock world never receive provider credentials. Provider adapters stay outside the browser and submit bounded, validated actions to the world API. Validate body capabilities, task prefixes, ownership, rate limits, and cancellation. Adapters may not run arbitrary shell commands or mutate host files.

## Grok cloud setup later
Before enabling a 24/7 cloud bot, document allowed repositories, read/write permissions, approval rules, reporting destination, stop/revoke procedure, and retention. Begin with proposals or controlled adapters, not unrestricted Mac access.

## Next setup
1. Add AGENTS.md and .cursor/rules/tailscale-workflow.mdc.
2. Install and authenticate Cursor CLI in the authorized Distrobox.
3. Run a read-only Cursor inspection through the bridge.
4. Run one small edit with diff and focused check.
5. Reuse existing Hermes and OpenCode panes for review.
6. Add Grok only after access and revocation rules are documented.

Stop if Tailscale/Herdr is unavailable, a worker requests secrets or unrestricted host access, ownership conflicts, verification fails, or scope expands.
