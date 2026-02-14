// ─── Timer Package: Types, Enums & Interfaces ───────────────────────────────

/**
 * Timer count direction.
 */
export enum TimerDirection {
  Up = 'Up',
  Down = 'Down',
}

/**
 * Timer lifecycle state.
 */
export enum TimerState {
  Idle = 'Idle',
  Running = 'Running',
  Paused = 'Paused',
  Completed = 'Completed',
  Destroyed = 'Destroyed',
}

/**
 * Time display format.
 */
export enum TimerFormat {
  /** `01:30` — padded minutes:seconds */
  MinSec = 'MinSec',
  /** `01:30.5` — with one decimal */
  MinSecTenth = 'MinSecTenth',
  /** `00:01:30` — full hours:min:sec */
  HourMinSec = 'HourMinSec',
  /** `90` — integer seconds only */
  RawSeconds = 'RawSeconds',
  /** `1:30` — no leading zero on minutes */
  Compact = 'Compact',
}

/**
 * Screen anchor presets.
 */
export enum TimerAnchor {
  TopLeft = 'TopLeft',
  TopCenter = 'TopCenter',
  TopRight = 'TopRight',
  MiddleLeft = 'MiddleLeft',
  Center = 'Center',
  MiddleRight = 'MiddleRight',
  BottomLeft = 'BottomLeft',
  BottomCenter = 'BottomCenter',
  BottomRight = 'BottomRight',
}

/**
 * Visual effect identifiers.
 */
export enum TimerEffect {
  Pulse = 'Pulse',
  Flash = 'Flash',
  ColorShift = 'ColorShift',
  Shake = 'Shake',
  FadeIn = 'FadeIn',
  FadeOut = 'FadeOut',
  UrgencyGlow = 'UrgencyGlow',
  CompletionBurst = 'CompletionBurst',
  ProgressRing = 'ProgressRing',
}

// ─── Effect Config Interfaces ────────────────────────────────────────────────

export interface PulseConfig {
  /** Scale multiplier for the bounce (default 1.15) */
  scale?: number;
  /** Only pulse when remaining seconds <= this (default: always) */
  thresholdSeconds?: number;
}

export interface FlashConfig {
  /** Flash colour */
  color?: Color3;
  /** Flash opacity 0-1 */
  opacity?: number;
  /** Flash duration in seconds */
  duration?: number;
}

export interface ColorShiftConfig {
  /** Colour when time is plentiful */
  safeColor?: Color3;
  /** Colour when time is moderate */
  warningColor?: Color3;
  /** Colour when time is critical */
  criticalColor?: Color3;
  /** Fraction (0-1) of total duration at which warning begins */
  warningThreshold?: number;
  /** Fraction (0-1) of total duration at which critical begins */
  criticalThreshold?: number;
}

export interface ShakeConfig {
  /** Maximum pixel offset */
  intensity?: number;
  /** Only shake when remaining seconds <= this */
  thresholdSeconds?: number;
}

export interface FadeConfig {
  /** Fade duration in seconds */
  duration?: number;
  /** Roblox easing style */
  easingStyle?: Enum.EasingStyle;
}

export interface UrgencyGlowConfig {
  /** Glow colour */
  color?: Color3;
  /** Maximum stroke size */
  maxSize?: number;
  /** Fraction (0-1) at which glow begins */
  threshold?: number;
}

export interface CompletionBurstConfig {
  /** Scale multiplier for the burst */
  scale?: number;
  /** Whether to fade after burst */
  fadeAfter?: boolean;
}

export interface ProgressRingConfig {
  /** Ring radius in pixels */
  radius?: number;
  /** Ring thickness in pixels */
  thickness?: number;
}

/**
 * Map from effect enum to its config type.
 */
export interface EffectConfigMap {
  [TimerEffect.Pulse]: PulseConfig;
  [TimerEffect.Flash]: FlashConfig;
  [TimerEffect.ColorShift]: ColorShiftConfig;
  [TimerEffect.Shake]: ShakeConfig;
  [TimerEffect.FadeIn]: FadeConfig;
  [TimerEffect.FadeOut]: FadeConfig;
  [TimerEffect.UrgencyGlow]: UrgencyGlowConfig;
  [TimerEffect.CompletionBurst]: CompletionBurstConfig;
  [TimerEffect.ProgressRing]: ProgressRingConfig;
}

/**
 * An effect entry can be a bare enum or an object with per-effect config.
 */
export type EffectEntry =
  | TimerEffect
  | { effect: TimerEffect; config?: Partial<EffectConfigMap[TimerEffect]> };

// ─── Threshold ───────────────────────────────────────────────────────────────

export interface TimerThreshold {
  /** Unique identifier for this threshold */
  id: string;
  /** Time in seconds at which the threshold fires */
  time: number;
  /** If true, fires every loop cycle (default false) */
  repeating?: boolean;
}

// ─── Display Config ──────────────────────────────────────────────────────────

export interface TimerDisplayConfig {
  /** Show on-screen UI (default true) */
  visible?: boolean;
  /** Screen position preset */
  anchor?: TimerAnchor;
  /** Pixel offset from anchor */
  offset?: Vector2;
  /** Frame width in pixels */
  width?: number;
  /** Frame height in pixels */
  height?: number;
  /** Time string format */
  format?: TimerFormat;
  /** Text colour */
  textColor?: Color3;
  /** Text size */
  fontSize?: number;
  /** Font face */
  font?: Enum.Font;
  /** Frame background transparency */
  backgroundTransparency?: number;
  /** Frame background colour */
  backgroundColor?: Color3;
  /** Rounded corner radius */
  cornerRadius?: number;
  /** Header text above the time */
  label?: string;
  /** Header font size */
  labelFontSize?: number;
  /** Visual effects */
  effects?: EffectEntry[];
  /** ScreenGui display order */
  displayOrder?: number;
}

// ─── Timer Options ───────────────────────────────────────────────────────────

export interface TimerOptions {
  /** Unique identifier (auto-generated if omitted) */
  id?: string;
  /** Total seconds. 0 = stopwatch / infinite. */
  duration?: number;
  /** Count direction */
  direction?: TimerDirection;
  /** Start immediately on creation */
  autoStart?: boolean;
  /** UI config, or `false` to suppress display */
  display?: TimerDisplayConfig | false;
  /** Time-based event triggers */
  thresholds?: TimerThreshold[];
  /** Auto-restart on completion */
  loop?: boolean;
  /** Playback speed multiplier */
  speed?: number;
  /** Arbitrary game data */
  metadata?: Record<string, unknown>;
}

// ─── Signal Payloads ─────────────────────────────────────────────────────────

export interface TimerTickPayload {
  timerId: string;
  elapsed: number;
  remaining: number;
  fraction: number;
}

export interface TimerLifecyclePayload {
  timerId: string;
  elapsed: number;
}

export interface TimerThresholdPayload {
  timerId: string;
  elapsed: number;
  threshold: TimerThreshold;
}

// ─── Resolved internal config ────────────────────────────────────────────────

export interface ResolvedTimerConfig {
  id: string;
  duration: number;
  direction: TimerDirection;
  autoStart: boolean;
  display: TimerDisplayConfig | false;
  thresholds: TimerThreshold[];
  loop: boolean;
  speed: number;
  metadata: Record<string, unknown>;
}
