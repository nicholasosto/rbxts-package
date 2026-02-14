/**
 * Client-specific type definitions for the Combat RPG.
 */

/** Possible player input actions */
export enum InputAction {
  Attack = 'Attack',
  Block = 'Block',
  Dodge = 'Dodge',
  Ability1 = 'Ability1',
  Ability2 = 'Ability2',
  Ability3 = 'Ability3',
  Ability4 = 'Ability4',
  Interact = 'Interact',
  ToggleInventory = 'ToggleInventory',
  ToggleMenu = 'ToggleMenu',
}

/** Client-side combat state tracking */
export interface CombatState {
  isAttacking: boolean;
  isBlocking: boolean;
  comboCount: number;
  lastAttackTick: number;
  cooldowns: Map<string, number>;
}

/** A single ability slot in the HUD */
export interface AbilitySlot {
  abilityId: string;
  displayName: string;
  iconImage: string;
  cooldownRemaining: number;
  isReady: boolean;
}

/** Props shared across HUD elements */
export interface HudProps {
  visible: boolean;
}

/** Player state exposed to UI layer */
export interface PlayerUIState {
  health: number;
  maxHealth: number;
  abilities: AbilitySlot[];
  isMenuOpen: boolean;
  isInventoryOpen: boolean;
}
