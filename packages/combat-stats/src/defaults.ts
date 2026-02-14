/**
 * @nicholasosto/combat-stats
 *
 * Default attribute and derived-stat definitions.
 * These match the six attributes already referenced by @nicholasosto/assets
 * (Spirit, Strength, Agility, Intelligence, Vitality, Luck) and provide
 * sensible RPG-style derivation formulas.
 */

import { AttributeDefinition, DerivedStatDefinition } from './types';
import { AttributeRegistry } from './attribute-registry';

// ─── Default Base Attributes ─────────────────────────────────────────────────

export const DEFAULT_ATTRIBUTES: AttributeDefinition[] = [
  {
    id: 'strength',
    displayName: 'Strength',
    description: 'Increases physical damage output.',
    min: 1,
    max: 999,
    defaultValue: 10,
  },
  {
    id: 'vitality',
    displayName: 'Vitality',
    description: 'Increases maximum health and health regeneration.',
    min: 1,
    max: 999,
    defaultValue: 10,
  },
  {
    id: 'agility',
    displayName: 'Agility',
    description: 'Increases dodge chance and attack speed.',
    min: 1,
    max: 999,
    defaultValue: 10,
  },
  {
    id: 'intelligence',
    displayName: 'Intelligence',
    description: 'Increases magic damage and ability power.',
    min: 1,
    max: 999,
    defaultValue: 10,
  },
  {
    id: 'spirit',
    displayName: 'Spirit',
    description: 'Increases maximum mana and mana regeneration.',
    min: 1,
    max: 999,
    defaultValue: 10,
  },
  {
    id: 'luck',
    displayName: 'Luck',
    description: 'Increases critical hit chance and rare drop rate.',
    min: 1,
    max: 999,
    defaultValue: 10,
  },
];

// ─── Default Derived Stats ───────────────────────────────────────────────────

export const DEFAULT_DERIVED_STATS: DerivedStatDefinition[] = [
  {
    id: 'physicalDamage',
    displayName: 'Physical Damage',
    description: 'Base physical damage dealt by attacks.',
    calculate: (attrs) => {
      const str = attrs.get('strength') ?? 0;
      return math.floor(str * 2.5);
    },
  },
  {
    id: 'maxHealth',
    displayName: 'Max Health',
    description: 'Maximum hit points.',
    calculate: (attrs) => {
      const vit = attrs.get('vitality') ?? 0;
      return 100 + vit * 10;
    },
  },
  {
    id: 'healthRegen',
    displayName: 'Health Regen',
    description: 'Health regenerated per second.',
    calculate: (attrs) => {
      const vit = attrs.get('vitality') ?? 0;
      return math.floor(vit * 0.5);
    },
  },
  {
    id: 'dodgeChance',
    displayName: 'Dodge Chance',
    description: 'Percentage chance to avoid an incoming attack (capped at 75%).',
    calculate: (attrs) => {
      const agi = attrs.get('agility') ?? 0;
      return math.min(agi * 0.5, 75);
    },
  },
  {
    id: 'attackSpeed',
    displayName: 'Attack Speed',
    description: 'Attack speed multiplier (1.0 = base).',
    calculate: (attrs) => {
      const agi = attrs.get('agility') ?? 0;
      return 1.0 + agi * 0.01;
    },
  },
  {
    id: 'magicDamage',
    displayName: 'Magic Damage',
    description: 'Base magic damage dealt by abilities.',
    calculate: (attrs) => {
      const int = attrs.get('intelligence') ?? 0;
      return math.floor(int * 3);
    },
  },
  {
    id: 'maxMana',
    displayName: 'Max Mana',
    description: 'Maximum mana pool.',
    calculate: (attrs) => {
      const spr = attrs.get('spirit') ?? 0;
      return 50 + spr * 8;
    },
  },
  {
    id: 'manaRegen',
    displayName: 'Mana Regen',
    description: 'Mana regenerated per second.',
    calculate: (attrs) => {
      const spr = attrs.get('spirit') ?? 0;
      return math.floor(spr * 0.3);
    },
  },
  {
    id: 'critChance',
    displayName: 'Crit Chance',
    description: 'Percentage chance for a critical hit (capped at 100%).',
    calculate: (attrs) => {
      const lck = attrs.get('luck') ?? 0;
      return math.min(5 + lck * 0.4, 100);
    },
  },
];

// ─── Factory ─────────────────────────────────────────────────────────────────

/**
 * Create an `AttributeRegistry` pre-loaded with the default 6 attributes
 * and 9 derived stats.
 *
 * ```ts
 * const registry = createDefaultRegistry();
 * const profile  = registry.createStatProfile();
 * print(profile.derivedStats.get("maxHealth")); // 200
 * ```
 */
export function createDefaultRegistry(): AttributeRegistry {
  const registry = new AttributeRegistry();
  registry.registerAttributes(DEFAULT_ATTRIBUTES);
  registry.registerDerivedStats(DEFAULT_DERIVED_STATS);
  return registry;
}
