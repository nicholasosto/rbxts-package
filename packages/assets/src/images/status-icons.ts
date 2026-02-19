import { type ImageAsset, asImageAsset } from '../types';

/** Status effect buff/debuff icons */
export const StatusIcons = {
  DarkEnergy: asImageAsset('rbxassetid://112790635225543'),
  LightEnergy: asImageAsset('rbxassetid://128191185980101'),
  Might: asImageAsset('rbxassetid://121141253261646'),
  Chill: asImageAsset('rbxassetid://106953131478004'),
  FlightChill: asImageAsset('rbxassetid://95573543624955'),
  Shattered: asImageAsset('rbxassetid://135235376575135'),
} as const satisfies Record<string, ImageAsset>;
