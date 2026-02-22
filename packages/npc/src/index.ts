/**
 * @nicholasosto/npc
 *
 * NPC definitions, faction stat scaling, state machine configs,
 * and zone-based spawning utilities for roblox-ts games.
 *
 * This is a pure data/utility library — runtime spawning, AI execution,
 * and model management are handled by the consuming game service.
 */

// Types
export type {
  FactionModifier,
  NpcDefinition,
  NpcFaction,
  NpcInstance,
  NpcState,
  SpawnZoneConfig,
  StateCondition,
  StateMachineConfig,
  StateTransition,
} from './types';

// Defaults
export {
  DEFAULT_AGGRO_RANGE,
  DEFAULT_ATTACK_RANGE,
  DEFAULT_FLEE_HEALTH_PERCENT,
  DEFAULT_LEVEL_SCALE,
  DEFAULT_MAX_NPCS_PER_ZONE,
  DEFAULT_NPC_LEVEL,
  DEFAULT_PATROL_DURATION,
  DEFAULT_RESPAWN_DELAY,
} from './defaults';

// Faction modifiers
export { FACTION_MODIFIERS } from './faction-modifiers';

// Faction name pools
export { FACTION_NAME_POOLS, type FactionNamePool } from './faction-names';

// State machine
export {
  DEFAULT_STATE_MACHINE,
  NPC_STATES,
  createStateMachineConfig,
  getTransitionsFrom,
} from './state-machine';

// Factories
export {
  createNpcDefinition,
  createNpcInstance,
  createNpcStatProfile,
  createSpawnZoneConfig,
  generateNpcName,
  getRandomRigForFaction,
  getRigNamesForFaction,
  type NpcDefinitionOptions,
  type SpawnZoneOptions,
} from './npc-factory';
