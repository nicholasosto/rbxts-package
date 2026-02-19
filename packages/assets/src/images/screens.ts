import { type ImageAsset, asImageAsset } from '../types';

/** Full-screen UI images */
export const Screens = {
  Loading: asImageAsset('rbxassetid://70565375536693'),
  GameTitle: asImageAsset('rbxassetid://83079804672155'),
} as const satisfies Record<string, ImageAsset>;
