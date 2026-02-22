---
applyTo: '**/packages/combat-stats/**'
---

# Combat Stats Package — Copilot Context

This package defines the core RPG stat system for Soul Steel.

## Architecture

- `types.ts` — Type definitions (AttributeDefinition, DerivedStatDefinition, StatProfile, CombatState, AbilitySlot)
- `attribute-registry.ts` — `AttributeRegistry` class with register/compute pattern
- `defaults.ts` — 6 default attributes + 9 derived stats with formulas + `createDefaultRegistry()` factory
- `stat-utils.ts` — Utility functions (clamp, modify, set, scale)
- `index.ts` — Barrel exports

## Hand-Written vs Generated

| Directory                   | Source                      | Editable?                       |
| --------------------------- | --------------------------- | ------------------------------- |
| `src/types.ts`              | Hand-written                | Yes                             |
| `src/defaults.ts`           | Hand-written                | Yes                             |
| `src/attribute-registry.ts` | Hand-written                | Yes                             |
| `src/stat-utils.ts`         | Hand-written                | Yes                             |
| `src/generated/`            | Codegen from game-docs YAML | **No** — overwritten by codegen |

## The Six Attributes

| ID             | Default | Min | Max |
| -------------- | ------- | --- | --- |
| `strength`     | 10      | 1   | 999 |
| `vitality`     | 10      | 1   | 999 |
| `agility`      | 10      | 1   | 999 |
| `intelligence` | 10      | 1   | 999 |
| `spirit`       | 10      | 1   | 999 |
| `luck`         | 10      | 1   | 999 |

## Derived Stat Formulas

```
physicalDamage = math.floor(strength * 2.5)
maxHealth      = 100 + vitality * 10
healthRegen    = math.floor(vitality * 0.5)
dodgeChance    = math.min(agility * 0.5, 75)
attackSpeed    = 1.0 + agility * 0.01
magicDamage    = math.floor(intelligence * 3)
maxMana        = 50 + spirit * 8
manaRegen      = math.floor(spirit * 0.3)
critChance     = math.min(5 + luck * 0.4, 100)
```

## Codegen Integration

The codegen pipeline reads `game-docs/soul-steel/*.yaml` and generates:

- `src/generated/bestiary.ts` — monster attribute blocks
- `src/generated/abilities.ts` — ability stat tables
- `src/generated/classes.ts` — class starting attributes and progression

These use `as const satisfies` pattern and are re-exported from `index.ts`.
