import { Weapons, BodyArmor, HeadAccessories } from './equipment';

/**
 * ACCESSORY_CATALOG
 *
 * All wearable/equippable accessories organized by slot.
 * Usage: ACCESSORY_CATALOG.Weapons.SleptSword.modelName
 */
export const ACCESSORY_CATALOG = {
  Weapons,
  BodyArmor,
  HeadAccessories,
} as const;

export type { AccessorySlot, AccessoryEntry } from './equipment';
