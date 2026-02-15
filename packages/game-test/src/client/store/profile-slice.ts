import { createProducer } from '@rbxts/reflex';
import type {
  PlayerProfile,
  InventoryItem,
  CurrencyData,
  PlayerSettings,
} from '../../shared/player-data';
import { DEFAULT_PROFILE } from '../../shared/player-data';

/**
 * Profile slice — holds the raw persisted player data on the client.
 *
 * Hydrated once via the `ProfileLoaded` network event.
 * Individual fields can be updated granularly as the server
 * pushes changes during gameplay.
 */

export interface ProfileState {
  isLoaded: boolean;
  level: number;
  experience: number;
  baseAttributes: Record<string, number>;
  abilityLoadout: string[];
  inventory: InventoryItem[];
  equipment: Record<string, string | undefined>;
  currency: CurrencyData;
  settings: PlayerSettings;
  unlockedCosmetics: string[];
  equippedCosmetics: string[];
}

const initialState: ProfileState = {
  isLoaded: false,
  level: DEFAULT_PROFILE.level,
  experience: DEFAULT_PROFILE.experience,
  baseAttributes: DEFAULT_PROFILE.baseAttributes,
  abilityLoadout: DEFAULT_PROFILE.abilityLoadout,
  inventory: DEFAULT_PROFILE.inventory,
  equipment: DEFAULT_PROFILE.equipment,
  currency: DEFAULT_PROFILE.currency,
  settings: DEFAULT_PROFILE.settings,
  unlockedCosmetics: DEFAULT_PROFILE.unlockedCosmetics,
  equippedCosmetics: DEFAULT_PROFILE.equippedCosmetics,
};

export const profileSlice = createProducer(initialState, {
  /** Hydrate the entire profile from server data. */
  setProfile: (_state, profile: PlayerProfile): ProfileState => ({
    isLoaded: true,
    level: profile.level,
    experience: profile.experience,
    baseAttributes: profile.baseAttributes,
    abilityLoadout: profile.abilityLoadout,
    inventory: profile.inventory,
    equipment: profile.equipment,
    currency: profile.currency,
    settings: profile.settings,
    unlockedCosmetics: profile.unlockedCosmetics,
    equippedCosmetics: profile.equippedCosmetics,
  }),

  setProfileLoaded: (state, isLoaded: boolean): ProfileState => ({
    isLoaded,
    level: state.level,
    experience: state.experience,
    baseAttributes: state.baseAttributes,
    abilityLoadout: state.abilityLoadout,
    inventory: state.inventory,
    equipment: state.equipment,
    currency: state.currency,
    settings: state.settings,
    unlockedCosmetics: state.unlockedCosmetics,
    equippedCosmetics: state.equippedCosmetics,
  }),

  setLevel: (state, level: number): ProfileState => ({
    isLoaded: state.isLoaded,
    level,
    experience: state.experience,
    baseAttributes: state.baseAttributes,
    abilityLoadout: state.abilityLoadout,
    inventory: state.inventory,
    equipment: state.equipment,
    currency: state.currency,
    settings: state.settings,
    unlockedCosmetics: state.unlockedCosmetics,
    equippedCosmetics: state.equippedCosmetics,
  }),

  setExperience: (state, experience: number): ProfileState => ({
    isLoaded: state.isLoaded,
    level: state.level,
    experience,
    baseAttributes: state.baseAttributes,
    abilityLoadout: state.abilityLoadout,
    inventory: state.inventory,
    equipment: state.equipment,
    currency: state.currency,
    settings: state.settings,
    unlockedCosmetics: state.unlockedCosmetics,
    equippedCosmetics: state.equippedCosmetics,
  }),

  setCurrency: (state, currency: CurrencyData): ProfileState => ({
    isLoaded: state.isLoaded,
    level: state.level,
    experience: state.experience,
    baseAttributes: state.baseAttributes,
    abilityLoadout: state.abilityLoadout,
    inventory: state.inventory,
    equipment: state.equipment,
    currency,
    settings: state.settings,
    unlockedCosmetics: state.unlockedCosmetics,
    equippedCosmetics: state.equippedCosmetics,
  }),

  setInventory: (state, inventory: InventoryItem[]): ProfileState => ({
    isLoaded: state.isLoaded,
    level: state.level,
    experience: state.experience,
    baseAttributes: state.baseAttributes,
    abilityLoadout: state.abilityLoadout,
    inventory,
    equipment: state.equipment,
    currency: state.currency,
    settings: state.settings,
    unlockedCosmetics: state.unlockedCosmetics,
    equippedCosmetics: state.equippedCosmetics,
  }),

  setSettings: (state, settings: PlayerSettings): ProfileState => ({
    isLoaded: state.isLoaded,
    level: state.level,
    experience: state.experience,
    baseAttributes: state.baseAttributes,
    abilityLoadout: state.abilityLoadout,
    inventory: state.inventory,
    equipment: state.equipment,
    currency: state.currency,
    settings,
    unlockedCosmetics: state.unlockedCosmetics,
    equippedCosmetics: state.equippedCosmetics,
  }),
});
