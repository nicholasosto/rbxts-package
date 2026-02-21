import { AbilityIcons } from './ability-icons';
import { AttributeIcons } from './attribute-icons';
import { BeamTextures } from './beam-textures';
import { CharacterCardImages } from './character-card';
import { ClassIcons } from './class-icons';
import { CurrencyIcons } from './currency-icons';
import { DomainIcons } from './domain-icons';
import { EquipmentIcons } from './equipment-icons';
import { GemIcons } from './gem-icons';
import { ItemSlotIcons } from './item-slot-icons';
import { MenuPanelIcons } from './menu-panel-icons';
import { PanelBackgrounds } from './panel-backgrounds';
import { RarityFrames } from './rarity-frames';
import { Screens } from './screens';
import { SoulGemIcons } from './soul-gem-icons';
import { StatusIcons } from './status-icons';
import { Textures } from './textures';
import { UiControls } from './ui-controls';

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
  CharacterCardImages,
} as const;

export type ImageCatalogKey = {
  [C in keyof typeof IMAGE_CATALOG]: keyof (typeof IMAGE_CATALOG)[C];
}[keyof typeof IMAGE_CATALOG];
