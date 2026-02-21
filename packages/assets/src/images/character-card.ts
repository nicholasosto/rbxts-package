import { type ImageAsset, asImageAsset } from '../types';

/** Image assets for the CharacterCard HUD component */
export const CharacterCardImages = {
  /** Wide metallic sci-fi HUD frame with angular right edge */
  CardFrame: asImageAsset('rbxassetid://138410821291232'),
  /** Square portrait border with blue LED strip and red indicator */
  PortraitBorder: asImageAsset('rbxassetid://92582520760630'),
  /** Horizontal nameplate banner with gold/copper trim */
  UsernameBanner: asImageAsset('rbxassetid://116140735194427'),
  /** Angular metallic badge frame for level display */
  LevelBadge: asImageAsset('rbxassetid://133034853319749'),
} as const satisfies Record<string, ImageAsset>;
