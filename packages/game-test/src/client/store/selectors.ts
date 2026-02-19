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
export const selectIsCatalogOpen = (state: RootState) => state.ui.isCatalogOpen;

// --- Notification selectors ---
export const selectToasts = (state: RootState) => state.notifications.toasts;

// --- Buff selectors ---
export const selectBuffs = (state: RootState) => state.buffs.buffs;

// --- Profile selectors ---
export const selectIsProfileLoaded = (state: RootState) => state.profile.isLoaded;
export const selectLevel = (state: RootState) => state.profile.level;
export const selectExperience = (state: RootState) => state.profile.experience;
export const selectCurrency = (state: RootState) => state.profile.currency;
export const selectInventory = (state: RootState) => state.profile.inventory;
export const selectEquipment = (state: RootState) => state.profile.equipment;
export const selectSettings = (state: RootState) => state.profile.settings;
export const selectBaseAttributes = (state: RootState) => state.profile.baseAttributes;
export const selectProfile = (state: RootState) => state.profile;
