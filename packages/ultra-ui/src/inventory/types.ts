/**
 * Inventory types.
 */

/** Rarity levels mirroring the Tooltip rarity. */
export type ItemRarity = 'Common' | 'Uncommon' | 'Rare' | 'Epic' | 'Legendary';

/** Equipment slot identifiers. */
export type EquipmentSlotId = 'Helmet' | 'Armor' | 'Weapon' | 'Accessory';

/** An item that can occupy an inventory or equipment slot. */
export interface InventoryItemData {
  /** Unique item instance id. */
  itemId: string;
  /** Display name. */
  displayName: string;
  /** Roblox asset id string for the item icon. */
  iconImage: string;
  /** Item rarity. */
  rarity: ItemRarity;
  /** Stack count (1 for unstackable). */
  quantity: number;
  /** Optional equipment slot this item can fill. */
  equipSlot?: EquipmentSlotId;
  /** Optional stat description lines for tooltip. */
  stats?: string[];
  /** Optional description/flavor text. */
  description?: string;
}
