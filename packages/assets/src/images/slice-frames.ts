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
 * For a 1024x1024 image with 128px borders:
 *   { sliceMinX: 128, sliceMinY: 128, sliceMaxX: 896, sliceMaxY: 896 }
 *
 * Local files: ~/GameDev/assets/images/slice-frames/Slice Frame - {Domain} {Panel|Title Bar}.png
 */

import { type SliceFrameDescriptor, asImageAsset } from '../types';

/** Standard 128px border insets for 1024x1024 domain frames. */
const DOMAIN_SLICE = { sliceMinX: 128, sliceMinY: 128, sliceMaxX: 896, sliceMaxY: 896 } as const;

/** Per-domain panel frame and title bar sliced images. */
export const SliceFrames = {
  // ── Blood Domain ───────────────────────────────────────────────────
  // Local: "Slice Frame - Blood Panel.png" / "Slice Frame - Blood Title Bar.png"
  // TODO: Replace placeholder IDs after Roblox upload
  BloodPanelFrame: { image: asImageAsset('rbxassetid://0'), ...DOMAIN_SLICE },
  BloodTitleBar: { image: asImageAsset('rbxassetid://0'), ...DOMAIN_SLICE },

  // ── Decay Domain ───────────────────────────────────────────────────
  // Local: "Slice Frame - Decay Panel.png" / "Slice Frame - Decay Title Bar.png"
  DecayPanelFrame: { image: asImageAsset('rbxassetid://0'), ...DOMAIN_SLICE },
  DecayTitleBar: { image: asImageAsset('rbxassetid://0'), ...DOMAIN_SLICE },

  // ── Spirit Domain ──────────────────────────────────────────────────
  // Local: "Slice Frame - Spirit Panel.png" / "Slice Frame - Spirit Title Bar.png"
  SpiritPanelFrame: { image: asImageAsset('rbxassetid://0'), ...DOMAIN_SLICE },
  SpiritTitleBar: { image: asImageAsset('rbxassetid://0'), ...DOMAIN_SLICE },

  // ── Robot Domain ───────────────────────────────────────────────────
  // Local: "Slice Frame - Robot Panel.png" / "Slice Frame - Robot Title Bar.png"
  RobotPanelFrame: { image: asImageAsset('rbxassetid://120438321019486'), ...DOMAIN_SLICE },
  RobotTitleBar: { image: asImageAsset('rbxassetid://81675775872733'), ...DOMAIN_SLICE },

  // ── Fateless Domain ────────────────────────────────────────────────
  // Local: "Slice Frame - Fateless Panel.png" / "Slice Frame - Fateless Title Bar.png"
  FatelessPanelFrame: { image: asImageAsset('rbxassetid://0'), ...DOMAIN_SLICE },
  FatelessTitleBar: { image: asImageAsset('rbxassetid://0'), ...DOMAIN_SLICE },
} as const satisfies Record<string, SliceFrameDescriptor>;
