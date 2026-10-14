# PS5 Jailbreak Scene Research — 2026-10-14

## Purpose

This note records the useful high-level findings from Grok's current jailbreak-scene digest. It is a research reference for project planning and scene awareness. It does not contain exploit offsets, payload construction, kernel interfaces, console execution steps, or instructions for bypassing platform security.

## Current scene map

### Relapse

Public discussion describes Relapse as a PS5 jailbreak project covering firmware ranges approximately from 7.00 through 13.60, with reports spanning multiple console models. The digest did not verify every firmware/model combination from primary project documentation. Firmware 14.x coverage remains unconfirmed.

Source: [GBAtemp Relapse overview](https://gbatemp.net/threads/relapse-ps5-kernel-exploit-brings-homebrew-to-firmware-7-00-13-60.684829/)

### AnchorPS5

AnchorPS5 is presented as a catalog/discovery layer for PS5 homebrew projects. It is useful for finding related tools and repositories, but its listings should be treated as an index rather than proof that a project is maintained or safe.

Source: [GBAtemp AnchorPS5 overview](https://gbatemp.net/threads/anchorps5-browse-download-and-update-ps5-homebrew-from-your-pc.684934/)

### ETA, Onion, HyperHEN, and related HEN projects

These projects represent different HEN/payload ecosystems and interfaces. They should be compared as separate implementations with their own firmware assumptions, dependencies, menus, and payload boundaries. The digest does not establish that their internals are interchangeable.

For our documentation, the useful distinction is:

- jailbreak entry or exploit layer;
- HEN/runtime layer;
- payload and homebrew delivery;
- optional services such as FTP or networking;
- user interface and project packaging.

This separation helps the SIS project avoid treating every scene feature as one universal component.

### PS5 Linux work

The scene also contains Linux loaders and Linux-focused projects aimed at older firmware bands. These are separate from newer HEN coverage and should not be assumed to work on the same firmware versions.

The research supports tracking Linux support as a compatibility matrix rather than as a single feature flag.

### Local AI and PS5LM/GPU reports

A report described a jailbroken PS5 running a roughly 27-billion-parameter language model at around 20 tokens per second. This is a news item and performance claim, not a verified SIS dependency or benchmark. It is relevant to the SIS lore and future research about constrained local agents, but it does not change the current mock-local architecture.

Source: [Startup Fortune report](https://startupfortune.com/a-jailbroken-playstation-5-is-now-running-a-27-billion-parameter-ai-model/)

### Emulation projects

The digest mentioned Porpoise, PS5CEMU-HAR, KytyPS5, and Prosperity as scene projects. These names are useful for cataloging the ecosystem, but the research did not verify compatibility, maintenance, or safety. They are not SIS dependencies.

### Networking and Tailscale references

Tailscale for PS5 appears in public project listings, including AnchorPS5-related catalogs. The digest did not establish a complete deployment path or current compatibility. SIS should continue using its existing Mac/Tailscale development bridge and keep any future device networking as a separate, explicitly reviewed project.

### Firmware and PSN status

Community reporting indicates pressure to update to newer firmware, including discussion around PSN access and 14.10. These reports change quickly and are not a basis for implementation decisions. Treat firmware, PSN, and account-status claims as time-sensitive until verified through authoritative sources.

Source: [Macrike PSN/14.10 discussion](https://x.com/Macrike/status/2110294364333195455)

## What this adds to current SIS work

1. **Documentation structure:** Keep jailbreak entry, HEN/runtime, payload delivery, optional services, and UI as separate layers in future architecture notes.
2. **Compatibility tracking:** Record firmware/model support per project instead of using a single “PS5 jailbreak supported” label.
3. **World/lore references:** Linux loaders, local AI experiments, robotics, and networked agents can inform SIS fiction and mock-world content without being treated as implementation requirements.
4. **Research queue:** Use AnchorPS5 and project indexes to discover candidates, then verify each candidate from its own repository and release notes.
5. **Boundary preservation:** The current SIS site remains mock-local. No provider, wallet, device, PSN, hosting, or console-control integration follows from this research.

## Confirmed, inferred, and unknown

### Confirmed from the collected notes

- The scene contains multiple HEN projects with different scopes and interfaces.
- Relapse, AnchorPS5, PS5 Linux work, local-AI-on-PS5 reports, emulation projects, and networking references are distinct research categories.
- The current SIS architecture does not depend on any of them.

### Inferences

- A future all-in-one design would need explicit adapters and compatibility metadata rather than a single monolithic payload.
- Scene indexes are valuable for discovery but insufficient for trust or maintenance decisions.
- Local AI and robotics references are more immediately useful to SIS lore than to the current web implementation.

### Still unknown

- Exact support matrices for every HEN variant.
- Which repositories are actively maintained.
- Whether private or unreleased firmware work exists.
- Reliable current compatibility for PS5 networking, Linux, emulation, or local-AI projects.
- Legal, platform, and account implications of any future device-facing work.

## Scope and status

This is a dated research snapshot from 2026-10-14. It is informational only. No code, payload, device configuration, or SIS runtime behavior was changed.
