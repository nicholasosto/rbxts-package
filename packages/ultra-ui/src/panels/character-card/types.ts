/**
 * CharacterCard — Type definitions
 */

/** Resource value pair for bars. */
export interface ResourceValue {
  /** Current resource amount. */
  current: number;
  /** Maximum resource amount. */
  max: number;
}

/** Props for the CharacterCard HUD component. */
export interface CharacterCardProps {
  /** Player display name shown on the username banner. */
  username: string;
  /** Character level displayed in the level badge. */
  level: number;
  /** Health resource values (red bar). */
  health: ResourceValue;
  /** Mana resource values (blue bar). */
  mana: ResourceValue;
  /** Stamina resource values (green bar). */
  stamina: ResourceValue;
  /** Optional portrait image (rbxassetid:// or rbxthumb:// URL). Falls back to a dark placeholder. */
  portraitImage?: string;
  /** Overall component size. Default: UDim2.fromOffset(450, 140). */
  size?: UDim2;
  /** Screen position. Default: UDim2.fromOffset(20, 20) (top-left). */
  position?: UDim2;
  /** Anchor point. Default: Vector2.zero. */
  anchorPoint?: Vector2;
  /** Whether the card is visible. Default: true. */
  visible?: boolean;
}
