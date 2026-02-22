/**
 * @nicholasosto/assets
 *
 * Central barrel export for all game assets, catalogs, and utilities.
 */

// Types
export {
  AnimationAsset,
  AssetUri,
  AudioAsset,
  ImageAsset,
  MeshAsset,
  asAnimationAsset,
  asAudioAsset,
  asImageAsset,
  asMeshAsset,
} from './types';

// Catalogs
export { ACCESSORY_CATALOG } from './accessories';
export { ANIMATION_CATALOG } from './animations';
export { AUDIO_CATALOG } from './audio';
export { IMAGE_CATALOG } from './images';
export { PARTICLE_CATALOG } from './particles';
export { RIG_CATALOG, type RigFaction, type RigName } from './rigs';

// Utilities
export { MathUtils } from './utilities/math-utils';
export { StringUtils } from './utilities/string-utils';
