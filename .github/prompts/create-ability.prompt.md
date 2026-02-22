---
mode: agent
description: 'Create a new combat ability for Soul Steel with YAML data and flavor text'
tools:
  - mcp_rbxts-mcp_get_package_file
---

# Create Ability

You are creating a new combat ability for the Soul Steel game.
All ability data lives in `game-docs/soul-steel/abilities/` as YAML + Markdown pairs.

## Context

### The Six Base Attributes

| Attribute      | Description                        |
| -------------- | ---------------------------------- |
| `strength`     | Physical damage (melee scaling)    |
| `vitality`     | Health (tank scaling)              |
| `agility`      | Speed/dodge (finesse scaling)      |
| `intelligence` | Magic damage (caster scaling)      |
| `spirit`       | Mana pool (healer/support scaling) |
| `luck`         | Crit chance (secondary scaling)    |

### Ability Types

`melee`, `ranged`, `magic`, `buff`, `debuff`, `heal`, `summon`, `utility`

### Target Types

`self`, `single-enemy`, `single-ally`, `aoe-enemy`, `aoe-ally`, `aoe-all`, `cone`, `line`

### Domains

`blood`, `decay`, `spirit`, `robot`, `fateless`

### Schema

The ability schema is at `game-docs/.schemas/ability.schema.json`. Required fields:
`id`, `displayName`, `type`, `targetType`, `stats`

## Workflow

### 1. Gather Concept

Ask the user for:

- Ability name and concept
- Type (melee/magic/heal/etc.)
- Domain affiliation (if any)
- Class restriction (if any, or "universal")

### 2. Generate YAML Data File

Create `game-docs/soul-steel/abilities/{ability-id}.yaml` with:

- **stats**: Balance based on type:
  - Damage abilities: `damage = base * scaling_multiplier`, reasonable `manaCost` and `cooldown`
  - Heals: `healing` value, higher `manaCost`, moderate `cooldown`
  - Buffs/debuffs: focus on `duration`, low damage, moderate `cooldown`
  - AoE abilities: ~60% of single-target damage but wider impact
- **scaling**: Pick 1-2 attributes that make sense:
  - Melee: `strength` (2.0-3.0 multiplier)
  - Magic: `intelligence` (2.5-3.5 multiplier)
  - Heals: `spirit` (2.0-3.0 multiplier)
  - Utility: `agility` or mixed (1.5-2.0 multiplier)
- **manaCost/cooldown balance**: Higher damage = higher cost/cooldown

### 3. Write Flavor Text

Create `game-docs/soul-steel/abilities/{ability-id}.md` with:

- A short flavor quote
- **Description**: What the ability looks like visually
- **Usage Notes**: When to use it, combos, tactical considerations
- **Scaling**: Plain-English explanation of how it scales

### 4. Update Index

Add the ability's ID to `game-docs/soul-steel/abilities/_index.yaml` under the `entries` list.

## Balance Guidelines

| Tier     | Damage Range | Mana Cost | Cooldown |
| -------- | ------------ | --------- | -------- |
| Basic    | 20-40        | 10-20     | 1-3s     |
| Standard | 40-80        | 20-40     | 3-6s     |
| Powerful | 80-150       | 40-70     | 6-12s    |
| Ultimate | 150-300      | 70-100    | 15-30s   |

These are base values before scaling. Actual damage = base + (attribute × multiplier).
