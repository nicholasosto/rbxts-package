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

// --- Sprite Sheet Descriptor ---

/**
 * Describes a sprite sheet image for flipbook-style animations.
 * Used with `ImageRectOffset` / `ImageRectSize` in Roblox ImageLabels.
 */
export interface SpriteSheetDescriptor {
  /** The uploaded image asset ID. */
  image: ImageAsset;
  /** Total image dimensions in pixels. */
  imageSize: Vector2;
  /** Size of a single frame in pixels. */
  frameSize: Vector2;
  /** Number of rows in the grid. */
  rows: number;
  /** Number of columns in the grid. */
  columns: number;
  /** Total number of frames (may be less than rows * columns). */
  frameCount: number;
}

// --- Slice Frame Descriptor ---

/**
 * Describes a 9-slice image with its slice center coordinates.
 * The slice values represent pixel insets: { minX, minY, maxX, maxY }.
 */
export interface SliceFrameDescriptor {
  /** The uploaded image asset ID. */
  image: ImageAsset;
  /** Minimum X inset in pixels. */
  sliceMinX: number;
  /** Minimum Y inset in pixels. */
  sliceMinY: number;
  /** Maximum X inset in pixels (from left edge). */
  sliceMaxX: number;
  /** Maximum Y inset in pixels (from top edge). */
  sliceMaxY: number;
}
