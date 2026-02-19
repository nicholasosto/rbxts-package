import { type AudioAsset, asAudioAsset } from '../types';

/** UI interaction sound effects */
export const SfxUi = {
  ButtonClick: asAudioAsset('rbxassetid://75822150781541'),
  PanelOpen: asAudioAsset('rbxassetid://83030444600776'),
  PanelClose: asAudioAsset('rbxassetid://83030444600776'),
} as const satisfies Record<string, AudioAsset>;
