import { ImageAsset, asImageAsset } from '../types';

/** Rarity tier border frames */
export const RarityFrames = {
  CommonSet: asImageAsset('rbxassetid://85778039199330'),
  RareSet: asImageAsset('rbxassetid://82228066842612'),
  EpicSet: asImageAsset('rbxassetid://135166624307221'),
  LegendarySet: asImageAsset('rbxassetid://85570068018789'),
} as const satisfies Record<string, ImageAsset>;
