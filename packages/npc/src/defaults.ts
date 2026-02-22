/**
 * @nicholasosto/npc
 *
 * Default constants for NPC configuration.
 */

// ─── Level & Scaling ─────────────────────────────────────────────────────────

/** Default NPC level when not specified. */
export const DEFAULT_NPC_LEVEL = 1;

/** Attribute scaling per level: attrs *= 1 + (level - 1) * SCALE_PER_LEVEL. */
export const DEFAULT_LEVEL_SCALE = 0.08;

// ─── Spawn Zone ──────────────────────────────────────────────────────────────

/** Seconds before a defeated NPC respawns. */
export const DEFAULT_RESPAWN_DELAY = 30;

/** Maximum concurrent NPCs in a single spawn zone. */
export const DEFAULT_MAX_NPCS_PER_ZONE = 5;

// ─── AI Distances ────────────────────────────────────────────────────────────

/** Studs within which an NPC detects a player and enters Aggro. */
export const DEFAULT_AGGRO_RANGE = 50;

/** Studs within which an NPC can execute attacks. */
export const DEFAULT_ATTACK_RANGE = 5;

/** Health percentage threshold to trigger Flee state. */
export const DEFAULT_FLEE_HEALTH_PERCENT = 0.2;

/** Seconds an NPC patrols before returning to Idle. */
export const DEFAULT_PATROL_DURATION = 10;
