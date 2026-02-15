/**
 * ghostBar — Manages the trailing "ghost" fill that shows recent resource loss.
 *
 * When the fill fraction decreases, the ghost bar stays at the old value
 * for `ghostDelay` seconds, then fades out over `ghostFadeDuration` seconds.
 */

import { TweenService } from '@rbxts/services';

/**
 * Triggers the ghost bar animation on a decrease.
 *
 * @param ghostFrame   The ghost fill Frame instance.
 * @param oldFraction  The previous fill fraction (where ghost starts).
 * @param newFraction  The new (lower) fill fraction (where ghost ends).
 * @param ghostDelay   Seconds to hold at the old value before fading.
 * @param fadeDuration Seconds for the ghost to shrink to the new value.
 * @returns A cleanup function that cancels any pending tweens.
 */
export function triggerGhostBar(
  ghostFrame: Frame,
  oldFraction: number,
  newFraction: number,
  ghostDelay: number,
  fadeDuration: number,
): () => void {
  let cancelled = false;
  let fadeTween: Tween | undefined;

  // Immediately set ghost to old (larger) size and make visible
  ghostFrame.Size = new UDim2(oldFraction, 0, 1, 0);
  ghostFrame.BackgroundTransparency = 0;

  // After the delay, tween the ghost down to the new (smaller) size
  const delayThread = task.delay(ghostDelay, () => {
    if (cancelled) return;

    const goal = {
      Size: new UDim2(newFraction, 0, 1, 0),
      BackgroundTransparency: 0.6,
    };

    const tweenInfo = new TweenInfo(fadeDuration, Enum.EasingStyle.Quad, Enum.EasingDirection.Out);
    fadeTween = TweenService.Create(ghostFrame, tweenInfo, goal);
    fadeTween.Play();
  });

  return () => {
    cancelled = true;
    task.cancel(delayThread);
    fadeTween?.Cancel();
  };
}
