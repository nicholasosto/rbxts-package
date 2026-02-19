/**
 * AbilitySlotButton — Single ability icon with cooldown overlay and hotkey label.
 *
 * @example
 * ```tsx
 * <AbilitySlotButton
 *   abilityId="fireball"
 *   iconImage="rbxassetid://12345"
 *   cooldownRemaining={2.5}
 *   cooldownTotal={8}
 *   isReady={false}
 *   hotkeyLabel="1"
 *   onActivate={() => print("Fireball!")}
 * />
 * ```
 */

import React from '@rbxts/react';
import { useTheme } from '../theme';
import { CooldownOverlay } from './CooldownOverlay';

export interface AbilitySlotButtonProps {
  /** Unique ability identifier. */
  abilityId: string;
  /** Icon image URI. */
  iconImage: string;
  /** Remaining cooldown in seconds. */
  cooldownRemaining: number;
  /** Total cooldown duration in seconds. */
  cooldownTotal: number;
  /** Whether the ability is ready. */
  isReady: boolean;
  /** Hotkey label (e.g. "1", "Q"). */
  hotkeyLabel?: string;
  /** Callback when the slot is activated. */
  onActivate?: () => void;
  /** Size override. Default: 48×48. */
  size?: UDim2;
  /** Layout order. */
  layoutOrder?: number;
}

export function AbilitySlotButton(props: AbilitySlotButtonProps): React.Element {
  const {
    iconImage,
    isReady,
    cooldownRemaining,
    cooldownTotal,
    hotkeyLabel,
    onActivate,
    size = UDim2.fromOffset(48, 48),
    layoutOrder,
  } = props;

  const theme = useTheme();

  return (
    <imagebutton
      key={`Slot_${props.abilityId}`}
      Size={size}
      Image={iconImage}
      ImageTransparency={isReady ? 0 : 0.4}
      BackgroundColor3={theme.actionBar.slotBackgroundColor}
      BackgroundTransparency={0.1}
      BorderSizePixel={0}
      LayoutOrder={layoutOrder}
      Event={{ Activated: () => isReady && onActivate?.() }}
    >
      <uicorner CornerRadius={theme.actionBar.cornerRadius} />
      <uistroke
        Color={isReady ? theme.actionBar.readyColor : theme.actionBar.slotBorderColor}
        Thickness={isReady ? 2 : 1}
      />

      {/* Cooldown overlay */}
      {!isReady && <CooldownOverlay remaining={cooldownRemaining} total={cooldownTotal} />}

      {/* Hotkey label */}
      {hotkeyLabel !== undefined && (
        <textlabel
          key="Hotkey"
          AnchorPoint={new Vector2(1, 0)}
          Position={new UDim2(1, -2, 0, 2)}
          Size={UDim2.fromOffset(16, 16)}
          BackgroundTransparency={1}
          Text={hotkeyLabel}
          TextColor3={theme.actionBar.hotkeyTextColor}
          TextSize={11}
          Font={Enum.Font.GothamBold}
          ZIndex={15}
        />
      )}
    </imagebutton>
  );
}
