import { createProducer } from '@rbxts/reflex';
import type { AbilitySlot } from '@nicholasosto/combat-stats';

export interface AbilitiesState {
  slots: AbilitySlot[];
}

const initialState: AbilitiesState = {
  slots: [],
};

export const abilitiesSlice = createProducer(initialState, {
  setAbilities: (state, slots: AbilitySlot[]): AbilitiesState => ({
    slots,
  }),
  setCooldown: (state, index: number, remaining: number): AbilitiesState => {
    const nextSlots: AbilitySlot[] = [];
    for (let i = 0; i < state.slots.size(); i++) {
      if (i === index) {
        nextSlots.push({
          abilityId: state.slots[i].abilityId,
          displayName: state.slots[i].displayName,
          iconImage: state.slots[i].iconImage,
          cooldownRemaining: remaining,
          isReady: remaining <= 0,
        });
      } else {
        nextSlots.push(state.slots[i]);
      }
    }
    return { slots: nextSlots };
  },
});
