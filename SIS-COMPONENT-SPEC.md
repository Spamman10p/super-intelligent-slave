# SIS Component, Armor, and Damage Specification

**Project:** Super Intelligent Slave (SIS)  
**Status:** Canonical design specification, version 0.1  
**Purpose:** Give every robot part a stable identity so future artwork, bodies, accessories, transformations, and collectibles can reuse the same components.

## Core rule

Every SIS robot is assembled from numbered, replaceable components. A robot's identity comes from its intelligence core, job history, body configuration, and condition profile. Armor is equipment and can be removed, replaced, damaged, repaired, or improvised.

The earlier two-digit concept sheets are visual references only. The canonical catalog uses **SIS-001 through SIS-100**. New components continue at SIS-101 and above. Never reuse an ID for a different part.

## Part record

Every component should eventually have a record with:

- `part_id` — stable ID, for example `SIS-045`
- `name` — short canonical name
- `category` — sensor, chassis, joint, limb, armor, tool, power, transformation, or support
- `side` — center, left, right, paired, or universal
- `function` — what the part does
- `interfaces` — what it connects to
- `mounting` — bolts, rail, socket, ring, hinge, magnetic, or quick-release
- `materials` — visual material family and finish
- `replaceability` — permanent, replaceable, disposable, or emergency-only
- `armor_layers` — which covers can be placed over it
- `damage_points` — believable ways it can fail
- `transformation_role` — whether it folds, stores, becomes shell, wheel, brace, or ballast
- `image_status` — concept, approved reference, or production reference

## Canonical catalog ranges

### SIS-001–010 — Intelligence and sensors

001 intelligence core; 002 primary camera; 003 wide camera; 004 depth sensor; 005 microphone array; 006 speaker module; 007 scanner; 008 antenna; 009 core docking ring; 010 diagnostic/status light.

### SIS-011–020 — Chassis and structural frames

011 neck mount; 012 head frame; 013 torso frame; 014 chest power bus; 015 abdomen frame; 016 back mounting rail; 017 hip frame; 018 left shoulder mount; 019 right shoulder mount; 020 emergency release frame.

### SIS-021–030 — Joints

021 neck rotation joint; 022 left shoulder joint; 023 right shoulder joint; 024 left elbow joint; 025 right elbow joint; 026 left wrist joint; 027 right wrist joint; 028 hip joint; 029 knee joint; 030 ankle joint.

### SIS-031–040 — Limbs and locomotion

031 left upper arm; 032 right upper arm; 033 left forearm; 034 right forearm; 035 left hand socket; 036 right hand socket; 037 left thigh; 038 right thigh; 039 left lower leg; 040 right lower leg.

### SIS-041–050 — Feet, mobility, and head armor

041 left foot; 042 right foot; 043 wheel leg; 044 crawler leg; 045 stabilizer leg; 046 telescoping limb; 047 universal limb adapter; 048 head crown armor; 049 face plate; 050 neck guard.

### SIS-051–060 — Upper-body armor

051 left shoulder armor; 052 right shoulder armor; 053 left upper-arm armor; 054 right upper-arm armor; 055 left forearm armor; 056 right forearm armor; 057 left chest armor; 058 right chest armor; 059 abdomen armor; 060 back armor.

### SIS-061–070 — Lower-body armor

061 battery cover; 062 left hip armor; 063 right hip armor; 064 left thigh armor; 065 right thigh armor; 066 left knee armor; 067 right knee armor; 068 left shin armor; 069 right shin armor; 070 rear armor.

### SIS-071–080 — Feet, replacement armor, and tools

071 left ankle armor; 072 right ankle armor; 073 left foot shell; 074 right foot shell; 075 universal replacement armor plate; 076 gripper hand; 077 five-finger hand; 078 clamp hand; 079 saw hand; 080 drill hand.

### SIS-081–090 — Tools and support

081 welding hand; 082 cable hand; 083 hook hand; 084 magnet hand; 085 cargo fork; 086 main battery; 087 auxiliary battery; 088 cooling unit; 089 actuator pack; 090 signal relay.

### SIS-091–100 — Storage and transformation

091 storage module; 092 repair kit; 093 cargo module; 094 emergency reserve; 095 disposable power pack; 096 spherical shell segment; 097 rolling hub; 098 shell hinge/seam lock; 099 crawler conversion mount; 100 core transfer cradle.

## Armor-layer system

A visible body part can have several independently replaceable layers:

- **Layer 0 — Structure:** frame, joint, actuator, or socket. Usually exposed only after damage.
- **Layer 1 — Functional cover:** seals, cable guards, cooling shrouds, and sensor bezels.
- **Layer 2 — Primary armor:** the normal outer panel for that part.
- **Layer 3 — Job armor:** a trade-specific cover such as a cable guard, impact plate, cargo shield, or dust seal.
- **Layer 4 — Sacrificial armor:** a cheap disposable plate designed to take damage first.
- **Layer 5 — Repair layer:** weld strips, brackets, clamps, patch plates, or mismatched replacement material.

Every armor panel must preserve its mounting points and show how it can be removed. The same structural part can receive different armor for Sparky, Chippy, Brickie, Binman, Navvy, Grease Monkey, Postie, Docker, or Miner.

## Condition variants

Keep the base part ID stable and add a condition suffix:

- `F` — factory: clean, new, fully fitted
- `W` — worn: scratches, scuffed finish, faded markings
- `D` — damaged: dent, crack, puncture, bent edge, missing fastener
- `R` — repaired: weld, patch, replacement bolts, visible service marks
- `I` — improvised: mismatched plate, temporary brace, repurposed material
- `X` — stripped: armor removed, structure and internals exposed

Examples:

- `SIS-051-F` — clean left shoulder armor
- `SIS-051-D` — dented left shoulder armor with one missing fastener
- `SIS-051-R` — repaired shoulder armor with a welded patch
- `SIS-051-I` — improvised shoulder armor from another job class
- `SIS-051-X` — shoulder mount exposed after plate removal

Do not make every part equally damaged. Critical visible parts should receive the most variants; internal parts can remain mostly factory or worn.

## Approved damage vocabulary

Use believable work damage: scratches, chipped coating, bent corners, dented panels, cracked covers, punctures, missing screws, exposed cables, scorched connectors, dust seals, grease marks, paint transfer, weld beads, cable patches, and mismatched replacement plates.

Avoid making the entire robot rusty, melted, or randomly destroyed. Damage should show the job that caused it and how the part was repaired.

## Job-specific wear profiles

- **Sparky:** scorched cable ports, insulated grips, bright diagnostic marks, patched shoulder armor.
- **Chippy:** saw scratches, wood dust in seams, clamp marks, reinforced fingers.
- **Brickie:** chipped chest plates, mortar stains, heavy feet, impact dents.
- **Binman:** crushed armor, compactor wear, stained panels, mismatched replacements.
- **Navvy:** scraped legs, dust seals, drill vibration damage, reinforced joints.
- **Grease Monkey:** oily joints, frequent replacement plates, open service panels.
- **Postie:** worn feet, route-scanner scratches, light cargo shell dents.
- **Docker:** impact damage, magnetic feet, reinforced shoulders, cargo abrasions.
- **Miner:** dust-covered sensors, scratched armor, lamp damage, sealed joints.

## Image-generation rules

For every new part sheet:

1. Show one part per numbered cell.
2. Show the same part from front, side, and rear only when needed.
3. Keep connector geometry and scale consistent between variants.
4. Include factory, worn, damaged, repaired, and improvised versions only when requested.
5. Use blank callout circles or the exact canonical part ID; never invent numbers.
6. Keep armor separate from the underlying structure.
7. Show fasteners, rails, sockets, hinges, or latches so removal is understandable.
8. Do not create complete bodies on a parts-only sheet.
9. Preserve the same silhouette when changing condition variants.
10. Treat generated images as concept references until manually approved.

## Robot assembly record

A body should be defined by a manifest, not by an unrepeatable prompt:

```text
BOT: BINMAN-01
CORE: SIS-001-W
SENSORS: SIS-002-W, SIS-005-F, SIS-010-W
CHASSIS: SIS-013-W, SIS-015-D, SIS-017-R
JOINTS: SIS-022-W, SIS-023-W, SIS-029-R, SIS-030-D
LOCOMOTION: SIS-039-W, SIS-040-W, SIS-044-F
ARMOR: SIS-057-D, SIS-058-R, SIS-059-W, SIS-061-D, SIS-066-R, SIS-068-W
TOOLS: SIS-076-W, SIS-085-D
SUPPORT: SIS-086-W, SIS-088-D, SIS-093-F
CONDITION: heavily used, repeatedly repaired, still operational
```

This manifest becomes the source for future images, character sheets, transformation diagrams, and accessory/NFT concepts.
