/**
 * CooldownOverlay — Semi-transparent overlay showing remaining cooldown.
 *
 * Supports two modes:
 * 1. Default: vertical-wipe frame (shrinks top-down as cooldown expires).
 * 2. Spritesheet: when `sweepSheet` is provided, maps cooldown progress
 *    to sprite frames (frame 0 = full cooldown, last frame = ready).
 */

import React from '@rbxts/react';
import { useTheme } from '../theme';
import type { SpriteSheetDescriptor } from '../types';

export interface CooldownOverlayProps {
  /** Remaining cooldown seconds. */
  remaining: number;
  /** Total cooldown seconds. */
  total: number;
  /** Size override. Defaults to fill parent. */
  size?: UDim2;
  /** Optional sprite sheet for a radial/animated sweep effect. */
  sweepSheet?: SpriteSheetDescriptor;
}

export function CooldownOverlay(props: CooldownOverlayProps): React.Element {
  const { remaining, total, size = UDim2.fromScale(1, 1), sweepSheet } = props;
  const theme = useTheme();

  const fraction = total > 0 ? math.clamp(remaining / total, 0, 1) : 0;
  const displayText = remaining > 0 ? `${math.ceil(remaining)}` : '';

  // Spritesheet mode: map fraction → frame index (inverted: frame 0 = full, last = ready).
  if (sweepSheet !== undefined) {
    const frameIndex = math.clamp(
      math.floor((1 - fraction) * (sweepSheet.frameCount - 1)),
      0,
      sweepSheet.frameCount - 1,
    );
    const col = frameIndex % sweepSheet.columns;
    const row = math.floor(frameIndex / sweepSheet.columns);
    const rectOffset = new Vector2(col * sweepSheet.frameSize.X, row * sweepSheet.frameSize.Y);

    return (
      <frame
        key="CooldownOverlay"
        Size={size}
        BackgroundTransparency={1}
        BorderSizePixel={0}
        ZIndex={10}
      >
        <imagelabel
          key="SweepSheet"
          Size={UDim2.fromScale(1, 1)}
          Image={sweepSheet.image}
          ImageRectOffset={rectOffset}
          ImageRectSize={sweepSheet.frameSize}
          ImageTransparency={fraction > 0 ? 0 : 1}
          BackgroundTransparency={1}
          ScaleType={Enum.ScaleType.Stretch}
          ZIndex={11}
        />
        {remaining > 0 && (
          <textlabel
            key="CooldownText"
            Size={UDim2.fromScale(1, 1)}
            BackgroundTransparency={1}
            Text={displayText}
            TextColor3={Color3.fromRGB(255, 255, 255)}
            TextScaled={true}
            Font={Enum.Font.GothamBold}
            ZIndex={12}
          />
        )}
      </frame>
    );
  }

  // Default: vertical-wipe mode.
  return (
    <frame
      key="CooldownOverlay"
      Size={size}
      BackgroundColor3={theme.actionBar.cooldownOverlayColor}
      BackgroundTransparency={fraction > 0 ? theme.actionBar.cooldownOverlayTransparency : 1}
      BorderSizePixel={0}
      ZIndex={10}
    >
      {/* Cooldown fill — shrinks as cooldown expires */}
      <frame
        key="CooldownFill"
        Size={new UDim2(1, 0, fraction, 0)}
        AnchorPoint={new Vector2(0, 1)}
        Position={UDim2.fromScale(0, 1)}
        BackgroundColor3={theme.actionBar.cooldownOverlayColor}
        BackgroundTransparency={0.3}
        BorderSizePixel={0}
        ZIndex={11}
      />

      {/* Countdown text */}
      {remaining > 0 && (
        <textlabel
          key="CooldownText"
          Size={UDim2.fromScale(1, 1)}
          BackgroundTransparency={1}
          Text={displayText}
          TextColor3={Color3.fromRGB(255, 255, 255)}
          TextScaled={true}
          Font={Enum.Font.GothamBold}
          ZIndex={12}
        />
      )}
    </frame>
  );
}
