/**
 * @nicholasosto/ultra-ui
 *
 * The ultimate game-UI toolkit for Roblox-TS.
 * Resource bars, action bars, panels, inventory, nameplates,
 * notifications, timer displays, primitives, and a global theme system.
 */

// ── Theme ──────────────────────────────────────────────────────────────────
export {
  BLOOD_THEME,
  DARK_THEME,
  DECAY_THEME,
  FATELESS_THEME,
  LIGHT_THEME,
  ROBOT_THEME,
  SPIRIT_THEME,
  ThemeProvider,
  useTheme,
} from './theme';

export type {
  ActionBarTheme,
  BarTheme,
  InventoryTheme,
  NameplateTheme,
  NotificationTheme,
  PanelTheme,
  TimerTheme,
  UltraTheme,
} from './theme';

// ── Shared Types ───────────────────────────────────────────────────────────
export type { SpriteSheetDescriptor } from './types';

// ── Primitives ─────────────────────────────────────────────────────────────
export {
  AnimatedBorder,
  Icon,
  NineSlice,
  ProgressFill,
  SpriteSheet,
  useSpriteAnimation,
} from './primitives';
export type {
  AnimatedBorderProps,
  IconProps,
  NineSliceProps,
  ProgressFillProps,
  SpriteAnimationOptions,
  SpriteAnimationResult,
  SpriteSheetProps,
} from './primitives';

// ── Bars (resource / level) ────────────────────────────────────────────────
export * from './bars';

// ── Action Bar ─────────────────────────────────────────────────────────────
export * from './action-bar';

// ── Panels ─────────────────────────────────────────────────────────────────
export * from './panels';

// ── Inventory ──────────────────────────────────────────────────────────────
export * from './inventory';

// ── Nameplates ─────────────────────────────────────────────────────────────
export * from './nameplates';

// ── Notifications ──────────────────────────────────────────────────────────
export * from './notifications';

// ── Timers ─────────────────────────────────────────────────────────────────
export * from './timers';
