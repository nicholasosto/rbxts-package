/**
 * AnimatedBorder — Renders a looping sprite sheet as a border/overlay effect.
 *
 * Useful for: animated shimmer on legendary items, pulsing glow on active
 * ability slots, ambient domain-themed flair on panels.
 *
 * Positions itself as a full-size overlay on its parent (with optional padding).
 * The sprite sheet plays behind or above content depending on `zIndex`.
 *
 * @example
 * ```tsx
 * <frame Size={UDim2.fromOffset(200, 200)}>
 *   <AnimatedBorder descriptor={SPRITESHEET_CATALOG.ShimmerBorder} fps={8} />
 *   <textlabel Text="Legendary!" />
 * </frame>
 * ```
 */

import React from '@rbxts/react';
import type { SpriteSheetDescriptor } from '../types';
import { useSpriteAnimation } from './useSpriteAnimation';

export interface AnimatedBorderProps {
  /** Sprite sheet descriptor for the border animation. */
  descriptor: SpriteSheetDescriptor;
  /** Frames per second. Default: 8. */
  fps?: number;
  /** Whether the animation is playing. Default: true. */
  playing?: boolean;
  /** Image color tint. */
  imageColor?: Color3;
  /** Image transparency (0 = opaque). Default: 0. */
  imageTransparency?: number;
  /** Padding in pixels between border and content. Default: 0. */
  padding?: number;
  /** ZIndex. Default: 0 (behind content). */
  zIndex?: number;
}

export function AnimatedBorder(props: AnimatedBorderProps): React.Element {
  const {
    descriptor,
    fps = 8,
    playing = true,
    imageColor,
    imageTransparency = 0,
    padding = 0,
    zIndex = 0,
  } = props;

  const anim = useSpriteAnimation({ descriptor, fps, playing, looping: true });

  return (
    <imagelabel
      key="AnimatedBorder"
      Size={new UDim2(1, padding * 2, 1, padding * 2)}
      Position={UDim2.fromScale(0.5, 0.5)}
      AnchorPoint={new Vector2(0.5, 0.5)}
      Image={descriptor.image}
      ImageRectOffset={anim.rectOffset}
      ImageRectSize={anim.rectSize}
      ImageColor3={imageColor}
      ImageTransparency={imageTransparency}
      BackgroundTransparency={1}
      ScaleType={Enum.ScaleType.Stretch}
      ZIndex={zIndex}
    />
  );
}
