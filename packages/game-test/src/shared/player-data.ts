/**
 * Player Data — Profile template and supporting types.
 *
 * Defines the canonical shape of persisted player data.
 * All fields use serialization-safe types (Record, array, primitives)
 * so ProfileStore can save/load without conversion.
 *
 * Default values are seeded from @nicholasosto/combat-stats where applicable.
 */

// ─── Supporting Types ────────────────────────────────────────────────────────

/** A single item in the player's inventory. */
export interface InventoryItem {
  itemId: string;
  displayName: string;
  quantity: number;
  category: 'weapon' | 'armor' | 'consumable' | 'material' | 'quest' | 'cosmetic';
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  /** Optional metadata — ability attached, modifier values, etc. */
  metadata?: Record<string, unknown>;
}

/** Tracks progress for a single quest. */
export interface QuestProgress {
  questId: string;
  status: 'active' | 'completed' | 'failed';
  /** Map of objective id → current count */
  objectives: Record<string, number>;
  startedAt: number;
  completedAt?: number;
}

/** Currency wallet. */
export interface CurrencyData {
  gold: number;
  gems: number;
}

/** Player settings persisted across sessions. */
export interface PlayerSettings {
  musicVolume: number;
  sfxVolume: number;
}

// ─── Player Profile ──────────────────────────────────────────────────────────

/**
 * The full persisted profile for a player.
 * This is the `Template` type passed to `ProfileStore.New()`.
 */
export interface PlayerProfile {
  // ── Progression ───────────────────────────
  level: number;
  experience: number;

  // ── Attributes (combat-stats base attributes) ─
  baseAttributes: Record<string, number>;

  // ── Abilities ─────────────────────────────
  abilityLoadout: string[];

  // ── Inventory & Equipment ─────────────────
  inventory: InventoryItem[];
  /** Slot name → itemId (e.g. "mainHand" → "iron_sword") */
  equipment: Record<string, string | undefined>;

  // ── Currency ──────────────────────────────
  currency: CurrencyData;

  // ── Settings ──────────────────────────────
  settings: PlayerSettings;

  // ── Quests ────────────────────────────────
  quests: Record<string, QuestProgress>;

  // ── Cosmetics ─────────────────────────────
  unlockedCosmetics: string[];
  equippedCosmetics: string[];
}

// ─── Default Profile ─────────────────────────────────────────────────────────

/**
 * Frozen default template passed to `ProfileStore.New()`.
 *
 * Base attribute defaults match the combat-stats package:
 *   strength, vitality, agility, intelligence, spirit, luck — all 10.
 */
export const DEFAULT_PROFILE: PlayerProfile = {
  level: 1,
  experience: 0,

  baseAttributes: {
    strength: 10,
    vitality: 10,
    agility: 10,
    intelligence: 10,
    spirit: 10,
    luck: 10,
  },

  abilityLoadout: ['Fireball', 'Shield', 'Heal', 'Dash'],

  inventory: [],
  equipment: {},

  currency: {
    gold: 0,
    gems: 0,
  },

  settings: {
    musicVolume: 0.5,
    sfxVolume: 0.5,
  },

  quests: {},

  unlockedCosmetics: [],
  equippedCosmetics: [],
};
