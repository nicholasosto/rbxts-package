/**
 * Nameplate types.
 */

/** Configuration for a nameplate above a character. */
export interface NameplateData {
  /** Character display name. */
  displayName: string;
  /** Optional title (e.g. "Guild Master"). */
  title?: string;
  /** Optional guild / faction tag. */
  guildTag?: string;
  /** Level number. */
  level?: number;
  /** Current health (shows bar if provided alongside maxHealth). */
  currentHealth?: number;
  /** Maximum health. */
  maxHealth?: number;
  /** Color override for the name text. */
  nameColor?: Color3;
  /** Whether this nameplate represents a hostile NPC. */
  isHostile?: boolean;
}
