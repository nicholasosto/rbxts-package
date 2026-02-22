# Create Asset Map Entry

Create or update asset-map entries for Soul Steel game entities.

## Context

You are working in the Soul Steel game documentation system. Each entity category
(bestiary, abilities, items, factions, classes) has a single `asset-map.yaml` that
tracks all visual and audio assets for every entity in that category.

## Instructions

1. **Read the entity YAML** to understand the entity's domain, rarity, appearance themes.
2. **Open the category's `asset-map.yaml`** (create if it doesn't exist).
3. **Add an entry keyed by the entity ID** with all relevant asset slots.
4. **Set initial status** to `prompted` for slots where you write a generation prompt, `missing` for slots without prompts.
5. **Write rich art-direction prompts** following the guidelines below.
6. **Set `suggestedFilename`** using the convention: `{category}/{entity-id}/{slot}.{ext}`

## Asset Slots by Category

| Category  | Slots                                                                                                      |
| --------- | ---------------------------------------------------------------------------------------------------------- |
| Bestiary  | `icon`, `portrait`, `rig`, `idle-anim`, `attack-anim`, `death-anim`, `hit-sfx`, `death-sfx`, `ambient-sfx` |
| Abilities | `icon`, `cast-anim`, `projectile`, `impact-vfx`, `cast-sfx`, `impact-sfx`                                  |
| Items     | `icon`, `model`, `equip-sfx`, `use-sfx`                                                                    |
| Factions  | `icon`, `banner`, `theme-music`                                                                            |
| Classes   | `icon`, `portrait`, `rig`, `idle-anim`, `select-sfx`                                                       |

## Prompt Writing Guidelines

### Images (icon, portrait, banner)

- Specify dimensions: icon = 256×256, portrait = 512×768, banner = 256×512
- State background: transparent for icons, dark/themed for portraits
- Reference domain aesthetic and color palette
- Style: "dark-fantasy painterly style, Soul Steel art direction"
- Describe lighting, composition, mood

### 3D Models (Meshy.ai) — rig, model, projectile

- Prefix with "Meshy.ai:"
- Describe form, proportions, materials, scale
- Specify "low-poly game-ready mesh, PBR textures"
- For rigs: "Roblox R15 proportions"
- Reference domain visual motifs

### Audio (Eleven Labs) — all sfx, theme-music

- Prefix with "Eleven Labs SFX:" or "Eleven Labs Music:"
- Describe sound character, attack/sustain/release
- Specify duration range
- For loops: "loop-friendly, seamless loop point"
- Reference mood tied to domain

### Animations — anim slots

- Describe motion arc, timing, key poses
- Reference character type and combat style

## Schema Reference

- Schema files: `.schemas/asset-map-{category}.schema.json`
- Common defs: `.schemas/_common.schema.json` → `AssetSlot`, `AssetStatus`, `AssetRef`, `ModelRef`

## Status Lifecycle

`missing` → `prompted` → `generated` → `reviewed` → `uploaded` → `assigned`

## The Five Domains (for art direction)

| Domain     | Palette           | Motifs                                    |
| ---------- | ----------------- | ----------------------------------------- |
| `blood`    | Crimson, dark red | Blood drops, thorns, veins, sacrifice     |
| `decay`    | Green, dark grey  | Rot, bones, entropy, transformation       |
| `spirit`   | Blue, white       | Ethereal glow, wisps, transcendence       |
| `robot`    | Silver, orange    | Circuits, gears, augmentation, precision  |
| `fateless` | Purple, gold      | Fractured chains, potential, adaptability |
