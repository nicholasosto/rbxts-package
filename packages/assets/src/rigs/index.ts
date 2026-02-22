import {
  BloodFaction,
  DecayFaction,
  FatelessFaction,
  RobotFaction,
  SpiritFaction,
} from './factions';

/**
 * RIG_CATALOG
 *
 * NPC/enemy rig model names organized by faction.
 * Matches the "Asset Package - RIGS" (rbxassetid://16034962856) hierarchy.
 * Usage: RIG_CATALOG.Robot.SteamBot
 */
export const RIG_CATALOG = {
  Blood: BloodFaction,
  Decay: DecayFaction,
  Fateless: FatelessFaction,
  Robot: RobotFaction,
  Spirit: SpiritFaction,
} as const;

export type RigFaction = keyof typeof RIG_CATALOG;
export type RigName = {
  [F in RigFaction]: (typeof RIG_CATALOG)[F][keyof (typeof RIG_CATALOG)[F]];
}[RigFaction];
