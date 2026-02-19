import { type AudioAsset, asAudioAsset } from '../types';

/** Player feedback sound effects */
export const SfxFeedback = {
  LevelUp: asAudioAsset('rbxassetid://135831492234192'),
  ItemPickup: asAudioAsset('rbxassetid://135831492234192'),
  Error: asAudioAsset('rbxassetid://131912667805687'),
} as const satisfies Record<string, AudioAsset>;
