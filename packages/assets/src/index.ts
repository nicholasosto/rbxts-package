/**
 * @nicholasosto/assets
 *
 * Central barrel export for all game assets, catalogs, and utilities.
 */

// Types
export {
  AssetUri,
  AnimationAsset,
  ImageAsset,
  AudioAsset,
  MeshAsset,
  asAnimationAsset,
  asImageAsset,
  asAudioAsset,
  asMeshAsset,
} from './types';

// Catalogs
export { ANIMATION_CATALOG } from './animations';
export { AUDIO_CATALOG } from './audio';
export { IMAGE_CATALOG } from './images';
export { RIG_CATALOG } from './rigs';
export { ACCESSORY_CATALOG } from './accessories';
export { PARTICLE_CATALOG } from './particles';

// Utilities
export { MathUtils } from './utilities/math-utils';
export { StringUtils } from './utilities/string-utils';
