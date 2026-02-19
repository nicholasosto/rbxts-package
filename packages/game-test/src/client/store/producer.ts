import { combineProducers, type InferState } from '@rbxts/reflex';
import { abilitiesSlice } from './abilities-slice';
import { buffSlice } from './buff-slice';
import { healthSlice } from './health-slice';
import { manaSlice } from './mana-slice';
import { notificationSlice } from './notification-slice';
import { profileSlice } from './profile-slice';
import { uiSlice } from './ui-slice';

export const producer = combineProducers({
  health: healthSlice,
  mana: manaSlice,
  abilities: abilitiesSlice,
  ui: uiSlice,
  profile: profileSlice,
  notifications: notificationSlice,
  buffs: buffSlice,
});

export type RootProducer = typeof producer;
export type RootState = InferState<RootProducer>;
