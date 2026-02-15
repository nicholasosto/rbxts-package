/**
 * @nicholasosto/rpg-ui-bars
 *
 * Prebuilt RPG resource bars & level/progress bars for Roblox-TS
 * with effects, theming, placement helpers, and a Humanoid health hook.
 */

// ── Components ─────────────────────────────────────────────────────────────
export { ResourceBar } from './components/ResourceBar';
export { LevelBar } from './components/LevelBar';
export { AboveHeadBar } from './components/placements/AboveHeadBar';
export { TopCenterBar } from './components/placements/TopCenterBar';

// ── Hooks ──────────────────────────────────────────────────────────────────
export { useHumanoidHealth } from './hooks/useHumanoidHealth';
export { useTweenedValue } from './hooks/useTweenedValue';

// ── Types ──────────────────────────────────────────────────────────────────
export { ResourceBarStyle, BarPlacement } from './types';

export type {
  ResourceBarTheme,
  BarEffectConfig,
  ResourceBarProps,
  LevelBarProps,
  AboveHeadBarProps,
  TopCenterBarProps,
} from './types';

// ── Presets ────────────────────────────────────────────────────────────────
export {
  HEALTH_THEME,
  MANA_THEME,
  STAMINA_THEME,
  MENTAL_THEME,
  LEVEL_THEME,
  DEFAULT_EFFECTS,
  getThemeForStyle,
  mergeTheme,
  mergeEffects,
} from './presets';

// ── Effects (advanced / escape hatch) ──────────────────────────────────────
export { tweenFill } from './effects/tween-fill';
export { triggerGhostBar } from './effects/ghost-bar';
export { startPulseGlow } from './effects/pulse-glow';
export { triggerDamageFlash } from './effects/damage-flash';
export { createBarParticles } from './effects/particles';
export type { BarParticleConfig } from './effects/particles';
