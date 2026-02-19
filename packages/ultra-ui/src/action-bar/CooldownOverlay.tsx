/**
 * CooldownOverlay — Radial sweep overlay showing remaining cooldown.
 *
 * Renders as a semi-transparent overlay with a countdown text.
 * The sweep is simulated using transparency animation on a frame.
 */

import React from '@rbxts/react';
import { useTheme } from '../theme';

export interface CooldownOverlayProps {
  /** Remaining cooldown seconds. */
  remaining: number;
  /** Total cooldown seconds. */
  total: number;
  /** Size override. Defaults to fill parent. */
  size?: UDim2;
}

export function CooldownOverlay(props: CooldownOverlayProps): React.Element {
  const { remaining, total, size = UDim2.fromScale(1, 1) } = props;
  const theme = useTheme();

  const fraction = total > 0 ? math.clamp(remaining / total, 0, 1) : 0;
  const displayText = remaining > 0 ? `${math.ceil(remaining)}` : '';

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
