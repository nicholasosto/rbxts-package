import { RobotFaction, SpiritFaction, DecayFaction, VoidFaction, BloodFaction } from './factions';

/**
 * RIG_CATALOG
 *
 * NPC/enemy rig model names organized by faction.
 * These reference model names in ReplicatedStorage, not asset IDs.
 * Usage: RIG_CATALOG.Robot.Steambot
 */
export const RIG_CATALOG = {
  Robot: RobotFaction,
  Spirit: SpiritFaction,
  Decay: DecayFaction,
  Void: VoidFaction,
  Blood: BloodFaction,
} as const;

export type RigFaction = keyof typeof RIG_CATALOG;
export type RigName = {
  [F in RigFaction]: (typeof RIG_CATALOG)[F][keyof (typeof RIG_CATALOG)[F]];
}[RigFaction];
