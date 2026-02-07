import { AbilityIcons } from './ability-icons';
import { AttributeIcons } from './attribute-icons';
import { ClassIcons } from './class-icons';
import { CurrencyIcons } from './currency-icons';
import { DomainIcons } from './domain-icons';
import { ItemSlotIcons } from './item-slot-icons';
import { MenuPanelIcons } from './menu-panel-icons';
import { StatusIcons } from './status-icons';
import { GemIcons } from './gem-icons';
import { RarityFrames } from './rarity-frames';
import { PanelBackgrounds } from './panel-backgrounds';
import { UiControls } from './ui-controls';
import { Textures } from './textures';
import { BeamTextures } from './beam-textures';
import { Screens } from './screens';
import { EquipmentIcons } from './equipment-icons';
import { SoulGemIcons } from './soul-gem-icons';

/**
 * IMAGE_CATALOG
 *
 * All image assets organized by category.
 * Usage: IMAGE_CATALOG.AbilityIcons.Fireball
 */
export const IMAGE_CATALOG = {
  AbilityIcons,
  AttributeIcons,
  ClassIcons,
  CurrencyIcons,
  DomainIcons,
  ItemSlotIcons,
  MenuPanelIcons,
  StatusIcons,
  GemIcons,
  RarityFrames,
  PanelBackgrounds,
  UiControls,
  Textures,
  BeamTextures,
  Screens,
  EquipmentIcons,
  SoulGemIcons,
} as const;

export type ImageCatalogKey = {
  [C in keyof typeof IMAGE_CATALOG]: keyof (typeof IMAGE_CATALOG)[C];
}[keyof typeof IMAGE_CATALOG];
