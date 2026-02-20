import { Networking } from '@flamework/networking';
import type { PlayerProfile } from './player-data';

/**
 * Events fired from CLIENT → SERVER.
 */
export interface ClientToServerEvents {
  /** Player requests a combat action (swing, block, etc.) */
  CombatAction(action: string, targetId?: string): void;

  /** Player activates an ability by slot index */
  AbilityUsed(abilityId: string): void;
}

/**
 * Events fired from SERVER → CLIENT.
 */
export interface ServerToClientEvents {
  /** Notify the client it took damage */
  PlayerDamaged(amount: number, sourceId?: string): void;

  /** Tell the client to play an animation on a target */
  AnimationPlay(animationKey: string, targetId: string): void;

  /** Tell the client to play a sound effect */
  AudioCue(audioKey: string): void;

  /** Broadcast combat state updates (cooldowns, combo reset, etc.) */
  CombatStateUpdate(state: Record<string, unknown>): void;

  /** Sends the full player profile to the client after data loads */
  ProfileLoaded(profile: PlayerProfile): void;
}

/**
 * Request/Response functions (CLIENT → SERVER with return value).
 */
export interface ClientToServerFunctions {
  /** Request current ability loadout from server */
  GetAbilityLoadout(): string[];
}

export interface ServerToClientFunctions {}

export const GlobalEvents = Networking.createEvent<ClientToServerEvents, ServerToClientEvents>();
export const GlobalFunctions = Networking.createFunction<
  ClientToServerFunctions,
  ServerToClientFunctions
>();
