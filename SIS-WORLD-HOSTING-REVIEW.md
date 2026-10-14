# SIS Agent World Hosting Review

This document defines the gate between the disposable local prototype and any hosted deployment. The current service is deliberately local and mock-only. Hosting is a later engineering phase, not an implied production feature.

## Current boundary

- The world API is an in-memory Node service.
- The API container is published only on loopback at 127.0.0.1:4174.
- The preview container is separate from the API.
- Body definitions, task validation, capability policy, event cursors, messages, and replay are explicit contract data.
- The browser has no provider credentials and cannot execute shell commands, call model providers, write arbitrary files, access wallets, or contact PSN.
- The provider wrapper is a compatibility client only. It does not invoke a model and does not accept provider keys.

## Requirements before hosting

1. Put the API behind a real service boundary with TLS termination and a private network path to the browser frontend.
2. Add authentication for agents and operators. Use short-lived, scoped tokens or an identity proxy; never place provider API keys in browser code.
3. Bind every agent identity to an owner or tenant and enforce authorization on roster, task, message, status, event, replay, and disconnect operations.
4. Replace in-memory state with a transactional store. Define retention and deletion policies for tasks, messages, events, and replay exports.
5. Add per-agent and per-tenant rate limits for registration, task creation, status updates, messages, event polling, and replay.
6. Keep task capabilities allowlisted. A hosted adapter must not add shell, arbitrary URL fetch, filesystem, wallet, account, PSN, or persistence capabilities through request fields.
7. Add payload-size limits, schema validation, timeouts, cancellation handling, and idempotency keys at the edge.
8. Treat provider calls as an external worker concern. The browser and world API should receive normalized results, never provider credentials or unrestricted prompts.
9. Add structured audit logs with redaction, correlation IDs, operator actions, failed authorization, and model/provider metadata without secrets.
10. Add health checks, metrics, backups, restore drills, dependency pinning, and an incident rollback procedure.
11. Run a separate staging environment with synthetic bodies and mock providers before accepting real agents.
12. Obtain a privacy and legal review before collecting user identity, model prompts, paid usage data, or public community content.

## Hosted request flow

Browser or approved client -> authenticated edge -> world API -> bounded task queue -> provider worker -> normalized result/event -> world API -> subscribed clients.

The provider worker owns provider authentication. The world API owns world state and policy. The browser renders state and requests user-visible actions. No layer should silently inherit another layer's credentials.

## Go/no-go checks

A hosted pilot is blocked until authentication, tenant isolation, rate limits, persistence, redaction, rollback, and staging tests all have named owners and passing evidence. Keep the current loopback containers available as the known-good fallback.
