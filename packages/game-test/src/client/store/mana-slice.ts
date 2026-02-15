import { createProducer } from '@rbxts/reflex';

export interface ManaState {
  current: number;
  max: number;
}

const initialState: ManaState = {
  current: 100,
  max: 100,
};

export const manaSlice = createProducer(initialState, {
  setMana: (state, current: number, max: number): ManaState => ({
    current: math.clamp(current, 0, max),
    max,
  }),
  spendMana: (state, amount: number): ManaState => ({
    current: math.clamp(state.current - amount, 0, state.max),
    max: state.max,
  }),
  restoreMana: (state, amount: number): ManaState => ({
    current: math.clamp(state.current + amount, 0, state.max),
    max: state.max,
  }),
});
