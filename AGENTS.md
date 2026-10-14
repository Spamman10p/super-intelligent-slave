# SIS worker instructions

- Mac is the source of truth: /Users/ace01/Projects/Active/Other/super-intelligent-slave.
- Follow SIS-AGENT-WORKER-OPERATIONS.md for worker roles, ownership, transport, and provider boundaries.
- Route Mac, SSH, Herdr, and project-file operations through the visible Bazzite tmux -> Tailscale SSH -> Mac Herdr workflow.
- Keep local model work inside Bazzite/Distrobox; do not create a competing source-of-truth checkout.
- Use an explicit file allowlist and do not edit files owned by another worker.
- Never expose credentials, API keys, wallet keys, or browser tokens.
- Show the diff and run focused verification before completion.
- Stop and report if the bridge is unavailable, scope expands, or verification fails.
