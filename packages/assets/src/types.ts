/**
 * @nicholasosto/assets
 *
 * Branded asset URI types and helper functions for compile-time safety.
 * Prevents accidentally passing an animation ID where an image ID is expected.
 */

/** Base asset URI format */
export type AssetUri = `rbxassetid://${number}`;

/** Branded animation asset */
export type AnimationAsset = AssetUri & { readonly __brand: 'AnimationAsset' };

/** Branded image asset */
export type ImageAsset = AssetUri & { readonly __brand: 'ImageAsset' };

/** Branded audio asset */
export type AudioAsset = AssetUri & { readonly __brand: 'AudioAsset' };

/** Branded mesh asset */
export type MeshAsset = AssetUri & { readonly __brand: 'MeshAsset' };

// --- Helper casting functions ---

export function asAnimationAsset(id: AssetUri): AnimationAsset {
  return id as AnimationAsset;
}

export function asImageAsset(id: AssetUri): ImageAsset {
  return id as ImageAsset;
}

export function asAudioAsset(id: AssetUri): AudioAsset {
  return id as AudioAsset;
}

export function asMeshAsset(id: AssetUri): MeshAsset {
  return id as MeshAsset;
}
