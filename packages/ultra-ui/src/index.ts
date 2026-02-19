/**
 * @nicholasosto/ultra-ui
 *
 * The ultimate game-UI toolkit for Roblox-TS.
 * Resource bars, action bars, panels, inventory, nameplates,
 * notifications, timer displays, primitives, and a global theme system.
 */

// ── Theme ──────────────────────────────────────────────────────────────────
export { DARK_THEME, LIGHT_THEME, ThemeProvider, useTheme } from './theme';

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

// ── Primitives ─────────────────────────────────────────────────────────────
export { Icon, NineSlice, ProgressFill } from './primitives';
export type { IconProps, NineSliceProps, ProgressFillProps } from './primitives';

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
