import { combineProducers, type InferState } from '@rbxts/reflex';
import { healthSlice } from './health-slice';
import { manaSlice } from './mana-slice';
import { abilitiesSlice } from './abilities-slice';
import { uiSlice } from './ui-slice';
import { profileSlice } from './profile-slice';

export const producer = combineProducers({
  health: healthSlice,
  mana: manaSlice,
  abilities: abilitiesSlice,
  ui: uiSlice,
  profile: profileSlice,
});

export type RootProducer = typeof producer;
export type RootState = InferState<RootProducer>;
