/**
 * Timer UI types.
 */

/** Data for a single buff/debuff indicator. */
export interface BuffData {
  /** Unique buff id. */
  id: string;
  /** Display name. */
  displayName: string;
  /** Icon image asset id. */
  iconImage: string;
  /** Remaining duration in seconds. */
  remainingSeconds: number;
  /** Total duration in seconds (for fill calculations). */
  totalSeconds: number;
  /** Whether this is a debuff (red tint). Default: false. */
  isDebuff?: boolean;
  /** Stack count (show badge if > 1). */
  stacks?: number;
}
