import { ImageAsset, asImageAsset } from '../types';

/** Equipment slot placeholder icons */
export const ItemSlotIcons = {
  Unassigned: asImageAsset('rbxassetid://98384046526938'),
  Helmet: asImageAsset('rbxassetid://124443221759409'),
  Armor: asImageAsset('rbxassetid://127400433082189'),
  Weapon: asImageAsset('rbxassetid://84241490307717'),
  Accessory: asImageAsset('rbxassetid://131561781044540'),
} as const satisfies Record<string, ImageAsset>;
