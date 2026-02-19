/**
 * tweenFill — Utility to smoothly tween a Frame's Size.X.Scale.
 *
 * Imperatively drives TweenService on an actual Frame instance.
 * Used via refs from React components after mount.
 */

import { TweenService } from '@rbxts/services';

/**
 * Tweens a frame's width (Size.X.Scale) to the given fraction.
 *
 * @param frame  The fill Frame instance.
 * @param targetFraction  Target fill (0–1).
 * @param duration  Tween duration in seconds.
 * @returns The Tween instance (can be cancelled).
 */
export function tweenFill(frame: Frame, targetFraction: number, duration: number): Tween {
  const goal = {
    Size: new UDim2(targetFraction, 0, 1, 0),
  };

  const tweenInfo = new TweenInfo(duration, Enum.EasingStyle.Quad, Enum.EasingDirection.Out);
  const tween = TweenService.Create(frame, tweenInfo, goal);
  tween.Play();
  return tween;
}
