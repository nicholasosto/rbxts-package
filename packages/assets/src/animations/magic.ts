import { type AnimationAsset, asAnimationAsset } from '../types';

/** Magic cast, projectile, and AOE animations */
export const Magic = {
  CastHallowHold: asAnimationAsset('rbxassetid://125099220628366'),
  CastAutobot: asAnimationAsset('rbxassetid://139880766788985'),
  CastExtendedSwipe: asAnimationAsset('rbxassetid://77799116860007'),
  ChargeEnergy: asAnimationAsset('rbxassetid://15197187926'),
  Earthquake: asAnimationAsset('rbxassetid://85312184260537'),
  CastProjectile: asAnimationAsset('rbxassetid://72830464857270'),
  CastSummon: asAnimationAsset('rbxassetid://91240355559085'),
  CastAoeFromAbove: asAnimationAsset('rbxassetid://140479956568725'),
} as const satisfies Record<string, AnimationAsset>;
