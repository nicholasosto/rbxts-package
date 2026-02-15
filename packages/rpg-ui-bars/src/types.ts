/**
 * @nicholasosto/rpg-ui-bars — Type definitions
 *
 * Standalone types: no dependency on combat-stats or assets.
 * Consumers pass raw numeric values and optional theme overrides.
 */

// ─── Enums ─────────────────────────────────────────────────────────────────

/** Predefined resource bar visual styles with matching color themes. */
export enum ResourceBarStyle {
  Health = 'Health',
  Mana = 'Mana',
  Stamina = 'Stamina',
  Mental = 'Mental',
  Custom = 'Custom',
}

/** Where the bar should render in the world / on screen. */
export enum BarPlacement {
  /** Default — the bar is placed wherever its parent positions it. */
  Inline = 'Inline',
  /** Renders inside a BillboardGui above a character model (mobs). */
  AboveHead = 'AboveHead',
  /** Fixed HUD position at top-center of the screen (bosses). */
  TopCenter = 'TopCenter',
}

// ─── Theme / Config Interfaces ─────────────────────────────────────────────

/** Full color & appearance theme for a resource bar. */
export interface ResourceBarTheme {
  /** Primary fill color when above the low threshold. */
  fillColor: Color3;
  /** Fill color when current/max falls below `lowThreshold`. */
  lowFillColor: Color3;
  /** Background (empty portion) color. */
  backgroundColor: Color3;
  /** Color of the trailing "ghost" fill that shows recent loss. */
  ghostColor: Color3;
  /** Glow / pulse overlay color used at low health. */
  glowColor: Color3;
  /** Text label color. */
  textColor: Color3;
  /** Fraction (0–1) below which low-health effects activate. */
  lowThreshold: number;
}

/** Configuration knobs for bar visual effects. */
export interface BarEffectConfig {
  /** How long (seconds) the fill tween takes. */
  tweenDuration: number;
  /** Seconds to wait before the ghost bar starts fading. */
  ghostDelay: number;
  /** How long (seconds) the ghost bar fade lasts. */
  ghostFadeDuration: number;
  /** Pulses per second when in the low-threshold zone. */
  pulseSpeed: number;
  /** Pixel offset magnitude for the damage-shake effect. */
  shakeIntensity: number;
  /** Whether particle / sparkle effects are enabled. */
  particlesEnabled: boolean;
}

// ─── Component Props ───────────────────────────────────────────────────────

/** Props for the core `<ResourceBar>` component. */
export interface ResourceBarProps {
  /** Current resource value. */
  current: number;
  /** Maximum resource value. */
  max: number;
  /** Predefined style — selects a matching theme preset. Default: Health. */
  style?: ResourceBarStyle;
  /** Partial theme overrides merged on top of the style preset. */
  theme?: Partial<ResourceBarTheme>;
  /** Partial effect config overrides merged on top of defaults. */
  effects?: Partial<BarEffectConfig>;
  /** Optional text label (e.g. "HP", "Mana"). Empty string hides label. */
  label?: string;
  /** Whether to display the "current / max" text. Default: true. */
  showText?: boolean;
  /** Size override. Default: UDim2.fromScale(0.3, 0.04). */
  size?: UDim2;
}

/** Props for the `<LevelBar>` component. */
export interface LevelBarProps {
  /** Current XP within the current level. */
  currentXP: number;
  /** XP required to reach the next level. */
  requiredXP: number;
  /** Current level number. */
  level: number;
  /** Partial theme overrides. */
  theme?: Partial<ResourceBarTheme>;
  /** Partial effect config overrides. */
  effects?: Partial<BarEffectConfig>;
  /** Whether to show "Level N" text. Default: true. */
  showLevelText?: boolean;
  /** Size override. Default: UDim2.fromScale(0.25, 0.025). */
  size?: UDim2;
  /** Callback fired when XP fills the bar (level-up moment). */
  onLevelUp?: () => void;
}

/** Props for the `<AboveHeadBar>` placement wrapper. */
export interface AboveHeadBarProps extends ResourceBarProps {
  /** The Model the BillboardGui should adornee to. */
  adornee: Model;
  /** Studs offset above the model's head. Default: (0, 3, 0). */
  offset?: Vector3;
  /** Maximum render distance in studs. Default: 100. */
  maxDistance?: number;
}

/** Props for the `<TopCenterBar>` placement wrapper (boss bars). */
export interface TopCenterBarProps extends ResourceBarProps {
  /** Boss / enemy name displayed above the bar. */
  bossName: string;
  /** Optional subtitle (e.g. "World Boss", "Dungeon Guardian"). */
  subtitle?: string;
}
