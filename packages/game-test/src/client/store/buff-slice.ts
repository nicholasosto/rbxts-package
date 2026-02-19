import { createProducer } from '@rbxts/reflex';

/** A buff/debuff tracked in the HUD. */
export interface BuffEntry {
  id: string;
  displayName: string;
  iconImage: string;
  remainingSeconds: number;
  totalSeconds: number;
  isDebuff?: boolean;
  stacks?: number;
}

export interface BuffState {
  buffs: BuffEntry[];
}

const initialState: BuffState = {
  buffs: [],
};

export const buffSlice = createProducer(initialState, {
  /** Add or refresh a buff. If it already exists, update its remaining time. */
  addBuff: (state, buff: BuffEntry): BuffState => {
    const existing = state.buffs.filter((b) => b.id !== buff.id);
    return { buffs: [...existing, buff] };
  },

  /** Remove a buff by id. */
  removeBuff: (state, id: string): BuffState => ({
    buffs: state.buffs.filter((b) => b.id !== id),
  }),

  /** Tick all buffs down by deltaSeconds, remove expired ones. */
  tickBuffs: (state, deltaSeconds: number): BuffState => ({
    buffs: state.buffs
      .map((b) => ({
        ...b,
        remainingSeconds: b.remainingSeconds - deltaSeconds,
      }))
      .filter((b) => b.remainingSeconds > 0),
  }),

  /** Clear all buffs. */
  clearBuffs: (): BuffState => ({
    buffs: [],
  }),
});
