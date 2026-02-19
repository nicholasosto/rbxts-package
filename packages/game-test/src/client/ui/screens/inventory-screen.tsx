import {
  EquipmentPaper,
  InventoryGrid,
  TabContainer,
  type EquipmentMap,
  type EquipmentSlotId,
  type InventoryItemData,
  type ItemRarity,
} from '@nicholasosto/ultra-ui';
import React, { useEffect, useState } from '@rbxts/react';
import { useSelector } from '@rbxts/react-reflex';
import { selectEquipment, selectInventory, selectIsInventoryOpen } from '../../store';
import { useRootProducer } from '../hooks';
import { scaffold } from '../scaffold';

/**
 * Map the player-data rarity string to ultra-ui ItemRarity.
 */
function mapRarity(rarity: string): ItemRarity {
  const lookup: Record<string, ItemRarity> = {
    common: 'Common',
    uncommon: 'Uncommon',
    rare: 'Rare',
    epic: 'Epic',
    legendary: 'Legendary',
  };
  return lookup[rarity] ?? 'Common';
}

/**
 * InventoryScreen — Panel-based inventory with grid + equipment views.
 *
 * Uses ultra-ui Panel, TabContainer, InventoryGrid, and EquipmentPaper.
 */
export function InventoryScreen(): React.Element {
  const isOpen = useSelector(selectIsInventoryOpen);
  const inventory = useSelector(selectInventory);
  const equipment = useSelector(selectEquipment);
  const { toggleInventory } = useRootProducer();
  const [selectedItemId, setSelectedItemId] = useState<string | undefined>(undefined);

  // Sync scaffold frame visibility with store state
  useEffect(() => {
    scaffold.gameplay.inventoryFrame.Visible = isOpen;
  }, [isOpen]);

  // Convert player-data InventoryItem[] → ultra-ui InventoryItemData[]
  const gridItems: InventoryItemData[] = inventory.map((item) => ({
    itemId: item.itemId,
    displayName: item.displayName,
    iconImage: '', // Asset images not populated yet — will show empty slots
    rarity: mapRarity(item.rarity),
    quantity: item.quantity,
    equipSlot: undefined,
    description: item.category,
  }));

  // Build equipment record for EquipmentPaper
  const slotMapping: Record<string, EquipmentSlotId> = {
    mainHand: 'Weapon',
    helmet: 'Helmet',
    chest: 'Armor',
    accessory: 'Accessory',
  };
  const equippedItems: EquipmentMap = {};
  for (const [slotName, itemId] of pairs(equipment)) {
    if (itemId !== undefined) {
      const mappedSlot = slotMapping[slotName as string];
      if (mappedSlot) {
        const item = inventory.find((i) => i.itemId === itemId);
        if (item) {
          equippedItems[mappedSlot] = {
            itemId: item.itemId,
            displayName: item.displayName,
            iconImage: '',
            rarity: mapRarity(item.rarity),
            quantity: 1,
          };
        }
      }
    }
  }

  const tabs = [
    {
      label: 'Items',
      content: (
        <InventoryGrid
          items={gridItems}
          columns={5}
          totalSlots={20}
          selectedItemId={selectedItemId}
          onSlotActivate={(item) => setSelectedItemId(item.itemId)}
        />
      ),
    },
    {
      label: 'Equipment',
      content: (
        <EquipmentPaper
          equipment={equippedItems}
          onSlotActivate={(item) => print(`[Inventory] Equipment slot: ${item.displayName}`)}
        />
      ),
    },
  ];

  return (
    <TabContainer
      title="Inventory"
      tabs={tabs}
      isOpen={isOpen}
      onClose={() => toggleInventory()}
      size={UDim2.fromScale(0.5, 0.65)}
      position={UDim2.fromScale(0.5, 0.5)}
    />
  );
}
