/**
 * pulseGlow — Creates a repeating pulse/glow effect on a bar frame
 * that activates when the resource is critically low.
 */

import { TweenService } from '@rbxts/services';

/**
 * Starts a repeating pulse tween on the given glow overlay frame.
 * The overlay fades in and out at `pulseSpeed` cycles per second.
 *
 * @param glowFrame   An overlay Frame with the glow color, initially transparent.
 * @param pulseSpeed  Pulses per second (e.g. 2 = two full cycles/sec).
 * @returns A cleanup function that stops the pulse.
 */
export function startPulseGlow(glowFrame: Frame, pulseSpeed: number): () => void {
  // Duration of one half-cycle (fade in or fade out)
  const halfCycleDuration = 1 / (pulseSpeed * 2);

  const tweenInfo = new TweenInfo(
    halfCycleDuration,
    Enum.EasingStyle.Sine,
    Enum.EasingDirection.InOut,
    -1, // repeat forever
    true, // reverse
  );

  const tween = TweenService.Create(glowFrame, tweenInfo, {
    BackgroundTransparency: 0.4,
  });

  glowFrame.BackgroundTransparency = 1;
  tween.Play();

  return () => {
    tween.Cancel();
    glowFrame.BackgroundTransparency = 1;
  };
}
