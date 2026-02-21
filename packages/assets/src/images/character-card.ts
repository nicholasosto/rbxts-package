import { type ImageAsset, asImageAsset } from '../types';

/** Image assets for the CharacterCard HUD component */
export const CharacterCardImages = {
  /** Wide metallic sci-fi HUD frame with angular edges */
  CardFrame: asImageAsset('rbxassetid://113565347585990'),
  /** Square portrait border with blue LED strip accent */
  PortraitBorder: asImageAsset('rbxassetid://89132910467794'),
  /** Horizontal nameplate banner with gold/copper trim */
  UsernameBanner: asImageAsset('rbxassetid://123800454254824'),
  /** Angular metallic badge frame for level display */
  LevelBadge: asImageAsset('rbxassetid://126474240603682'),
} as const satisfies Record<string, ImageAsset>;
