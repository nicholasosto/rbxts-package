import { ImageAsset, asImageAsset } from '../types';

/** Character attribute stat icons */
export const AttributeIcons = {
  Spirit: asImageAsset('rbxassetid://76174031397497'),
  Strength: asImageAsset('rbxassetid://127745571044516'),
  Agility: asImageAsset('rbxassetid://73893872719367'),
  Intelligence: asImageAsset('rbxassetid://107600003376684'),
  Vitality: asImageAsset('rbxassetid://121291227474039'),
  Luck: asImageAsset('rbxassetid://114767496083209'),
} as const satisfies Record<string, ImageAsset>;
