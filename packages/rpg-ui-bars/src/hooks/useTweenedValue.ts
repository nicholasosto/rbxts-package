/**
 * useTweenedValue — Smoothly interpolates a numeric value toward a target.
 *
 * Uses `RunService.RenderStepped` to lerp the returned value over `duration`
 * seconds whenever `target` changes. Useful for animating bar fills in React
 * without imperatively tweening Instance properties.
 *
 * @param target  The value to animate toward.
 * @param duration  How long (seconds) the interpolation takes.
 * @returns The current interpolated value.
 */

import React from '@rbxts/react';
import { RunService } from '@rbxts/services';

export function useTweenedValue(target: number, duration: number): number {
  const [display, setDisplay] = React.useState(target);

  // Refs to track animation state across renders
  const animRef = React.useRef({
    startValue: target,
    endValue: target,
    elapsed: 0,
    totalDuration: duration,
  });

  // When target changes, start a new animation from current display value
  React.useEffect(() => {
    const anim = animRef.current;
    anim.startValue = display;
    anim.endValue = target;
    anim.elapsed = 0;
    anim.totalDuration = duration;
  }, [target, duration]);

  React.useEffect(() => {
    const connection = RunService.RenderStepped.Connect((dt) => {
      const anim = animRef.current;
      if (anim.elapsed >= anim.totalDuration) return;

      anim.elapsed = math.min(anim.elapsed + dt, anim.totalDuration);
      const alpha = anim.totalDuration > 0 ? anim.elapsed / anim.totalDuration : 1;

      // Ease-out quad for a satisfying deceleration curve
      const eased = 1 - (1 - alpha) * (1 - alpha);
      const value = anim.startValue + (anim.endValue - anim.startValue) * eased;

      setDisplay(value);
    });

    return () => {
      connection.Disconnect();
    };
  }, []);

  return display;
}
