import { ImageAsset, asImageAsset } from '../types';

/** Domain faction icons */
export const DomainIcons = {
  Chaos: asImageAsset('rbxassetid://80375133768026'),
  Order: asImageAsset('rbxassetid://134322739825066'),
  Void: asImageAsset('rbxassetid://79481461508185'),
} as const satisfies Record<string, ImageAsset>;
