import { type ImageAsset, asImageAsset } from '../types';

/** Faction icons and banners */
export const FactionIcons = {
  CrimsonOrderIcon: asImageAsset('rbxassetid://126548450638488'),
  CrimsonOrderBanner: asImageAsset('rbxassetid://93210443286585'),
} as const satisfies Record<string, ImageAsset>;
