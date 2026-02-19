/**
 * CircularTimer — A radial countdown indicator using an ImageLabel
 * with a circular progress technique (UIGradient rotation).
 *
 * For simplicity this uses a square frame with a text countdown
 * and a circular border that "unwinds".
 */

import React from '@rbxts/react';
import { useTheme } from '../theme';

export interface CircularTimerProps {
  /** Remaining seconds. */
  remainingSeconds: number;
  /** Total seconds. */
  totalSeconds: number;
  /** Diameter in pixels. Default: 48. */
  diameter?: number;
  /** Fill color. */
  fillColor?: Color3;
  /** Whether to show the countdown number. Default: true. */
  showText?: boolean;
}

export function CircularTimer(props: CircularTimerProps): React.Element {
  const { remainingSeconds, totalSeconds, diameter = 48, fillColor, showText = true } = props;

  const theme = useTheme();
  const pct = totalSeconds > 0 ? math.clamp(remainingSeconds / totalSeconds, 0, 1) : 0;
  const color = fillColor ?? theme.timer.fillColor;
  const displaySecs = math.ceil(remainingSeconds);

  return (
    <frame
      key="CircularTimer"
      Size={UDim2.fromOffset(diameter, diameter)}
      BackgroundColor3={theme.timer.backgroundColor}
      BackgroundTransparency={0.2}
      BorderSizePixel={0}
    >
      <uicorner CornerRadius={new UDim(0.5, 0)} />

      {/* Fill overlay — uses transparency to represent remaining fraction */}
      <frame
        key="Fill"
        Size={UDim2.fromScale(1, 1)}
        BackgroundColor3={color}
        BackgroundTransparency={1 - pct * 0.6}
        BorderSizePixel={0}
      >
        <uicorner CornerRadius={new UDim(0.5, 0)} />
      </frame>

      {/* Border */}
      <uistroke Color={color} Thickness={3} Transparency={1 - pct} />

      {/* Countdown number */}
      {showText && (
        <textlabel
          key="Text"
          Size={UDim2.fromScale(1, 1)}
          BackgroundTransparency={1}
          Text={tostring(displaySecs)}
          TextColor3={theme.timer.textColor}
          TextSize={math.floor(diameter * 0.4)}
          Font={Enum.Font.GothamBold}
          ZIndex={3}
        />
      )}
    </frame>
  );
}
