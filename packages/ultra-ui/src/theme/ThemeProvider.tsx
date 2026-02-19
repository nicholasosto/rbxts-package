/**
 * @nicholasosto/ultra-ui — ThemeProvider & useTheme hook
 *
 * React context-based theme provider. Wraps children with a merged theme.
 * Components use `useTheme()` to access the current theme.
 */

import React from '@rbxts/react';
import { DARK_THEME } from './presets';
import { type UltraTheme } from './types';

// ─── Context ───────────────────────────────────────────────────────────────

const ThemeContext = React.createContext<UltraTheme>(DARK_THEME);

// ─── Provider ──────────────────────────────────────────────────────────────

/** Props for the ThemeProvider component. */
export interface ThemeProviderProps {
  /** Theme to use. Defaults to DARK_THEME if omitted. */
  theme?: UltraTheme;
  /** Child elements. */
  children: React.Element;
}

/**
 * Wraps children with the ultra-ui theme context.
 *
 * @example
 * ```tsx
 * <ThemeProvider theme={DARK_THEME}>
 *   <HudScreen />
 * </ThemeProvider>
 * ```
 */
export function ThemeProvider(props: ThemeProviderProps): React.Element {
  const theme = props.theme ?? DARK_THEME;

  return <ThemeContext.Provider value={theme}>{props.children}</ThemeContext.Provider>;
}

// ─── Hook ──────────────────────────────────────────────────────────────────

/**
 * Returns the current UltraTheme from the nearest ThemeProvider.
 * Falls back to DARK_THEME if no provider is found.
 */
export function useTheme(): UltraTheme {
  return React.useContext(ThemeContext);
}
