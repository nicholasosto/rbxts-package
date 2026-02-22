/**
 * @nicholasosto/npc
 *
 * Core type definitions for NPC blueprints, runtime state, state machines,
 * and zone-based spawning.
 */

import { type RigFaction, type RigName } from '@nicholasosto/assets';
import { type CombatState, type StatProfile } from '@nicholasosto/combat-stats';

// ─── Faction ─────────────────────────────────────────────────────────────────

/** Re-export faction type from assets for convenience. */
export type NpcFaction = RigFaction;

// ─── NPC State Machine ───────────────────────────────────────────────────────

/** Possible NPC behavioral states. */
export type NpcState = 'Idle' | 'Patrol' | 'Aggro' | 'Attack' | 'Flee' | 'Dead';

/**
 * String-based condition names evaluated at runtime.
 * The game service checks each condition and triggers transitions accordingly.
 */
export type StateCondition =
  | 'patrolTimerElapsed'
  | 'patrolComplete'
  | 'playerInRange'
  | 'targetLost'
  | 'inAttackRange'
  | 'targetOutOfRange'
  | 'healthLow'
  | 'reachedSafety'
  | 'healthZero';

/** A single transition between two NPC states. */
export interface StateTransition {
  readonly from: NpcState;
  readonly to: NpcState;
  readonly condition: StateCondition;
}

/** Full state machine configuration for an NPC archetype. */
export interface StateMachineConfig {
  readonly initialState: NpcState;
  readonly transitions: readonly StateTransition[];
}

// ─── NPC Definition (Blueprint) ──────────────────────────────────────────────

/**
 * Static blueprint describing an NPC archetype.
 * Immutable data used to spawn NPC instances.
 */
export interface NpcDefinition {
  /** Display name (e.g. "Kael Stormwind the Bold"). */
  readonly name: string;
  /** Faction this NPC belongs to. */
  readonly faction: NpcFaction;
  /** Model name in ReplicatedStorage (from RIG_CATALOG). */
  readonly rigName: RigName;
  /** NPC level — scales stats via faction modifiers. */
  readonly level: number;
  /** Override specific base attribute values (attribute id → value). */
  readonly baseAttributeOverrides?: ReadonlyMap<string, number>;
  /** Equipment model names this NPC should wear. */
  readonly equipment?: readonly string[];
  /** Optional custom state machine; falls back to DEFAULT_STATE_MACHINE. */
  readonly stateMachine?: StateMachineConfig;
}

// ─── NPC Instance (Runtime) ──────────────────────────────────────────────────

/**
 * Runtime representation of a spawned NPC.
 * Created from an NpcDefinition; tracks mutable state.
 */
export interface NpcInstance {
  /** Unique runtime identifier. */
  readonly id: string;
  /** The blueprint this instance was created from. */
  readonly definition: NpcDefinition;
  /** Computed stat profile (base attributes + faction modifiers + level scaling). */
  statProfile: StatProfile;
  /** Current combat state. */
  combatState: CombatState;
  /** Current behavioral state. */
  currentState: NpcState;
  /** Current health (derived from statProfile.derivedStats maxHealth). */
  currentHealth: number;
  /** Reference to the cloned Roblox Model (set by the game service). */
  model?: Model;
}

// ─── Spawn Zone ──────────────────────────────────────────────────────────────

/** Configuration for a zone-based NPC spawner. */
export interface SpawnZoneConfig {
  /** Unique zone identifier. */
  readonly zoneName: string;
  /** Faction of NPCs to spawn in this zone. */
  readonly faction: NpcFaction;
  /** [min, max] level range for spawned NPCs. */
  readonly levelRange: readonly [number, number];
  /** Maximum concurrent NPCs in this zone. */
  readonly maxNpcs: number;
  /** Seconds before a defeated NPC respawns. */
  readonly respawnDelay: number;
  /** Optional subset of rig names to use; defaults to all rigs for the faction. */
  readonly rigNames?: readonly RigName[];
}

// ─── Faction Modifier ────────────────────────────────────────────────────────

/**
 * Attribute multipliers applied per faction.
 * Keys are attribute IDs (e.g. "strength"), values are multipliers (e.g. 1.3).
 * Unspecified attributes default to 1.0 (no change).
 */
export type FactionModifier = Readonly<Record<string, number>>;
