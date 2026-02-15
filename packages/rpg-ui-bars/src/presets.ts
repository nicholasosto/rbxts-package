/**
 * @nicholasosto/rpg-ui-bars — Preset themes & default effect config
 */

import { ResourceBarStyle, ResourceBarTheme, BarEffectConfig } from './types';

// ─── Preset Themes ─────────────────────────────────────────────────────────

/** Health bar — green fill, red at low HP, warm ghost trail. */
export const HEALTH_THEME: ResourceBarTheme = {
  fillColor: Color3.fromRGB(0, 200, 80),
  lowFillColor: Color3.fromRGB(220, 40, 40),
  backgroundColor: Color3.fromRGB(30, 30, 30),
  ghostColor: Color3.fromRGB(255, 100, 100),
  glowColor: Color3.fromRGB(255, 60, 60),
  textColor: Color3.fromRGB(255, 255, 255),
  lowThreshold: 0.25,
};

/** Mana bar — blue/purple fill, dim at low mana. */
export const MANA_THEME: ResourceBarTheme = {
  fillColor: Color3.fromRGB(60, 120, 255),
  lowFillColor: Color3.fromRGB(100, 60, 180),
  backgroundColor: Color3.fromRGB(20, 20, 40),
  ghostColor: Color3.fromRGB(120, 160, 255),
  glowColor: Color3.fromRGB(80, 100, 255),
  textColor: Color3.fromRGB(220, 230, 255),
  lowThreshold: 0.2,
};

/** Stamina bar — yellow/amber fill, orange at low stamina. */
export const STAMINA_THEME: ResourceBarTheme = {
  fillColor: Color3.fromRGB(240, 200, 40),
  lowFillColor: Color3.fromRGB(220, 140, 20),
  backgroundColor: Color3.fromRGB(35, 30, 15),
  ghostColor: Color3.fromRGB(255, 220, 100),
  glowColor: Color3.fromRGB(255, 180, 40),
  textColor: Color3.fromRGB(255, 255, 230),
  lowThreshold: 0.2,
};

/** Mental bar — teal/cyan fill, gray at low mental. */
export const MENTAL_THEME: ResourceBarTheme = {
  fillColor: Color3.fromRGB(60, 220, 200),
  lowFillColor: Color3.fromRGB(100, 120, 120),
  backgroundColor: Color3.fromRGB(20, 35, 35),
  ghostColor: Color3.fromRGB(120, 240, 220),
  glowColor: Color3.fromRGB(80, 255, 230),
  textColor: Color3.fromRGB(230, 255, 255),
  lowThreshold: 0.2,
};

/** Level / XP bar — gold fill, white ghost. */
export const LEVEL_THEME: ResourceBarTheme = {
  fillColor: Color3.fromRGB(255, 215, 0),
  lowFillColor: Color3.fromRGB(180, 150, 40),
  backgroundColor: Color3.fromRGB(30, 25, 10),
  ghostColor: Color3.fromRGB(255, 240, 160),
  glowColor: Color3.fromRGB(255, 230, 80),
  textColor: Color3.fromRGB(255, 255, 255),
  lowThreshold: 0, // never "low" on XP
};

// ─── Theme Lookup ──────────────────────────────────────────────────────────

const STYLE_THEMES: Record<ResourceBarStyle, ResourceBarTheme> = {
  [ResourceBarStyle.Health]: HEALTH_THEME,
  [ResourceBarStyle.Mana]: MANA_THEME,
  [ResourceBarStyle.Stamina]: STAMINA_THEME,
  [ResourceBarStyle.Mental]: MENTAL_THEME,
  [ResourceBarStyle.Custom]: HEALTH_THEME, // fallback
};

/** Returns the preset theme for a given style enum value. */
export function getThemeForStyle(style: ResourceBarStyle): ResourceBarTheme {
  return STYLE_THEMES[style];
}

/**
 * Merges a base theme with optional partial overrides.
 * Returns a new complete ResourceBarTheme.
 */
export function mergeTheme(
  base: ResourceBarTheme,
  overrides?: Partial<ResourceBarTheme>,
): ResourceBarTheme {
  if (!overrides) return base;
  return {
    fillColor: overrides.fillColor ?? base.fillColor,
    lowFillColor: overrides.lowFillColor ?? base.lowFillColor,
    backgroundColor: overrides.backgroundColor ?? base.backgroundColor,
    ghostColor: overrides.ghostColor ?? base.ghostColor,
    glowColor: overrides.glowColor ?? base.glowColor,
    textColor: overrides.textColor ?? base.textColor,
    lowThreshold: overrides.lowThreshold ?? base.lowThreshold,
  };
}

// ─── Default Effect Configuration ──────────────────────────────────────────

/** Sensible defaults — all effects enabled. */
export const DEFAULT_EFFECTS: BarEffectConfig = {
  tweenDuration: 0.3,
  ghostDelay: 0.4,
  ghostFadeDuration: 0.8,
  pulseSpeed: 2,
  shakeIntensity: 4,
  particlesEnabled: true,
};

/**
 * Merges the default effect config with optional partial overrides.
 * Returns a new complete BarEffectConfig.
 */
export function mergeEffects(overrides?: Partial<BarEffectConfig>): BarEffectConfig {
  if (!overrides) return DEFAULT_EFFECTS;
  return {
    tweenDuration: overrides.tweenDuration ?? DEFAULT_EFFECTS.tweenDuration,
    ghostDelay: overrides.ghostDelay ?? DEFAULT_EFFECTS.ghostDelay,
    ghostFadeDuration: overrides.ghostFadeDuration ?? DEFAULT_EFFECTS.ghostFadeDuration,
    pulseSpeed: overrides.pulseSpeed ?? DEFAULT_EFFECTS.pulseSpeed,
    shakeIntensity: overrides.shakeIntensity ?? DEFAULT_EFFECTS.shakeIntensity,
    particlesEnabled: overrides.particlesEnabled ?? DEFAULT_EFFECTS.particlesEnabled,
  };
}
