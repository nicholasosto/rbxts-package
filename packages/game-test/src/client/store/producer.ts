import { combineProducers, InferState } from '@rbxts/reflex';
import { healthSlice } from './health-slice';
import { manaSlice } from './mana-slice';
import { abilitiesSlice } from './abilities-slice';
import { uiSlice } from './ui-slice';

export const producer = combineProducers({
  health: healthSlice,
  mana: manaSlice,
  abilities: abilitiesSlice,
  ui: uiSlice,
});

export type RootProducer = typeof producer;
export type RootState = InferState<RootProducer>;
