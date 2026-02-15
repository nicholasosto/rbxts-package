import { createProducer } from '@rbxts/reflex';

export interface HealthState {
  current: number;
  max: number;
}

const initialState: HealthState = {
  current: 100,
  max: 100,
};

export const healthSlice = createProducer(initialState, {
  setHealth: (state, current: number, max: number): HealthState => ({
    current: math.clamp(current, 0, max),
    max,
  }),
  takeDamage: (state, amount: number): HealthState => ({
    current: math.clamp(state.current - amount, 0, state.max),
    max: state.max,
  }),
  heal: (state, amount: number): HealthState => ({
    current: math.clamp(state.current + amount, 0, state.max),
    max: state.max,
  }),
  setMaxHealth: (state, max: number): HealthState => ({
    current: math.clamp(state.current, 0, max),
    max,
  }),
});
