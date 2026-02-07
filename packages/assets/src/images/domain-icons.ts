import { ImageAsset, asImageAsset } from '../types';

/** Domain faction icons */
// TODO: Order and Void share the same ID — need unique assets
export const DomainIcons = {
  Chaos: asImageAsset('rbxassetid://80375133768026'),
  Order: asImageAsset('rbxassetid://134322739825066'),
  Void: asImageAsset('rbxassetid://134322739825066'),
} as const satisfies Record<string, ImageAsset>;
