/**
 * @nicholasosto/npc
 *
 * Per-faction attribute multipliers.
 * Applied to base attribute values when creating an NPC stat profile.
 * Unspecified attributes default to 1.0 (no modification).
 */

import { type RigFaction } from '@nicholasosto/assets';
import { type FactionModifier } from './types';

/**
 * FACTION_MODIFIERS
 *
 * Each faction emphasises different attributes, creating distinct combat roles:
 *
 * | Faction | Identity                     | Primary buffs           | Weakness        |
 * |---------|------------------------------|-------------------------|-----------------|
 * | Robot   | Tanky bruisers               | Strength, Vitality      | Intelligence    |
 * | Spirit  | Glass-cannon casters         | Intelligence, Spirit    | Vitality        |
 * | Decay   | Slow, durable undead         | Vitality, Strength      | Agility         |
 * | Void    | Evasive shadow assassins     | Intelligence, Agility   | Luck            |
 * | Blood   | Balanced melee / lifesteal   | Strength, Agility, Spirit | Intelligence  |
 */
export const FACTION_MODIFIERS: Record<RigFaction, FactionModifier> = {
  Robot: {
    strength: 1.3,
    vitality: 1.2,
    agility: 0.9,
    intelligence: 0.7,
    spirit: 0.8,
    luck: 1.0,
  },
  Spirit: {
    strength: 0.7,
    vitality: 0.8,
    agility: 1.0,
    intelligence: 1.4,
    spirit: 1.3,
    luck: 1.0,
  },
  Decay: {
    strength: 1.1,
    vitality: 1.5,
    agility: 0.6,
    intelligence: 0.8,
    spirit: 0.9,
    luck: 1.0,
  },
  Void: {
    strength: 0.9,
    vitality: 0.8,
    agility: 1.3,
    intelligence: 1.2,
    spirit: 1.0,
    luck: 0.7,
  },
  Blood: {
    strength: 1.2,
    vitality: 1.0,
    agility: 1.2,
    intelligence: 0.8,
    spirit: 1.1,
    luck: 1.0,
  },
} as const;
