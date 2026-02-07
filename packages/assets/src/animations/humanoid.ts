import { AnimationAsset, asAnimationAsset } from '../types';

/** Humanoid locomotion and idle animations */
export const Humanoid = {
  Idle01: asAnimationAsset('rbxassetid://104310542449113'),
  Walk: asAnimationAsset('rbxassetid://507777826'),
  Run: asAnimationAsset('rbxassetid://507767714'),
  FloatSlow: asAnimationAsset('rbxassetid://10921140719'),
  FloatFast: asAnimationAsset('rbxassetid://10921135644'),
} as const satisfies Record<string, AnimationAsset>;
