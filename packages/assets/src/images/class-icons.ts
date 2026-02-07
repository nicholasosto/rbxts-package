import { ImageAsset, asImageAsset } from '../types';

/** Player class icons */
export const ClassIcons = {
  Warrior: asImageAsset('rbxassetid://115888614111404'),
  Mage: asImageAsset('rbxassetid://137115253994988'),
  Rogue: asImageAsset('rbxassetid://114675020831306'),
  Cleric: asImageAsset('rbxassetid://90530068222238'),
} as const satisfies Record<string, ImageAsset>;
