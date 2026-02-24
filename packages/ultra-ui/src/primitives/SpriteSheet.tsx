/**
 * SpriteSheet — Renders a flipbook-style sprite animation in an ImageLabel.
 *
 * Uses `useSpriteAnimation` internally. Provide a `SpriteSheetDescriptor`
 * (from @nicholasosto/assets) and playback options.
 *
 * @example
 * ```tsx
 * <SpriteSheet descriptor={SPRITESHEET_CATALOG.KnightJumpingJacks} fps={12} playing={true} looping={true} />
 * ```
 */

import React from '@rbxts/react';
import type { SpriteSheetDescriptor } from '../types';
import { useSpriteAnimation } from './useSpriteAnimation';

export interface SpriteSheetProps {
  /** Sprite sheet descriptor with image + grid metadata. */
  descriptor: SpriteSheetDescriptor;
  /** Frames per second. Default: 12. */
  fps?: number;
  /** Whether the animation is currently playing. Default: true. */
  playing?: boolean;
  /** Whether the animation loops. Default: true. */
  looping?: boolean;
  /** Callback when the last frame finishes (non-looping only). */
  onComplete?: () => void;
  /** Size of the component. Default: fills parent. */
  size?: UDim2;
  /** Position. */
  position?: UDim2;
  /** Anchor point. */
  anchorPoint?: Vector2;
  /** Image color tint. */
  imageColor?: Color3;
  /** Image transparency (0 = opaque). */
  imageTransparency?: number;
  /** ZIndex. */
  zIndex?: number;
}

export function SpriteSheet(props: SpriteSheetProps): React.Element {
  const {
    descriptor,
    fps = 12,
    playing = true,
    looping = true,
    onComplete,
    size = UDim2.fromScale(1, 1),
    position,
    anchorPoint,
    imageColor,
    imageTransparency = 0,
    zIndex,
  } = props;

  const anim = useSpriteAnimation({ descriptor, fps, playing, looping, onComplete });

  return (
    <imagelabel
      key="SpriteSheet"
      Size={size}
      Position={position}
      AnchorPoint={anchorPoint}
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
