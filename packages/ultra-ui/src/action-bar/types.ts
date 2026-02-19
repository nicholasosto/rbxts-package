/**
 * Action bar shared types.
 */

/** Data shape for a single ability slot. */
export interface AbilitySlotData {
  /** Unique ability identifier. */
  abilityId: string;
  /** Display name. */
  displayName: string;
  /** Icon image URI (rbxassetid://...). */
  iconImage: string;
  /** Remaining cooldown in seconds (0 = ready). */
  cooldownRemaining: number;
  /** Total cooldown duration in seconds. */
  cooldownTotal: number;
  /** Whether the ability is ready to use. */
  isReady: boolean;
  /** Optional hotkey label (e.g. "1", "Q"). */
  hotkeyLabel?: string;
}
