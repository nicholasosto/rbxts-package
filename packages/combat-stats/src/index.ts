/**
 * @nicholasosto/combat-stats
 *
 * Configurable RPG attribute system with derived stats for roblox-ts games.
 * Register base attributes and derivation formulas, then compute stat profiles.
 */

// Types
export type {
  AttributeDefinition,
  AttributeSet,
  DerivedStatDefinition,
  DerivedStatSet,
  StatProfile,
  CombatState,
  AbilitySlot,
} from './types';

// Core
export { AttributeRegistry } from './attribute-registry';

// Defaults
export { DEFAULT_ATTRIBUTES, DEFAULT_DERIVED_STATS, createDefaultRegistry } from './defaults';

// Utilities
export { clampAttribute, modifyAttribute, setAttribute, scaleAttribute } from './stat-utils';
