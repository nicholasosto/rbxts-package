/**
 * SPRITESHEET_CATALOG
 *
 * Sprite sheet descriptors for flipbook-style animations.
 * Each entry contains the uploaded image asset ID and grid metadata.
 *
 * Populate entries as sprite sheets are generated, reviewed, and uploaded:
 *   1. Generate via AI prompt → saved to ~/GameDev/assets/images/sprite-sheets/
 *   2. Review image manually
 *   3. Upload via MCP upload-local-image → get rbxassetid://
 *   4. Add entry here with grid metadata
 */

import type { SpriteSheetDescriptor } from '../types';

export const SpriteSheets = {
  // Example entry (uncomment and fill after first upload):
  // KnightJumpingJacks: {
  //   image: asImageAsset("rbxassetid://000000"),
  //   imageSize: new Vector2(1536, 1024),
  //   frameSize: new Vector2(192, 256),
  //   rows: 4,
  //   columns: 8,
  //   frameCount: 32,
  // },
} as const satisfies Record<string, SpriteSheetDescriptor>;
