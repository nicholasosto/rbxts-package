/**
 * Shared module — re-exports networking and asset catalogs.
 */

// --- Networking (Flamework events/functions) ---
export { GlobalEvents, GlobalFunctions } from './network';

// --- Asset catalogs (re-export for convenience) ---
export {
  ANIMATION_CATALOG,
  AUDIO_CATALOG,
  IMAGE_CATALOG,
  RIG_CATALOG,
  PARTICLE_CATALOG,
  MathUtils,
  StringUtils,
} from '@nicholasosto/assets';

// --- Player Data types & template ---
export type {
  PlayerProfile,
  InventoryItem,
  QuestProgress,
  CurrencyData,
  PlayerSettings,
} from './player-data';
export { DEFAULT_PROFILE } from './player-data';
