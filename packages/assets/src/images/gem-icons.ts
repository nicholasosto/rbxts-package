import { ImageAsset, asImageAsset } from '../types';

/** Soul gem icons */
export const GemIcons = {
  Colorable: asImageAsset('rbxassetid://71842732472075'),
  Epic: asImageAsset('rbxassetid://119000054151103'),
} as const satisfies Record<string, ImageAsset>;
