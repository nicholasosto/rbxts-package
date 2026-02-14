/**
 * Client-specific type definitions for the Combat RPG.
 */

// Import combat types from the shared package (used locally by PlayerUIState)
import type { CombatState, AbilitySlot } from '@nicholasosto/combat-stats';

// Re-export for consumers
export type { CombatState, AbilitySlot };

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
