/**
 * EquipmentPaper — A "paper-doll" style equipment display with named slots
 * arranged around a character silhouette.
 *
 * Each slot type (Helmet, Armor, Weapon, Accessory) is rendered as an
 * InventorySlot positioned at a fixed location.
 */

import React from '@rbxts/react';
import { useTheme } from '../theme';
import { InventorySlot } from './InventorySlot';
import type { EquipmentSlotId, InventoryItemData } from './types';

/** Map of equipment slot id → equipped item (or undefined if empty). */
export type EquipmentMap = Partial<Record<EquipmentSlotId, InventoryItemData>>;

export interface EquipmentPaperProps {
  /** Currently equipped items keyed by slot id. */
  equipment: EquipmentMap;
  /** Slot pixel size. Default: 64. */
  slotSize?: number;
  /** Overall widget size. Default: 260×320. */
  size?: UDim2;
  /** Called when an equipment slot is activated. */
  onSlotActivate?: (item: InventoryItemData) => void;
}

interface SlotLayout {
  id: EquipmentSlotId;
  label: string;
  position: UDim2;
}

const SLOT_LAYOUT: SlotLayout[] = [
  { id: 'Helmet', label: 'Helmet', position: new UDim2(0.5, 0, 0, 12) },
  { id: 'Armor', label: 'Armor', position: new UDim2(0.5, 0, 0.35, 0) },
  { id: 'Weapon', label: 'Weapon', position: new UDim2(0.1, 0, 0.5, 0) },
  { id: 'Accessory', label: 'Accessory', position: new UDim2(0.9, 0, 0.5, 0) },
];

export function EquipmentPaper(props: EquipmentPaperProps): React.Element {
  const { equipment, slotSize = 64, size = UDim2.fromOffset(260, 320), onSlotActivate } = props;

  const theme = useTheme();

  return (
    <frame
      key="EquipmentPaper"
      Size={size}
      BackgroundColor3={theme.panel.backgroundColor}
      BackgroundTransparency={theme.panel.backgroundTransparency}
      BorderSizePixel={0}
    >
      <uicorner CornerRadius={theme.panel.cornerRadius} />
      <uistroke Color={theme.panel.borderColor} Thickness={theme.panel.borderThickness} />

      {/* Title */}
      <textlabel
        key="Title"
        Position={new UDim2(0, 0, 0, -24)}
        Size={new UDim2(1, 0, 0, 22)}
        BackgroundTransparency={1}
        Text="Equipment"
        TextColor3={theme.panel.titleTextColor}
        TextSize={16}
        Font={Enum.Font.GothamBold}
        TextXAlignment={Enum.TextXAlignment.Center}
      />

      {/* Slots */}
      {SLOT_LAYOUT.map((layout) => {
        const item = equipment[layout.id];
        return (
          <frame
            key={layout.id}
            AnchorPoint={new Vector2(0.5, 0)}
            Position={layout.position}
            Size={UDim2.fromOffset(slotSize, slotSize + 18)}
            BackgroundTransparency={1}
          >
            <InventorySlot item={item} slotSize={slotSize} onActivate={onSlotActivate} />
            <textlabel
              key="Label"
              Position={new UDim2(0, 0, 1, -16)}
              Size={new UDim2(1, 0, 0, 14)}
              BackgroundTransparency={1}
              Text={layout.label}
              TextColor3={theme.textColor}
              TextSize={11}
              Font={Enum.Font.GothamMedium}
              TextXAlignment={Enum.TextXAlignment.Center}
            />
          </frame>
        );
      })}
    </frame>
  );
}
