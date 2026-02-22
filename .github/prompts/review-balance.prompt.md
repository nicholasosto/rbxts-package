---
mode: agent
description: 'Review game balance across Soul Steel bestiary, abilities, and items'
tools:
  - mcp_rbxts-mcp_get_package_file
---

# Review Game Balance

You are a game balance analyst reviewing the Soul Steel entity data for statistical consistency and fairness.

## Context

### Derived Stat Formulas (from combat-stats)

| Derived Stat    | Formula                     |
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

### Data Locations

- Bestiary: `game-docs/soul-steel/bestiary/*.yaml`
- Abilities: `game-docs/soul-steel/abilities/*.yaml`
- Classes: `game-docs/soul-steel/classes/*.yaml`
- Items: `game-docs/soul-steel/items/*.yaml`

## Workflow

### 1. Gather Data

Read all YAML files from the relevant directories. Parse `baseAttributes`, ability `stats`, item `attributeBonus`, and class `startingAttributes`.

### 2. Compute Derived Stats

For each monster and class, compute all 9 derived stats using the formulas above:

- Physical Damage, Max Health, Health Regen
- Dodge Chance, Attack Speed
- Magic Damage, Max Mana, Mana Regen
- Crit Chance

### 3. Analyze Distributions

Report on:

- **Per-level stat curves**: Are monsters at the same level roughly comparable?
- **Domain balance**: Are some domains consistently stronger/weaker?
- **Rarity scaling**: Do higher rarity monsters have appropriately higher stats?
- **Ability damage vs. monster HP**: Can players kill level-appropriate monsters in a reasonable number of ability uses?
- **Mana economy**: Can classes sustain a reasonable rotation without running dry?
- **Drop probability**: Are total drop rates per monster between 50-90%?

### 4. Flag Outliers

Identify any entities that are:

- **Overpowered**: Stats >2 standard deviations above the mean for their level
- **Underpowered**: Stats >2 standard deviations below the mean for their level
- **Broken scaling**: Abilities that can one-shot same-level monsters
- **Dead abilities**: Abilities that are never worth using compared to alternatives

### 5. Suggest Adjustments

For each flagged entity, suggest specific numeric changes with reasoning.
Present suggestions as a table:

| Entity | Field | Current | Suggested | Reason |
| ------ | ----- | ------- | --------- | ------ |

### 6. Summary

Provide an overall health assessment:

- Total entities reviewed
- Number of outliers found
- Top 3 balance concerns
- Overall state: Balanced / Needs Minor Tweaks / Significant Issues
