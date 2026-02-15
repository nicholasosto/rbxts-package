/**
 * damageFlash — Brief red flash + positional shake on the bar when damage is taken.
 */

import { TweenService } from '@rbxts/services';

/**
 * Plays a damage flash + shake on the bar container frame.
 *
 * 1. Briefly tints a flash overlay red (0.1s in, 0.15s out).
 * 2. Shakes the container by oscillating its Position offset.
 *
 * @param containerFrame  The outer bar Frame to shake.
 * @param flashFrame      An overlay Frame used for the red flash.
 * @param intensity       Max pixel offset for the shake.
 * @returns A cleanup function to cancel early.
 */
export function triggerDamageFlash(
  containerFrame: Frame,
  flashFrame: Frame,
  intensity: number,
): () => void {
  let cancelled = false;

  // ── Flash ──────────────────────────────────────────────
  flashFrame.BackgroundTransparency = 0.5;
  const flashOut = TweenService.Create(
    flashFrame,
    new TweenInfo(0.25, Enum.EasingStyle.Quad, Enum.EasingDirection.Out),
    { BackgroundTransparency: 1 },
  );
  flashOut.Play();

  // ── Shake ──────────────────────────────────────────────
  const originalPosition = containerFrame.Position;
  const shakeCount = 4;
  const shakeDuration = 0.05;

  const shakeThread = task.spawn(() => {
    for (let i = 0; i < shakeCount; i++) {
      if (cancelled) break;

      const offsetX = (math.random() - 0.5) * 2 * intensity;
      const offsetY = (math.random() - 0.5) * 2 * intensity;

      containerFrame.Position = new UDim2(
        originalPosition.X.Scale,
        originalPosition.X.Offset + offsetX,
        originalPosition.Y.Scale,
        originalPosition.Y.Offset + offsetY,
      );

      task.wait(shakeDuration);
    }

    // Restore original position
    if (!cancelled) {
      containerFrame.Position = originalPosition;
    }
  });

  return () => {
    cancelled = true;
    flashOut.Cancel();
    flashFrame.BackgroundTransparency = 1;
    containerFrame.Position = originalPosition;
    task.cancel(shakeThread);
  };
}
