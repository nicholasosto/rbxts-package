/**
 * @nicholasosto/combat-stats
 *
 * Core type definitions for the configurable attribute and derived-stat system.
 */

// ─── Base Attribute Types ────────────────────────────────────────────────────

/** Defines a single base attribute (e.g. Strength, Vitality). */
export interface AttributeDefinition {
  /** Unique identifier (e.g. "strength"). */
  id: string;
  /** Human-readable label (e.g. "Strength"). */
  displayName: string;
  /** Optional tooltip description. */
  description?: string;
  /** Minimum allowed value. */
  min: number;
  /** Maximum allowed value. */
  max: number;
  /** Starting value for new characters. */
  defaultValue: number;
}

/** A map of attribute IDs to their current numeric values. */
export type AttributeSet = Map<string, number>;

// ─── Derived Stat Types ──────────────────────────────────────────────────────

/**
 * Defines a secondary stat derived from base attributes.
 *
 * The `calculate` function receives the full `AttributeSet` and returns
 * the computed value. This keeps formulas type-safe and Luau-compatible.
 */
export interface DerivedStatDefinition {
  /** Unique identifier (e.g. "physicalDamage"). */
  id: string;
  /** Human-readable label (e.g. "Physical Damage"). */
  displayName: string;
  /** Optional tooltip description. */
  description?: string;
  /** Pure function that computes this stat from base attributes. */
  calculate: (attributes: AttributeSet) => number;
}

/** A map of derived-stat IDs to their computed numeric values. */
export type DerivedStatSet = Map<string, number>;

// ─── Profile ─────────────────────────────────────────────────────────────────

/** Complete stat snapshot for a character. */
export interface StatProfile {
  /** Base attribute values (e.g. Strength = 10). */
  baseAttributes: AttributeSet;
  /** Computed secondary stats (e.g. PhysicalDamage = 25). */
  derivedStats: DerivedStatSet;
  /** Optional character level. */
  level?: number;
}

// ─── Combat State (migrated from game-test) ──────────────────────────────────

/** Client-side combat state tracking. */
export interface CombatState {
  isAttacking: boolean;
  isBlocking: boolean;
  comboCount: number;
  lastAttackTick: number;
  cooldowns: Map<string, number>;
}

/** A single ability slot in the HUD. */
export interface AbilitySlot {
  abilityId: string;
  displayName: string;
  iconImage: string;
  cooldownRemaining: number;
  isReady: boolean;
}
