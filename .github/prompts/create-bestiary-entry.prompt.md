---
mode: agent
description: 'Create a new monster/creature entry in the Soul Steel bestiary with YAML data and lore markdown'
tools:
  - mcp_rbxts-mcp_generate_and_upload_decal
  - mcp_rbxts-mcp_get_package_file
---

# Create Bestiary Entry

You are creating a new monster entry for the Soul Steel game bestiary.
All bestiary data lives in `game-docs/soul-steel/bestiary/` as YAML + Markdown pairs.

## Context

### The Six Base Attributes

| Attribute      | Description                    |
| -------------- | ------------------------------ |
| `strength`     | Physical damage output         |
| `vitality`     | Max health and health regen    |
| `agility`      | Dodge chance and attack speed  |
| `intelligence` | Magic damage and ability power |
| `spirit`       | Max mana and mana regen        |
| `luck`         | Crit chance and rare drops     |

### The Five Domains

`blood`, `decay`, `spirit`, `robot`, `fateless`

### Rarity Tiers

`common`, `uncommon`, `rare`, `epic`, `legendary`, `mythic`

### Schema

The monster schema is at `game-docs/.schemas/monster.schema.json`. Required fields:
`id`, `displayName`, `domain`, `faction`, `level`, `rarity`, `baseAttributes`

## Workflow

### 1. Gather Concept

Ask the user for:

- Monster name and concept
- Which domain it belongs to
- Approximate level range (1-100)
- Rarity tier
- Combat style (melee, ranged, magic, etc.)

Provide sensible defaults if the user only gives a name/concept.

### 2. Generate YAML Data File

Create `game-docs/soul-steel/bestiary/{monster-id}.yaml` with:

- **id**: kebab-case version of the name
- **baseAttributes**: Scale based on level and combat style:
  - Melee fighters: higher strength/vitality
  - Ranged/magic: higher intelligence/spirit
  - Agile enemies: higher agility
  - Bosses: all stats elevated
  - Use the formula: `base = 10 + (level * 0.8)` for primary stats, `base = 10 + (level * 0.4)` for secondary
- **abilities**: Reference existing abilities or note new ones needed
- **drops**: Include 2-4 reasonable drops with balanced probabilities
- **behavior**: Set aggroRange, leashRange, respawnTime based on rarity

### 3. Write Lore Markdown

Create `game-docs/soul-steel/bestiary/{monster-id}.md` with:

- A compelling title and opening flavor quote
- **Description**: 2-3 paragraphs of lore (origin, appearance, behavior)
- **Encounter Strategy**: Tips for players (weaknesses, attack patterns)
- **Notable Drops**: Brief descriptions of key loot

Use a dark-fantasy RPG tone consistent with the Soul Steel world.

### 4. Update Index

Add the monster's ID to `game-docs/soul-steel/bestiary/_index.yaml` under the `entries` list.

### 5. (Optional) Generate Thumbnail

If the user wants a visual, call `generate_and_upload_decal` with:

- **imagePrompt**: Dark-fantasy portrait of the creature
- **name**: PascalCase version of the monster name
  Then update the `thumbnail` field in the YAML.

## Stat Scaling Reference

| Level Range | Common HP Range | Common Damage Range |
| ----------- | --------------- | ------------------- |
| 1-10        | 100-200         | 10-25               |
| 11-25       | 200-500         | 25-60               |
| 26-50       | 500-1200        | 60-150              |
| 51-75       | 1200-3000       | 150-400             |
| 76-100      | 3000-10000      | 400-1000            |

Boss-tier monsters (epic+) should have 3-5x the stats of common monsters at the same level.
