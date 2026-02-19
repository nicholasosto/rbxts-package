import { type ImageAsset, asImageAsset } from '../types';

/** Domain-themed panel background images */
export const PanelBackgrounds = {
  Chaos: asImageAsset('rbxassetid://84301389774700'),
  Void: asImageAsset('rbxassetid://129286641336578'),
  Order: asImageAsset('rbxassetid://84630369308490'),
} as const satisfies Record<string, ImageAsset>;
