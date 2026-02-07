import { Music } from './music';
import { SfxUi } from './sfx-ui';
import { SfxCombat } from './sfx-combat';
import { SfxFeedback } from './sfx-feedback';
import { VoicePenitentKnight } from './voice';

/**
 * AUDIO_CATALOG
 *
 * All audio assets organized by category.
 * Usage: AUDIO_CATALOG.SfxCombat.HitLight
 */
export const AUDIO_CATALOG = {
  Music,
  SfxUi,
  SfxCombat,
  SfxFeedback,
  VoicePenitentKnight,
} as const;

export type AudioCatalogKey = {
  [C in keyof typeof AUDIO_CATALOG]: keyof (typeof AUDIO_CATALOG)[C];
}[keyof typeof AUDIO_CATALOG];
