import type { RootState } from './producer';

// --- Health selectors ---
export const selectHealth = (state: RootState) => state.health;
export const selectHealthCurrent = (state: RootState) => state.health.current;
export const selectHealthMax = (state: RootState) => state.health.max;

// --- Mana selectors ---
export const selectMana = (state: RootState) => state.mana;
export const selectManaCurrent = (state: RootState) => state.mana.current;
export const selectManaMax = (state: RootState) => state.mana.max;

// --- Abilities selectors ---
export const selectAbilities = (state: RootState) => state.abilities.slots;

// --- UI selectors ---
export const selectIsMenuOpen = (state: RootState) => state.ui.isMenuOpen;
export const selectIsInventoryOpen = (state: RootState) => state.ui.isInventoryOpen;
