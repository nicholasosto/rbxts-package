import { AnimationAsset, asAnimationAsset } from '../types';

/** Combat reaction and dodge animations */
export const Combat = {
  DodgeSmall: asAnimationAsset('rbxassetid://15487656295'),
  DodgeLarge: asAnimationAsset('rbxassetid://15547518905'),
  TakeDamage01: asAnimationAsset('rbxassetid://16158676664'),
} as const satisfies Record<string, AnimationAsset>;
