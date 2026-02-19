/**
 * ActionBar — Horizontal row of ability slots.
 *
 * @example
 * ```tsx
 * <ActionBar
 *   abilities={abilitySlots}
 *   slotCount={6}
 *   onActivate={(abilityId) => print(`Activate: ${abilityId}`)}
 * />
 * ```
 */

import React from '@rbxts/react';
import { useTheme } from '../theme';
import { AbilitySlotButton } from './AbilitySlotButton';
import { type AbilitySlotData } from './types';

export interface ActionBarProps {
  /** Array of ability slot data. */
  abilities: AbilitySlotData[];
  /** Max number of visible slots. Default: 6. */
  slotCount?: number;
  /** Callback when an ability slot is activated. */
  onActivate?: (abilityId: string) => void;
  /** Slot size. Default: 48×48. */
  slotSize?: UDim2;
  /** Gap between slots in pixels. Default: 6. */
  gap?: number;
  /** Size override for the entire bar. */
  size?: UDim2;
  /** Position override. */
  position?: UDim2;
  /** Anchor point. */
  anchorPoint?: Vector2;
}

export function ActionBar(props: ActionBarProps): React.Element {
  const {
    abilities,
    slotCount = 6,
    onActivate,
    slotSize = UDim2.fromOffset(48, 48),
    gap = 6,
    size,
    position = UDim2.fromScale(0.5, 0.95),
    anchorPoint = new Vector2(0.5, 1),
  } = props;

  const theme = useTheme();

  // Build slot array with empty placeholders for unfilled positions
  const filledSlots: AbilitySlotData[] = [];
  const emptyIndices: number[] = [];
  for (let i = 0; i < slotCount; i++) {
    if (i < abilities.size()) {
      filledSlots.push(abilities[i]);
    } else {
      emptyIndices.push(i);
    }
  }

  const barSize =
    size ??
    new UDim2(0, slotCount * (slotSize.X.Offset + gap) - gap + 12, 0, slotSize.Y.Offset + 12);

  return (
    <frame
      key="ActionBar"
      AnchorPoint={anchorPoint}
      Position={position}
      Size={barSize}
      BackgroundColor3={theme.panel.backgroundColor}
      BackgroundTransparency={0.3}
      BorderSizePixel={0}
    >
      <uicorner CornerRadius={new UDim(0, 8)} />
      <uistroke Color={theme.panel.borderColor} Thickness={1} />
      <uipadding
        PaddingLeft={new UDim(0, 6)}
        PaddingRight={new UDim(0, 6)}
        PaddingTop={new UDim(0, 6)}
        PaddingBottom={new UDim(0, 6)}
      />
      <uilistlayout
        FillDirection={Enum.FillDirection.Horizontal}
        HorizontalAlignment={Enum.HorizontalAlignment.Center}
        VerticalAlignment={Enum.VerticalAlignment.Center}
        Padding={new UDim(0, gap)}
      />

      {filledSlots.map((slot, i) => (
        <AbilitySlotButton
          key={`ability_${i}`}
          abilityId={slot.abilityId}
          iconImage={slot.iconImage}
          cooldownRemaining={slot.cooldownRemaining}
          cooldownTotal={slot.cooldownTotal}
          isReady={slot.isReady}
          hotkeyLabel={slot.hotkeyLabel ?? `${i + 1}`}
          onActivate={() => onActivate?.(slot.abilityId)}
          size={slotSize}
          layoutOrder={i}
        />
      ))}

      {/* Empty slot placeholders */}
      {emptyIndices.map((idx) => (
        <frame
          key={`empty_${idx}`}
          Size={slotSize}
          BackgroundColor3={theme.actionBar.slotBackgroundColor}
          BackgroundTransparency={0.5}
          BorderSizePixel={0}
          LayoutOrder={idx}
        >
          <uicorner CornerRadius={theme.actionBar.cornerRadius} />
          <uistroke Color={theme.actionBar.slotBorderColor} Thickness={1} Transparency={0.5} />
        </frame>
      ))}
    </frame>
  );
}
