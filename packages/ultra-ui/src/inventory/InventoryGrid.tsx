/**
 * InventoryGrid — Displays a grid of InventorySlots.
 *
 * @example
 * ```tsx
 * <InventoryGrid
 *   items={playerItems}
 *   columns={5}
 *   totalSlots={20}
 *   selectedItemId={selectedId}
 *   onSlotActivate={(item) => showTooltip(item)}
 * />
 * ```
 */

import React from '@rbxts/react';
import { InventorySlot } from './InventorySlot';
import type { InventoryItemData } from './types';

export interface InventoryGridProps {
  /** Array of items to display. */
  items: InventoryItemData[];
  /** Number of columns. Default: 5. */
  columns?: number;
  /** Total visible slot count (fills remainder with empty slots). Default: items.size(). */
  totalSlots?: number;
  /** Slot pixel size. Default: 64. */
  slotSize?: number;
  /** Gap between slots. Default: 6. */
  gap?: number;
  /** Currently selected item id. */
  selectedItemId?: string;
  /** Called when a slot is activated. */
  onSlotActivate?: (item: InventoryItemData) => void;
}

export function InventoryGrid(props: InventoryGridProps): React.Element {
  const {
    items,
    columns = 5,
    totalSlots,
    slotSize = 64,
    gap = 6,
    selectedItemId,
    onSlotActivate,
  } = props;

  const slotsToRender = totalSlots !== undefined ? totalSlots : items.size();

  const slots: React.Element[] = [];

  for (let i = 0; i < slotsToRender; i++) {
    const item = i < items.size() ? items[i] : undefined;
    slots.push(
      <InventorySlot
        key={`slot_${i}`}
        item={item}
        slotSize={slotSize}
        isSelected={item !== undefined && item.itemId === selectedItemId}
        onActivate={onSlotActivate}
      />,
    );
  }

  return (
    <frame key="InventoryGrid" Size={UDim2.fromScale(1, 1)} BackgroundTransparency={1}>
      <uigridlayout
        CellSize={UDim2.fromOffset(slotSize, slotSize)}
        CellPadding={UDim2.fromOffset(gap, gap)}
        FillDirection={Enum.FillDirection.Horizontal}
        FillDirectionMaxCells={columns}
        SortOrder={Enum.SortOrder.LayoutOrder}
        HorizontalAlignment={Enum.HorizontalAlignment.Center}
      />
      {slots}
    </frame>
  );
}
