/**
 * CountdownBar — A horizontal bar that drains over time,
 * displaying a label and remaining time text.
 *
 * @example
 * ```tsx
 * <CountdownBar
 *   label="Respawn"
 *   remainingSeconds={5.3}
 *   totalSeconds={10}
 *   fillColor={Color3.fromRGB(60, 160, 255)}
 * />
 * ```
 */

import React from '@rbxts/react';
import { ProgressFill } from '../primitives';
import { useTheme } from '../theme';

export interface CountdownBarProps {
  /** Label displayed on the bar. */
  label?: string;
  /** Remaining seconds. */
  remainingSeconds: number;
  /** Total seconds (for fill %). */
  totalSeconds: number;
  /** Fill colour override. */
  fillColor?: Color3;
  /** Bar size. Default: 200×24. */
  size?: UDim2;
  /** Show the remaining time as text. Default: true. */
  showTime?: boolean;
}

/** Format seconds as "M:SS" or "S.s". */
function formatTime(seconds: number): string {
  if (seconds <= 0) return '0.0';
  if (seconds < 10) return `${math.floor(seconds * 10) / 10}`;
  const mins = math.floor(seconds / 60);
  const secs = math.floor(seconds % 60);
  return mins > 0 ? `${mins}:${secs < 10 ? '0' : ''}${secs}` : tostring(secs);
}

export function CountdownBar(props: CountdownBarProps): React.Element {
  const {
    label,
    remainingSeconds,
    totalSeconds,
    fillColor,
    size = UDim2.fromOffset(200, 24),
    showTime = true,
  } = props;

  const theme = useTheme();
  const pct = totalSeconds > 0 ? math.clamp(remainingSeconds / totalSeconds, 0, 1) : 0;
  const color = fillColor ?? theme.timer.fillColor;

  return (
    <frame
      key="CountdownBar"
      Size={size}
      BackgroundColor3={theme.timer.backgroundColor}
      BackgroundTransparency={0.3}
      BorderSizePixel={0}
    >
      <uicorner CornerRadius={new UDim(0, 4)} />

      <ProgressFill fraction={pct} fillColor={color} showGhost={false} />

      {/* Label */}
      {label !== undefined && (
        <textlabel
          key="Label"
          Size={UDim2.fromScale(1, 1)}
          BackgroundTransparency={1}
          Text={label}
          TextColor3={theme.timer.textColor}
          TextSize={13}
          Font={Enum.Font.GothamBold}
          TextXAlignment={Enum.TextXAlignment.Left}
          ZIndex={3}
        >
          <uipadding PaddingLeft={new UDim(0, 8)} />
        </textlabel>
      )}

      {/* Time */}
      {showTime && (
        <textlabel
          key="Time"
          Size={UDim2.fromScale(1, 1)}
          BackgroundTransparency={1}
          Text={formatTime(remainingSeconds)}
          TextColor3={theme.timer.textColor}
          TextSize={13}
          Font={Enum.Font.GothamBold}
          TextXAlignment={Enum.TextXAlignment.Right}
          ZIndex={3}
        >
          <uipadding PaddingRight={new UDim(0, 8)} />
        </textlabel>
      )}
    </frame>
  );
}
