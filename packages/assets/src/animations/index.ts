import { Humanoid } from './humanoid';
import { Melee } from './melee';
import { Magic } from './magic';
import { Combat } from './combat';

/**
 * ANIMATION_CATALOG
 *
 * All animation assets organized by category.
 * Usage: ANIMATION_CATALOG.Melee.BasicMelee01
 */
export const ANIMATION_CATALOG = {
  Humanoid,
  Melee,
  Magic,
  Combat,
} as const;

export type AnimationCatalogKey = {
  [C in keyof typeof ANIMATION_CATALOG]: keyof (typeof ANIMATION_CATALOG)[C];
}[keyof typeof ANIMATION_CATALOG];
