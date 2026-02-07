import { AnimationAsset, asAnimationAsset } from '../types';

/** Physical melee attack animations */
export const Melee = {
  BasicMelee01: asAnimationAsset('rbxassetid://16157509842'),
  BasicMelee02: asAnimationAsset('rbxassetid://16157364563'),
  BasicMelee03: asAnimationAsset('rbxassetid://16157497624'),
  BasicMelee04: asAnimationAsset('rbxassetid://16157516671'),
  WhipStrike: asAnimationAsset('rbxassetid://125608150014654'),
} as const satisfies Record<string, AnimationAsset>;
