/**
 * InventorySlot — A single inventory cell that shows an item icon,
 * rarity border, and stack quantity badge.
 */

import React from '@rbxts/react';
import { useTheme } from '../theme';
import type { InventoryItemData, ItemRarity } from './types';

const RARITY_COLORS: Record<ItemRarity, Color3> = {
  Common: Color3.fromRGB(180, 180, 180),
  Uncommon: Color3.fromRGB(30, 200, 70),
  Rare: Color3.fromRGB(40, 120, 255),
  Epic: Color3.fromRGB(180, 60, 255),
  Legendary: Color3.fromRGB(255, 170, 0),
};

export interface InventorySlotProps {
  /** Item occupying this slot (undefined = empty). */
  item?: InventoryItemData;
  /** Slot pixel size. Default: 64. */
  slotSize?: number;
  /** Whether this slot is currently selected / highlighted. */
  isSelected?: boolean;
  /** Called when the slot is clicked. */
  onActivate?: (item: InventoryItemData) => void;
}

export function InventorySlot(props: InventorySlotProps): React.Element {
  const { item, slotSize = 64, isSelected = false, onActivate } = props;
  const theme = useTheme();

  const borderColor =
    item !== undefined ? RARITY_COLORS[item.rarity] : theme.inventory.slotBorderColor;
  const bgColor = theme.inventory.slotBackgroundColor;

  return (
    <textbutton
      key="InventorySlot"
      Size={UDim2.fromOffset(slotSize, slotSize)}
      BackgroundColor3={bgColor}
      BackgroundTransparency={0.15}
      Text=""
      BorderSizePixel={0}
      Event={{
        Activated: () => {
          if (item !== undefined && onActivate !== undefined) {
            onActivate(item);
          }
        },
      }}
    >
      <uicorner CornerRadius={new UDim(0, 6)} />
      <uistroke
        Color={isSelected ? Color3.fromRGB(255, 255, 100) : borderColor}
        Thickness={isSelected ? 3 : 2}
      />

      {/* Item icon */}
      {item !== undefined && (
        <imagelabel
          key="Icon"
          AnchorPoint={new Vector2(0.5, 0.5)}
          Position={UDim2.fromScale(0.5, 0.5)}
          Size={UDim2.fromOffset(slotSize - 14, slotSize - 14)}
          BackgroundTransparency={1}
          Image={item.iconImage}
          ScaleType={Enum.ScaleType.Fit}
        />
      )}

      {/* Quantity badge */}
      {item !== undefined && item.quantity > 1 && (
        <textlabel
          key="Quantity"
          AnchorPoint={new Vector2(1, 1)}
          Position={new UDim2(1, -3, 1, -2)}
          Size={UDim2.fromOffset(24, 16)}
          BackgroundColor3={Color3.fromRGB(0, 0, 0)}
          BackgroundTransparency={0.3}
          Text={tostring(item.quantity)}
          TextColor3={Color3.fromRGB(255, 255, 255)}
          TextSize={11}
          Font={Enum.Font.GothamBold}
          TextXAlignment={Enum.TextXAlignment.Right}
          BorderSizePixel={0}
        >
          <uicorner CornerRadius={new UDim(0, 4)} />
        </textlabel>
      )}
    </textbutton>
  );
}
