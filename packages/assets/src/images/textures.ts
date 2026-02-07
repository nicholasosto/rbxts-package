import { ImageAsset, asImageAsset } from '../types';

/** Surface textures and tiling patterns */
export const Textures = {
  BoneDoily: asImageAsset('rbxassetid://108018297611555'),
  Mystical: asImageAsset('rbxassetid://108018297611556'),
  WavyMetal: asImageAsset('rbxassetid://99123505462124'),
} as const satisfies Record<string, ImageAsset>;
