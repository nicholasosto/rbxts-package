/**
 * useSpriteAnimation — Drives sprite sheet frame-by-frame playback.
 *
 * Returns the current `ImageRectOffset` and `ImageRectSize` values to apply
 * on an `<imagelabel>`. Internally ticks via `RunService.Heartbeat`.
 *
 * @example
 * ```tsx
 * const anim = useSpriteAnimation({ descriptor: sheet, fps: 12, playing: true, looping: true });
 * <imagelabel Image={sheet.image} ImageRectOffset={anim.rectOffset} ImageRectSize={anim.rectSize} />
 * ```
 */

import React from '@rbxts/react';
import { RunService } from '@rbxts/services';
import type { SpriteSheetDescriptor } from '../types';

export interface SpriteAnimationOptions {
  /** Sprite sheet descriptor with grid metadata. */
  descriptor: SpriteSheetDescriptor;
  /** Frames per second. Default: 12. */
  fps?: number;
  /** Whether the animation is currently playing. Default: true. */
  playing?: boolean;
  /** Whether the animation loops. Default: true. */
  looping?: boolean;
  /** Optional callback when the last frame finishes (non-looping). */
  onComplete?: () => void;
}

export interface SpriteAnimationResult {
  /** Current ImageRectOffset to set on the ImageLabel. */
  rectOffset: Vector2;
  /** ImageRectSize (constant — equals descriptor.frameSize). */
  rectSize: Vector2;
  /** Current frame index (0-based). */
  frame: number;
}

export function useSpriteAnimation(options: SpriteAnimationOptions): SpriteAnimationResult {
  const { descriptor, fps = 12, playing = true, looping = true, onComplete } = options;

  const [frame, setFrame] = React.useState(0);
  const accumulatorRef = React.useRef(0);
  const onCompleteRef = React.useRef(onComplete);

  // Keep onComplete ref in sync without triggering effect reruns.
  onCompleteRef.current = onComplete;

  React.useEffect(() => {
    if (!playing) return undefined;

    const secondsPerFrame = 1 / math.max(fps, 1);
    accumulatorRef.current = 0;

    const connection = RunService.Heartbeat.Connect((dt: number) => {
      accumulatorRef.current += dt;

      if (accumulatorRef.current >= secondsPerFrame) {
        const framesToAdvance = math.floor(accumulatorRef.current / secondsPerFrame);
        accumulatorRef.current -= framesToAdvance * secondsPerFrame;

        setFrame((prev: number) => {
          let nextFrame = prev + framesToAdvance;

          if (nextFrame >= descriptor.frameCount) {
            if (looping) {
              nextFrame = nextFrame % descriptor.frameCount;
            } else {
              nextFrame = descriptor.frameCount - 1;
              task.defer(() => onCompleteRef.current?.());
            }
          }

          return nextFrame;
        });
      }
    });

    return () => connection.Disconnect();
  }, [playing, fps, descriptor.frameCount, looping]);

  // Compute offset from frame index.
  const col = frame % descriptor.columns;
  const row = math.floor(frame / descriptor.columns);
  const rectOffset = new Vector2(col * descriptor.frameSize.X, row * descriptor.frameSize.Y);

  return {
    rectOffset,
    rectSize: descriptor.frameSize,
    frame,
  };
}
