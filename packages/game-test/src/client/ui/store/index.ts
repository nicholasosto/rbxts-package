import { PlayerUIState } from '../../types';

/**
 * UI Store — Placeholder for client-side UI state management.
 *
 * This module will hold the shared reactive state consumed by all
 * UI components. Consider using:
 *   - @rbxts/reflex (Rodux alternative with selectors)
 *   - React context + useReducer
 *   - Simple shared signals
 *
 * For now, export default state and action types as a contract.
 */

/** Default player UI state */
export const DEFAULT_UI_STATE: PlayerUIState = {
  health: 100,
  maxHealth: 100,
  abilities: [],
  isMenuOpen: false,
  isInventoryOpen: false,
};

/** Action types for state transitions */
export enum UIAction {
  SetHealth = 'SetHealth',
  SetAbilities = 'SetAbilities',
  ToggleMenu = 'ToggleMenu',
  ToggleInventory = 'ToggleInventory',
}

// TODO: Implement a state store (Reflex, context, or signals) and
// export hooks/selectors for consumption by UI components.
