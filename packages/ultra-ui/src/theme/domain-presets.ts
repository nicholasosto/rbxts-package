/**
 * @nicholasosto/ultra-ui — Domain-specific theme presets
 *
 * Each Soul Steel domain gets a distinct visual identity.
 * These themes extend DARK_THEME with domain-specific colors.
 * When 9-slice panel frame images are uploaded, add the optional
 * `backgroundImage` / `backgroundSliceCenter` fields to each.
 *
 * Domains: blood, decay, spirit, robot, fateless
 *
 * 9-slice wiring: After uploading domain slice frames to Roblox,
 * replace rbxassetid://0 in SliceFrames catalog, then uncomment
 * the backgroundImage / titleBarImage lines below.
 */

import { DARK_THEME } from './presets';
import { type UltraTheme } from './types';

// import { SliceFrames } from '@nicholasosto/assets';
// const DOMAIN_SLICE_CENTER = new Rect(128, 128, 896, 896);

// ─── Blood Domain ──────────────────────────────────────────────────────────
// Crimson thorns, dark red, arterial glow.

export const BLOOD_THEME: UltraTheme = {
  ...DARK_THEME,
  panel: {
    ...DARK_THEME.panel,
    backgroundColor: Color3.fromRGB(40, 10, 10),
    titleBarColor: Color3.fromRGB(60, 15, 15),
    borderColor: Color3.fromRGB(160, 30, 30),
    titleTextColor: Color3.fromRGB(255, 180, 180),
    // backgroundImage: SliceFrames.BloodPanelFrame.image,
    // backgroundSliceCenter: DOMAIN_SLICE_CENTER,
    // titleBarImage: SliceFrames.BloodTitleBar.image,
    // titleBarSliceCenter: DOMAIN_SLICE_CENTER,
  },
  bar: {
    ...DARK_THEME.bar,
    fillColor: Color3.fromRGB(180, 20, 20),
    glowColor: Color3.fromRGB(255, 40, 40),
  },
  actionBar: {
    ...DARK_THEME.actionBar,
    slotBorderColor: Color3.fromRGB(140, 30, 30),
  },
};

// ─── Decay Domain ──────────────────────────────────────────────────────────
// Cracked earth, sickly green, necrotic energy.

export const DECAY_THEME: UltraTheme = {
  ...DARK_THEME,
  panel: {
    ...DARK_THEME.panel,
    backgroundColor: Color3.fromRGB(15, 30, 10),
    titleBarColor: Color3.fromRGB(20, 45, 15),
    borderColor: Color3.fromRGB(80, 140, 40),
    titleTextColor: Color3.fromRGB(200, 255, 180),
    // backgroundImage: SliceFrames.DecayPanelFrame.image,
    // backgroundSliceCenter: DOMAIN_SLICE_CENTER,
    // titleBarImage: SliceFrames.DecayTitleBar.image,
    // titleBarSliceCenter: DOMAIN_SLICE_CENTER,
  },
  bar: {
    ...DARK_THEME.bar,
    fillColor: Color3.fromRGB(80, 160, 30),
    glowColor: Color3.fromRGB(120, 200, 50),
  },
  actionBar: {
    ...DARK_THEME.actionBar,
    slotBorderColor: Color3.fromRGB(70, 120, 30),
  },
};

// ─── Spirit Domain ─────────────────────────────────────────────────────────
// Ethereal blue-white, ghostly glow, translucent.

export const SPIRIT_THEME: UltraTheme = {
  ...DARK_THEME,
  panel: {
    ...DARK_THEME.panel,
    backgroundColor: Color3.fromRGB(10, 15, 40),
    backgroundTransparency: 0.15,
    titleBarColor: Color3.fromRGB(15, 25, 60),
    borderColor: Color3.fromRGB(80, 120, 220),
    titleTextColor: Color3.fromRGB(200, 220, 255),
    // backgroundImage: SliceFrames.SpiritPanelFrame.image,
    // backgroundSliceCenter: DOMAIN_SLICE_CENTER,
    // titleBarImage: SliceFrames.SpiritTitleBar.image,
    // titleBarSliceCenter: DOMAIN_SLICE_CENTER,
  },
  bar: {
    ...DARK_THEME.bar,
    fillColor: Color3.fromRGB(60, 120, 240),
    glowColor: Color3.fromRGB(100, 160, 255),
  },
  actionBar: {
    ...DARK_THEME.actionBar,
    slotBorderColor: Color3.fromRGB(60, 100, 200),
  },
};

// ─── Robot Domain ──────────────────────────────────────────────────────────
// Chrome circuitry, electric cyan, industrial.

export const ROBOT_THEME: UltraTheme = {
  ...DARK_THEME,
  panel: {
    ...DARK_THEME.panel,
    backgroundColor: Color3.fromRGB(20, 22, 25),
    titleBarColor: Color3.fromRGB(30, 35, 40),
    borderColor: Color3.fromRGB(0, 200, 220),
    titleTextColor: Color3.fromRGB(0, 240, 255),
    // backgroundImage: SliceFrames.RobotPanelFrame.image,
    // backgroundSliceCenter: DOMAIN_SLICE_CENTER,
    // titleBarImage: SliceFrames.RobotTitleBar.image,
    // titleBarSliceCenter: DOMAIN_SLICE_CENTER,
  },
  bar: {
    ...DARK_THEME.bar,
    fillColor: Color3.fromRGB(0, 200, 220),
    glowColor: Color3.fromRGB(0, 240, 255),
  },
  actionBar: {
    ...DARK_THEME.actionBar,
    slotBorderColor: Color3.fromRGB(0, 180, 200),
  },
};

// ─── Fateless Domain ───────────────────────────────────────────────────────
// Void purple, cosmic, enigmatic.

export const FATELESS_THEME: UltraTheme = {
  ...DARK_THEME,
  panel: {
    ...DARK_THEME.panel,
    backgroundColor: Color3.fromRGB(20, 10, 35),
    titleBarColor: Color3.fromRGB(30, 15, 50),
    borderColor: Color3.fromRGB(140, 60, 200),
    titleTextColor: Color3.fromRGB(220, 180, 255),
    // backgroundImage: SliceFrames.FatelessPanelFrame.image,
    // backgroundSliceCenter: DOMAIN_SLICE_CENTER,
    // titleBarImage: SliceFrames.FatelessTitleBar.image,
    // titleBarSliceCenter: DOMAIN_SLICE_CENTER,
  },
  bar: {
    ...DARK_THEME.bar,
    fillColor: Color3.fromRGB(140, 60, 200),
    glowColor: Color3.fromRGB(180, 100, 255),
  },
  actionBar: {
    ...DARK_THEME.actionBar,
    slotBorderColor: Color3.fromRGB(120, 50, 180),
  },
};
