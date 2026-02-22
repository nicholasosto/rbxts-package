/**
 * @nicholasosto/npc
 *
 * Default state machine configuration and factory.
 * Defines NPC behavioral states and transition conditions as pure data —
 * the game service is responsible for evaluating conditions at runtime.
 */

import { type NpcState, type StateMachineConfig, type StateTransition } from './types';

// ─── All Valid States ────────────────────────────────────────────────────────

/** Ordered list of all NPC states. */
export const NPC_STATES: readonly NpcState[] = [
  'Idle',
  'Patrol',
  'Aggro',
  'Attack',
  'Flee',
  'Dead',
];

// ─── Default Transitions ─────────────────────────────────────────────────────

const DEFAULT_TRANSITIONS: readonly StateTransition[] = [
  // Idle
  { from: 'Idle', to: 'Patrol', condition: 'patrolTimerElapsed' },
  { from: 'Idle', to: 'Aggro', condition: 'playerInRange' },
  { from: 'Idle', to: 'Dead', condition: 'healthZero' },

  // Patrol
  { from: 'Patrol', to: 'Idle', condition: 'patrolComplete' },
  { from: 'Patrol', to: 'Aggro', condition: 'playerInRange' },
  { from: 'Patrol', to: 'Dead', condition: 'healthZero' },

  // Aggro
  { from: 'Aggro', to: 'Attack', condition: 'inAttackRange' },
  { from: 'Aggro', to: 'Idle', condition: 'targetLost' },
  { from: 'Aggro', to: 'Flee', condition: 'healthLow' },
  { from: 'Aggro', to: 'Dead', condition: 'healthZero' },

  // Attack
  { from: 'Attack', to: 'Aggro', condition: 'targetOutOfRange' },
  { from: 'Attack', to: 'Flee', condition: 'healthLow' },
  { from: 'Attack', to: 'Dead', condition: 'healthZero' },

  // Flee
  { from: 'Flee', to: 'Idle', condition: 'reachedSafety' },
  { from: 'Flee', to: 'Dead', condition: 'healthZero' },
];

// ─── Default State Machine ───────────────────────────────────────────────────

/**
 * Standard NPC state machine used when no custom config is provided.
 *
 * ```
 *   Idle ──► Patrol ──► Aggro ──► Attack
 *    ▲          │          │         │
 *    └──────────┘          ▼         ▼
 *                        Flee ──► Idle
 *            (any state) ──► Dead
 * ```
 */
export const DEFAULT_STATE_MACHINE: StateMachineConfig = {
  initialState: 'Idle',
  transitions: DEFAULT_TRANSITIONS,
};

// ─── Factory ─────────────────────────────────────────────────────────────────

/**
 * Create a state machine config with optional transition overrides.
 *
 * @param overrides - Partial overrides; `transitions` replaces the defaults entirely.
 * @returns A new `StateMachineConfig`.
 */
export function createStateMachineConfig(
  overrides?: Partial<StateMachineConfig>,
): StateMachineConfig {
  return {
    initialState: overrides?.initialState ?? DEFAULT_STATE_MACHINE.initialState,
    transitions: overrides?.transitions ?? DEFAULT_STATE_MACHINE.transitions,
  };
}

/**
 * Get all valid transitions from a given state.
 *
 * @param config - The state machine config to query.
 * @param state - The current NPC state.
 * @returns Array of transitions originating from `state`.
 */
export function getTransitionsFrom(
  config: StateMachineConfig,
  state: NpcState,
): readonly StateTransition[] {
  const result: StateTransition[] = [];
  for (const t of config.transitions) {
    if (t.from === state) {
      result.push(t);
    }
  }
  return result;
}
