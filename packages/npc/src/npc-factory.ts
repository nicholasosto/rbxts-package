/**
 * @nicholasosto/npc
 *
 * Factory functions for creating NPC definitions, stat profiles,
 * and spawn zone configurations.
 */

import { RIG_CATALOG, type RigFaction, type RigName } from '@nicholasosto/assets';
import { createDefaultRegistry } from '@nicholasosto/combat-stats';
import { Names } from '@nicholasosto/name-generator';

import {
  DEFAULT_LEVEL_SCALE,
  DEFAULT_MAX_NPCS_PER_ZONE,
  DEFAULT_NPC_LEVEL,
  DEFAULT_RESPAWN_DELAY,
} from './defaults';
import { FACTION_MODIFIERS } from './faction-modifiers';
import { FACTION_NAME_POOLS } from './faction-names';
import { DEFAULT_STATE_MACHINE } from './state-machine';
import { type NpcDefinition, type NpcInstance, type SpawnZoneConfig } from './types';

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Pick a random element from a readonly array. */
function pickRandom<T>(arr: readonly T[]): T {
  return arr[math.random(0, arr.size() - 1)];
}

/** Generate a unique-ish runtime ID. */
function generateId(): string {
  return `npc_${math.random(100000, 999999)}_${tick()}`;
}

// ─── Rig Selection ───────────────────────────────────────────────────────────

/**
 * Get all rig names for a faction.
 *
 * @param faction - The faction to look up.
 * @returns Array of rig model name strings.
 */
export function getRigNamesForFaction(faction: RigFaction): RigName[] {
  const factionRigs = RIG_CATALOG[faction];
  const names: RigName[] = [];
  for (const [, rigName] of pairs(factionRigs)) {
    names.push(rigName as RigName);
  }
  return names;
}

/**
 * Pick a random rig from a faction.
 *
 * @param faction - The faction to select from.
 * @returns A random `RigName` belonging to that faction.
 */
export function getRandomRigForFaction(faction: RigFaction): RigName {
  return pickRandom(getRigNamesForFaction(faction));
}

// ─── Name Generation ─────────────────────────────────────────────────────────

/**
 * Generate a themed NPC name for a given faction.
 * Temporarily loads the faction's name pools into the name generator,
 * generates a FULL_MONIKER name, then restores default pools.
 *
 * @param faction - The NPC's faction.
 * @returns A faction-themed full name with moniker.
 */
export function generateNpcName(faction: RigFaction): string {
  const pool = FACTION_NAME_POOLS[faction];
  Names.LoadFirst([...pool.first]);
  Names.LoadLast([...pool.last]);
  Names.LoadMonikers([...pool.monikers]);
  return Names.GenerateName({ type: 'FULL_MONIKER' });
}

// ─── NPC Definition Factory ──────────────────────────────────────────────────

/** Optional overrides when creating an NPC definition. */
export interface NpcDefinitionOptions {
  /** Override the generated name. */
  name?: string;
  /** Override base attribute values (attribute id → value). */
  baseAttributeOverrides?: ReadonlyMap<string, number>;
  /** Equipment model names. */
  equipment?: readonly string[];
}

/**
 * Create an NPC definition (blueprint).
 *
 * @param faction  - NPC faction (determines rig pool, stat modifiers, name theme).
 * @param rigName  - Specific rig model name, or omit to pick randomly from faction.
 * @param level    - NPC level (default: 1).
 * @param options  - Additional overrides.
 * @returns A fully-typed `NpcDefinition`.
 */
export function createNpcDefinition(
  faction: RigFaction,
  rigName?: RigName,
  level?: number,
  options?: NpcDefinitionOptions,
): NpcDefinition {
  return {
    name: options?.name ?? generateNpcName(faction),
    faction,
    rigName: rigName ?? getRandomRigForFaction(faction),
    level: level ?? DEFAULT_NPC_LEVEL,
    baseAttributeOverrides: options?.baseAttributeOverrides,
    equipment: options?.equipment,
    stateMachine: DEFAULT_STATE_MACHINE,
  };
}

// ─── Stat Profile Factory ────────────────────────────────────────────────────

/**
 * Build a stat profile for an NPC definition.
 *
 * 1. Create default attributes from the combat-stats registry.
 * 2. Apply faction modifiers (multipliers per attribute).
 * 3. Apply level scaling: `value *= 1 + (level - 1) * SCALE_PER_LEVEL`.
 * 4. Apply any base attribute overrides from the definition.
 * 5. Compute derived stats.
 *
 * @param definition - The NPC blueprint to build stats for.
 * @returns A complete `StatProfile` with base attributes and derived stats.
 */
export function createNpcStatProfile(definition: NpcDefinition) {
  const registry = createDefaultRegistry();
  const baseAttrs = registry.createDefaultAttributeSet();

  // Apply faction modifiers
  const modifiers = FACTION_MODIFIERS[definition.faction];
  for (const [attrId, baseValue] of baseAttrs) {
    const modifier =
      attrId in modifiers ? (modifiers as unknown as Record<string, number>)[attrId] : 1.0;
    const levelScale = 1 + (definition.level - 1) * DEFAULT_LEVEL_SCALE;
    const scaled = math.floor(baseValue * modifier * levelScale);
    baseAttrs.set(attrId, scaled);
  }

  // Apply overrides
  if (definition.baseAttributeOverrides) {
    for (const [attrId, value] of definition.baseAttributeOverrides) {
      baseAttrs.set(attrId, value);
    }
  }

  return registry.createStatProfile(baseAttrs, definition.level);
}

// ─── NPC Instance Factory ────────────────────────────────────────────────────

/**
 * Create a runtime NPC instance from a definition.
 *
 * @param definition - The NPC blueprint.
 * @returns An `NpcInstance` ready for spawning by the game service.
 */
export function createNpcInstance(definition: NpcDefinition): NpcInstance {
  const statProfile = createNpcStatProfile(definition);
  const maxHealth = statProfile.derivedStats.get('maxHealth') ?? 100;

  return {
    id: generateId(),
    definition,
    statProfile,
    combatState: {
      isAttacking: false,
      isBlocking: false,
      comboCount: 0,
      lastAttackTick: 0,
      cooldowns: new Map<string, number>(),
    },
    currentState: definition.stateMachine?.initialState ?? 'Idle',
    currentHealth: maxHealth,
    model: undefined,
  };
}

// ─── Spawn Zone Factory ──────────────────────────────────────────────────────

/** Optional overrides for spawn zone creation. */
export interface SpawnZoneOptions {
  /** Override max NPCs. */
  maxNpcs?: number;
  /** Override respawn delay (seconds). */
  respawnDelay?: number;
  /** Restrict to specific rig names within the faction. */
  rigNames?: readonly RigName[];
}

/**
 * Create a spawn zone configuration.
 *
 * @param zoneName   - Unique zone identifier.
 * @param faction    - Faction of NPCs in this zone.
 * @param levelRange - [min, max] level range.
 * @param options    - Additional overrides.
 * @returns A `SpawnZoneConfig` ready for use by the game service.
 */
export function createSpawnZoneConfig(
  zoneName: string,
  faction: RigFaction,
  levelRange: readonly [number, number],
  options?: SpawnZoneOptions,
): SpawnZoneConfig {
  return {
    zoneName,
    faction,
    levelRange,
    maxNpcs: options?.maxNpcs ?? DEFAULT_MAX_NPCS_PER_ZONE,
    respawnDelay: options?.respawnDelay ?? DEFAULT_RESPAWN_DELAY,
    rigNames: options?.rigNames,
  };
}
