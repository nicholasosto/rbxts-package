import { type ImageAsset, asImageAsset } from '../types';

/** Main menu panel navigation icons */
export const MenuPanelIcons = {
  Settings: asImageAsset('rbxassetid://122289639886993'),
  Inventory: asImageAsset('rbxassetid://132702292243603'),
  Quests: asImageAsset('rbxassetid://129030346503415'),
  Character: asImageAsset('rbxassetid://100274464430589'),
  Forge: asImageAsset('rbxassetid://116506062642047'),
  Shop: asImageAsset('rbxassetid://101998590177560'),
  Teleport: asImageAsset('rbxassetid://127118741571164'),
} as const satisfies Record<string, ImageAsset>;
