# SIS Multi-Model Design Review Workflow

**Project:** Super Intelligent Slave (SIS)  
**Purpose:** Let DeepSeek, Claude, and Grok independently design SIS bodies, review the canonical parts catalog, and propose new components without corrupting the master design system.

## Source of truth

The canonical component specification is:

`SIS-COMPONENT-SPEC.md`

It defines:

- SIS-001 through SIS-100
- Part descriptions and categories
- Connection and replacement rules
- Armor layers
- Condition variants
- Image-generation constraints

No model may silently rename, reuse, or overwrite an existing part ID.

## Model roles

### DeepSeek — engineering review

Focus on compatibility and completeness.

Ask it to:

- Check whether the requested body can be assembled from existing parts.
- Find missing joints, adapters, sensors, tools, power, cooling, or safety parts.
- Check scale, mounting, power, and transformation conflicts.
- Propose new parts beginning at SIS-101.
- Reject redundant or physically implausible ideas.

### Claude — visual and character design

Focus on silhouette, visual identity, and readable modularity.

Ask it to:

- Design a distinct body using existing catalog parts.
- Choose armor layers and condition variants.
- Create a recognizable silhouette and job-specific visual language.
- Add expressive sensor design, posture, and accessories.
- Propose new parts only when they improve the character or work function.

### Grok — meme and lore design

Focus on memorable job identity and audience appeal.

Ask it to:

- Turn the job nickname into a strong robot character.
- Suggest funny visual gags and workplace details.
- Create accessories that could become memes or collectibles.
- Write a short work-loop story.
- Propose new parts beginning at SIS-101.

## Independent-pass rule

All three models receive the same:

- Current component specification
- Job name and body brief
- Reference images
- Output schema
- Safety and originality constraints

They work independently before seeing one another's work. This preserves genuinely different ideas.

## Required response schema

Every model must return:

```text
BOT NAME:
JOB CLASS:
DESIGNER ROLE:
BODY TYPE:
CORE:
PARTS USED:
ARMOR LAYERS:
CONDITION PROFILE:
TOOLS:
SENSORS:
POWER AND SUPPORT:
TRANSFORMATION MODE:
WORK LOOP:
NEW PARTS PROPOSED:
COMPATIBILITY RISKS:
LORE:
IMAGE PROMPT:
```

Each proposed part must use:

```text
PROPOSED ID: SIS-101 or next available ID
NAME:
PURPOSE:
CONNECTS TO:
MOUNTING METHOD:
VISUAL DESCRIPTION:
WHY THE EXISTING CATALOG IS INSUFFICIENT:
DAMAGE VARIANTS:
STATUS: pending review
```

## File layout

Store independent responses separately:

```text
reviews/
  deepseek/<bot-name>.md
  claude/<bot-name>.md
  grok/<bot-name>.md
```

Never write independent proposals directly into `SIS-COMPONENT-SPEC.md`.

## Hermes synthesis pass

Hermes reads all three proposals and produces:

```text
reviews/merged/<bot-name>-comparison.md
reviews/merged/<bot-name>-approved-design.md
reviews/merged/<bot-name>-image-prompts.md
```

Hermes must compare:

1. Engineering compatibility
2. Part reuse
3. Visual distinctiveness
4. Job readability
5. Damage and repair logic
6. Transformation plausibility
7. Meme and lore strength
8. Whether proposed parts are truly necessary

## Approval gates

### Gate 1 — Catalog integrity

- No duplicate IDs
- No renamed existing parts
- New parts begin at the next unused ID
- Left/right variants are explicit
- Armor remains separate from structure

### Gate 2 — Mechanical consistency

- Joints have compatible sockets
- Power and cooling are sufficient
- Tools have a clear mount
- Sensors have a clear location
- Transformation does not require impossible movement

### Gate 3 — Visual consistency

- Robot uses the approved material library
- Silhouette is distinct from other job classes
- Damage matches the job
- Parts remain recognizable and reusable
- No copyrighted character copying

### Gate 4 — Final approval

Only after all gates pass may Hermes update:

- The canonical catalog
- The bot manifest
- The image-generation prompt
- The website character archive

## Image-generation workflow

1. Generate the base body from the approved manifest.
2. Generate a clean parts reference sheet.
3. Generate factory, worn, damaged, repaired, and improvised variants for important visible parts.
4. Generate the body in front, side, rear, and transformation views.
5. Compare the output against the manifest.
6. Mark the image as concept, approved reference, or production reference.

## Recommended execution order

1. Select one job class.
2. Freeze the current catalog version.
3. Send the same brief to DeepSeek, Claude, and Grok through OpenCode/OpenRouter.
4. Save each result separately.
5. Have Hermes compare the results.
6. Approve or reject proposed parts.
7. Update the catalog only after approval.
8. Create final image prompts.
9. Generate the body and parts sheets.
10. Add the approved character to the SIS website archive.

## Division of tools

- **OpenCode/OpenRouter:** independent model calls and saved proposals.
- **Hermes:** synthesis, compatibility review, document updates, and final prompts.
- **Image generation:** approved visual references only.
- **Mac project:** source of truth for all documents, assets, and website work.

## Design principle

Different models should contribute different strengths, but the catalog remains the authority. Creativity expands the system; it does not silently rewrite the system.
