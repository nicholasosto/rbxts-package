/**
 * @nicholasosto/ultra-ui — Bars module
 *
 * Resource bars, level bars, and placement wrappers with
 * effects, theming, hooks, and presets.
 */

// ── Components ─────────────────────────────────────────────────────────────
export { LevelBar } from './components/LevelBar';
export { AboveHeadBar } from './components/placements/AboveHeadBar';
export { TopCenterBar } from './components/placements/TopCenterBar';
export { ResourceBar } from './components/ResourceBar';

// ── Hooks ──────────────────────────────────────────────────────────────────
export { useHumanoidHealth } from './hooks/useHumanoidHealth';
export { useTweenedValue } from './hooks/useTweenedValue';

// ── Types ──────────────────────────────────────────────────────────────────
export { BarPlacement, ResourceBarStyle } from './types';

export type {
  AboveHeadBarProps,
  BarEffectConfig,
  LevelBarProps,
  ResourceBarProps,
  ResourceBarTheme,
  TopCenterBarProps,
} from './types';

// ── Presets ────────────────────────────────────────────────────────────────
export {
  DEFAULT_EFFECTS,
  HEALTH_THEME,
  LEVEL_THEME,
  MANA_THEME,
  MENTAL_THEME,
  STAMINA_THEME,
  getThemeForStyle,
  mergeEffects,
  mergeTheme,
} from './presets';

// ── Effects (advanced / escape hatch) ──────────────────────────────────────
export { triggerDamageFlash } from './effects/damage-flash';
export { triggerGhostBar } from './effects/ghost-bar';
export { createBarParticles } from './effects/particles';
export type { BarParticleConfig } from './effects/particles';
export { startPulseGlow } from './effects/pulse-glow';
export { tweenFill } from './effects/tween-fill';
