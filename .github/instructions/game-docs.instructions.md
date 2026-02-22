---
applyTo: '**/game-docs/**'
---

# Game Docs — Copilot Context

You are working in the Soul Steel game documentation system. This is the **single source of truth** for all game entity data.

## File Convention

Every entity has a YAML + Markdown pair:

- `{id}.yaml` — structured data validated against `.schemas/`
- `{id}.md` — narrative lore and flavor text

## Schemas

All at `game-docs/.schemas/`:

- `_common.schema.json` — shared `$defs`: `AttributeBlock`, `EntityRef`, `AssetRef`, `DomainId`, `RarityTier`, `ScalingEntry`, `TagList`
- `monster.schema.json` — bestiary entries
- `ability.schema.json` — combat abilities
- `faction.schema.json` — factions
- `class.schema.json` — player classes
- `item.schema.json` — items/equipment
- `domain.schema.json` — world domains

## The Six Base Attributes

| ID             | Display Name | Description                    |
| -------------- | ------------ | ------------------------------ |
| `strength`     | Strength     | Physical damage output         |
| `vitality`     | Vitality     | Max health and health regen    |
| `agility`      | Agility      | Dodge chance and attack speed  |
| `intelligence` | Intelligence | Magic damage and ability power |
| `spirit`       | Spirit       | Max mana and mana regen        |
| `luck`         | Luck         | Crit chance and rare drops     |

## Derived Stat Formulas

| Stat            | Formula                     |
| --------------- | --------------------------- |
| Physical Damage | `strength × 2.5`            |
| Max Health      | `100 + vitality × 10`       |
| Health Regen    | `vitality × 0.5`            |
| Dodge Chance    | `min(agility × 0.5, 75%)`   |
| Attack Speed    | `1.0 + agility × 0.01`      |
| Magic Damage    | `intelligence × 3`          |
| Max Mana        | `50 + spirit × 8`           |
| Mana Regen      | `spirit × 0.3`              |
| Crit Chance     | `min(5 + luck × 0.4, 100%)` |

## The Five Domains

| Domain     | Themes                              | Color         |
| ---------- | ----------------------------------- | ------------- |
| `blood`    | Life force, sacrifice, crimson      | Red           |
| `decay`    | Entropy, undeath, transformation    | Green/dark    |
| `spirit`   | Ethereal, transcendence, balance    | Blue/white    |
| `robot`    | Technology, augmentation, precision | Silver/orange |
| `fateless` | Adaptability, freedom, potential    | Purple/gold   |

## Rarity Tiers (ascending)

`common` → `uncommon` → `rare` → `epic` → `legendary` → `mythic`

## Naming Rules

- Entity IDs: **kebab-case** (`skeleton-warrior`, not `SkeletonWarrior`)
- File names match IDs: `skeleton-warrior.yaml` + `skeleton-warrior.md`
- Cross-references use IDs: `faction: undead-legion`
- Tags: lowercase kebab-case

## Cross-Reference Pattern

```yaml
faction: undead-legion # → factions/undead-legion.yaml
abilities:
  - ref: bone-throw # → abilities/bone-throw.yaml
drops:
  - itemRef: bone-fragment # → items/bone-fragment.yaml
```

## Stat Scaling Guidelines for Monsters

- Primary stats: `base = 10 + (level × 0.8)`
- Secondary stats: `base = 10 + (level × 0.4)`
- Boss (epic+): multiply all stats by 3-5×

## When Creating Entities

1. Follow the schema — all required fields must be present
2. Use existing entity refs when possible
3. Maintain domain consistency (a Blood faction shouldn't contain Spirit monsters)
4. Balance stats relative to level and rarity
5. Always add new entities to the `_index.yaml`
