/**
 * Toast — A single notification banner with accent stripe, icon, and dismiss timer.
 */

import React from '@rbxts/react';
import { useTheme } from '../theme';
import type { NotificationSeverity } from './types';

const SEVERITY_COLORS: Record<NotificationSeverity, Color3> = {
  info: Color3.fromRGB(60, 150, 255),
  success: Color3.fromRGB(40, 200, 80),
  warning: Color3.fromRGB(255, 190, 40),
  error: Color3.fromRGB(230, 55, 55),
};

export interface ToastProps {
  /** Notification message. */
  message: string;
  /** Severity. */
  severity: NotificationSeverity;
  /** Optional icon asset id. */
  icon?: string;
  /** Called when the user clicks dismiss or timer expires. */
  onDismiss?: () => void;
}

export function Toast(props: ToastProps): React.Element {
  const { message, severity, icon, onDismiss } = props;
  const theme = useTheme();
  const accentColor = SEVERITY_COLORS[severity];

  return (
    <frame
      key="Toast"
      Size={new UDim2(1, 0, 0, 44)}
      BackgroundColor3={theme.notification.backgroundColor}
      BackgroundTransparency={theme.notification.backgroundTransparency}
      BorderSizePixel={0}
    >
      <uicorner CornerRadius={new UDim(0, 6)} />

      {/* Left accent stripe */}
      <frame
        key="Accent"
        Size={new UDim2(0, 4, 1, 0)}
        BackgroundColor3={accentColor}
        BorderSizePixel={0}
      >
        <uicorner CornerRadius={new UDim(0, 6)} />
      </frame>

      {/* Icon */}
      {icon !== undefined && (
        <imagelabel
          key="Icon"
          Position={new UDim2(0, 12, 0.5, 0)}
          AnchorPoint={new Vector2(0, 0.5)}
          Size={UDim2.fromOffset(24, 24)}
          BackgroundTransparency={1}
          Image={icon}
          ImageColor3={accentColor}
          ScaleType={Enum.ScaleType.Fit}
        />
      )}

      {/* Message text */}
      <textlabel
        key="Message"
        Position={new UDim2(0, icon !== undefined ? 44 : 16, 0, 0)}
        Size={new UDim2(1, icon !== undefined ? -80 : -52, 1, 0)}
        BackgroundTransparency={1}
        Text={message}
        TextColor3={theme.notification.textColor}
        TextSize={14}
        Font={Enum.Font.GothamMedium}
        TextXAlignment={Enum.TextXAlignment.Left}
        TextYAlignment={Enum.TextYAlignment.Center}
        TextWrapped={true}
        TextTruncate={Enum.TextTruncate.AtEnd}
      />

      {/* Dismiss button */}
      {onDismiss !== undefined && (
        <textbutton
          key="Dismiss"
          AnchorPoint={new Vector2(1, 0.5)}
          Position={new UDim2(1, -8, 0.5, 0)}
          Size={UDim2.fromOffset(24, 24)}
          BackgroundTransparency={1}
          Text="✕"
          TextColor3={Color3.fromRGB(180, 180, 180)}
          TextSize={16}
          Font={Enum.Font.GothamBold}
          Event={{ Activated: () => onDismiss() }}
        />
      )}
    </frame>
  );
}
