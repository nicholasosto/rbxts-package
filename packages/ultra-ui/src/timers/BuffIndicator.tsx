/**
 * BuffIndicator — A single buff/debuff icon with remaining-time overlay.
 */

import React from '@rbxts/react';
import { useTheme } from '../theme';
import type { BuffData } from './types';

export interface BuffIndicatorProps {
  /** Buff data. */
  buff: BuffData;
  /** Icon size. Default: 36. */
  iconSize?: number;
}

export function BuffIndicator(props: BuffIndicatorProps): React.Element {
  const { buff, iconSize = 36 } = props;
  const theme = useTheme();

  const pct =
    buff.totalSeconds > 0 ? math.clamp(buff.remainingSeconds / buff.totalSeconds, 0, 1) : 0;
  const borderColor = buff.isDebuff === true ? Color3.fromRGB(220, 50, 50) : theme.timer.fillColor;

  return (
    <frame
      key={buff.id}
      Size={UDim2.fromOffset(iconSize, iconSize)}
      BackgroundColor3={Color3.fromRGB(20, 20, 25)}
      BackgroundTransparency={0.2}
      BorderSizePixel={0}
    >
      <uicorner CornerRadius={new UDim(0, 4)} />
      <uistroke Color={borderColor} Thickness={2} />

      {/* Icon */}
      <imagelabel
        key="Icon"
        Size={UDim2.fromScale(1, 1)}
        BackgroundTransparency={1}
        Image={buff.iconImage}
        ScaleType={Enum.ScaleType.Fit}
      />

      {/* Cooldown sweep overlay (drains top-down) */}
      <frame
        key="Sweep"
        AnchorPoint={new Vector2(0, 0)}
        Position={UDim2.fromScale(0, 0)}
        Size={new UDim2(1, 0, 1 - pct, 0)}
        BackgroundColor3={Color3.fromRGB(0, 0, 0)}
        BackgroundTransparency={0.4}
        BorderSizePixel={0}
        ZIndex={2}
      >
        <uicorner CornerRadius={new UDim(0, 4)} />
      </frame>

      {/* Remaining seconds */}
      <textlabel
        key="Timer"
        AnchorPoint={new Vector2(0.5, 1)}
        Position={new UDim2(0.5, 0, 1, -1)}
        Size={new UDim2(1, 0, 0, 12)}
        BackgroundTransparency={1}
        Text={tostring(math.ceil(buff.remainingSeconds))}
        TextColor3={Color3.fromRGB(255, 255, 255)}
        TextSize={10}
        Font={Enum.Font.GothamBold}
        TextStrokeTransparency={0.5}
        TextStrokeColor3={Color3.fromRGB(0, 0, 0)}
        ZIndex={3}
      />

      {/* Stack badge */}
      {buff.stacks !== undefined && buff.stacks > 1 && (
        <textlabel
          key="Stacks"
          AnchorPoint={new Vector2(1, 1)}
          Position={new UDim2(1, -1, 1, -1)}
          Size={UDim2.fromOffset(16, 12)}
          BackgroundColor3={Color3.fromRGB(0, 0, 0)}
          BackgroundTransparency={0.3}
          Text={tostring(buff.stacks)}
          TextColor3={Color3.fromRGB(255, 255, 100)}
          TextSize={10}
          Font={Enum.Font.GothamBold}
          BorderSizePixel={0}
          ZIndex={3}
        >
          <uicorner CornerRadius={new UDim(0, 3)} />
        </textlabel>
      )}
    </frame>
  );
}
