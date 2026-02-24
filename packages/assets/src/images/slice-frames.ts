/**
 * SLICE_FRAME_CATALOG
 *
 * 9-slice frame descriptors for scalable UI backgrounds.
 * Each entry contains the uploaded image asset ID and slice center coordinates.
 *
 * Populate entries as slice frames are generated, reviewed, and uploaded:
 *   1. Generate via AI prompt → saved to ~/GameDev/assets/images/slice-frames/
 *   2. Review image manually
 *   3. Upload via MCP upload-local-image → get rbxassetid://
 *   4. Add entry here with slice insets
 *
 * Slice coordinates are pixel insets from the image edges:
 *   sliceMinX/Y = left/top inset (border width)
 *   sliceMaxX/Y = right/bottom boundary (image size - border width)
 *
 * For a 512x512 image with 64px borders: { sliceMinX: 64, sliceMinY: 64, sliceMaxX: 448, sliceMaxY: 448 }
 */

import type { SliceFrameDescriptor } from '../types';

/** Per-domain panel frame sliced images. */
export const SliceFrames = {
  // Domain panel frames — populate after AI generation & upload:
  // BloodPanelFrame: {
  //   image: asImageAsset("rbxassetid://000000"),
  //   sliceMinX: 64, sliceMinY: 64, sliceMaxX: 448, sliceMaxY: 448,
  // },
  // DecayPanelFrame: { ... },
  // SpiritPanelFrame: { ... },
  // RobotPanelFrame: { ... },
  // FatelessPanelFrame: { ... },
} as const satisfies Record<string, SliceFrameDescriptor>;
