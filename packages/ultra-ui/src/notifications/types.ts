/**
 * Notification types.
 */

/** Severity / visual style of a toast notification. */
export type NotificationSeverity = 'info' | 'success' | 'warning' | 'error';

/** Payload for a single toast notification. */
export interface ToastData {
  /** Unique id for keying React elements. */
  id: string;
  /** Notification text. */
  message: string;
  /** Severity drives icon + accent color. */
  severity: NotificationSeverity;
  /** Duration in seconds before auto-dismiss. Default: 4. */
  duration?: number;
  /** Optional icon image asset id. */
  icon?: string;
}

/** Data for a floating combat number. */
export interface DamageNumberData {
  /** Unique id. */
  id: string;
  /** Number to display. */
  value: number;
  /** Whether this is a heal (green) or damage (red). */
  isHeal?: boolean;
  /** Whether this was a critical hit (larger text). */
  isCritical?: boolean;
  /** Part or Model to attach the damage number to. */
  adornee: PVInstance;
}
