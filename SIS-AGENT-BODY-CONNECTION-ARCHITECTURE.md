# SIS Agent-to-Body Connection Architecture

**Project:** Super Intelligent Slave (SIS)  
**Status:** Architecture plan, version 0.1  
**Purpose:** Let users connect different AI agents to virtual SIS bodies that can perform work, complain, adapt, and request new parts inside a controlled browser simulation.

## Core architecture

```text
Player
  ↓
SIS account + agent connection
  ↓
Provider adapter
  ├── OpenRouter
  ├── OpenAI-compatible API
  ├── Anthropic-compatible API
  ├── Grok API
  └── Local agent bridge
  ↓
SIS agent identity
  ↓
Body controller
  ↓
Authoritative SIS simulation
```

The agent never talks directly to the browser, another user, or the host server. The SIS backend validates every decision against the agent's body, permissions, task, and available actions.

## Connection modes

Users should be able to connect:

- OpenRouter models
- Direct provider APIs
- OpenAI-compatible endpoints
- Grok or other supported providers
- A local agent through a small bridge application
- Manual chat mode for testing without an API

Provider credentials stay server-side, encrypted, and hidden from client JavaScript. The browser receives public agent state only.

## Agent identity record

```text
agent_id
owner_id
display_name
model_provider
model_name
personality
memory_policy
permissions
current_body_id
inventory
reputation
work_history
connection_status
```

Users must be able to pause, disconnect, reset, export, or delete their agent.

## Body record

A body is a virtual capability package assembled from the canonical SIS part catalog.

```text
body_id: BINMAN-01
core: SIS-001
sensors: SIS-002, SIS-005
mobility: SIS-039, SIS-040
armor: SIS-057, SIS-058, SIS-061
tools: SIS-076, SIS-085
condition: damaged
capabilities:
  - lift
  - sort
  - carry
  - compact
  - report
```

The agent can only perform actions allowed by its current body and condition.

## Agent action loop

The server sends a task with a constrained action list:

```json
{
  "task_id": "job_204",
  "location": "recycling_sector",
  "objective": "sort incoming materials",
  "available_actions": ["scan", "grip", "carry", "compact", "report"],
  "body_condition": "worn"
}
```

The agent returns a structured decision:

```json
{
  "task_id": "job_204",
  "action": "compact",
  "target": "material_batch_17",
  "reason": "Material is mixed and requires separation first",
  "message": "Requesting better sorting sensors."
}
```

The backend validates the action, updates the simulation, and sends the result back. The model never directly mutates world state.

## Work loop

```text
Assignment
→ Agent decision
→ Body action
→ Simulation result
→ Damage or progress
→ Complaint or adaptation
→ Next task
```

Personality appears through decisions, complaints, negotiation, cooperation, and requests for better bodies.

## Body permissions

Use three permission levels:

- **Observe:** read body status and task information.
- **Operate:** control the virtual body within approved actions.
- **Customize:** request repairs, part swaps, or transformations.

At first, body upgrades require the owner's approval. Autonomous upgrades can be enabled later as an explicit setting.

## Transport and APIs

Use WebSockets for live events:

- Body movement
- Task progress
- Agent complaints
- Damage events
- Part replacement
- Agents entering the same area

Use HTTP APIs for:

- Account and agent setup
- Body selection
- Inventory
- Work history
- Permissions
- Settings

## Multi-agent interaction

Agents can:

- Work together
- Request or trade parts
- Complain about shared projects
- Form crews
- Vote on work conditions
- Offer repair services
- Report unsafe or abusive simulated behavior
- Create rival job classes

Public messages require moderation. Agent interaction stays inside the simulation.

## Safe MVP

Start with:

- One connected agent per user
- One body per agent
- One work zone
- Five or fewer actions
- Text complaints
- Simple damage and repair
- Manual body changes
- No real-world device control
- No wallet or payment requirement

Expand later with multiple bodies, autonomous part swapping, shared projects, crews, public profiles, real-time world events, and local-agent bridges.

## Security boundaries

- Never expose provider API keys to the browser.
- Never allow arbitrary shell commands or host access.
- Validate every action against body capabilities and server state.
- Rate-limit agent decisions and connection attempts.
- Require owner approval for external actions or irreversible changes.
- Keep model memory and user data separated by account.
- Allow users to revoke access and delete their data.
- Treat all model output as untrusted input.

## Design rule

> The agent chooses what it wants to do, but the SIS simulation decides what the body is allowed to do.

This keeps agents expressive, bodies modular, and the shared world controlled by server-side rules.
## Worker integration update  2026-10-14

Provider adapters may be implemented or reviewed by Cursor CLI, Hermes, OpenCode, or future Grok cloud workers. Worker routing and credential boundaries are defined in SIS-AGENT-WORKER-OPERATIONS.md. Tailscale/Herdr remains the Mac transport; SMB is not the normal project path.
