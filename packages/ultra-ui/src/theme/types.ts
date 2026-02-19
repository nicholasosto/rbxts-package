/**
 * @nicholasosto/ultra-ui — Theme type definitions
 *
 * A unified theme system covering all ultra-ui component families.
 */

// ─── Sub-Theme Interfaces ──────────────────────────────────────────────────

/** Bar-specific theme values. */
export interface BarTheme {
  /** Primary fill color (above low threshold). */
  fillColor: Color3;
  /** Fill color when below low threshold. */
  lowFillColor: Color3;
  /** Background (empty) color. */
  backgroundColor: Color3;
  /** Ghost trail color. */
  ghostColor: Color3;
  /** Glow overlay color at low threshold. */
  glowColor: Color3;
  /** Text label color. */
  textColor: Color3;
  /** Fraction (0–1) below which low-threshold effects trigger. */
  lowThreshold: number;
  /** Corner radius. */
  cornerRadius: UDim;
}

/** Panel / container theme values. */
export interface PanelTheme {
  /** Panel background color. */
  backgroundColor: Color3;
  /** Panel background transparency (0 = opaque). */
  backgroundTransparency: number;
  /** Title bar background color. */
  titleBarColor: Color3;
  /** Title text color. */
  titleTextColor: Color3;
  /** Border / stroke color. */
  borderColor: Color3;
  /** Border thickness in pixels. */
  borderThickness: number;
  /** Corner radius. */
  cornerRadius: UDim;
  /** Overlay dim transparency for modals (0 = fully opaque). */
  overlayTransparency: number;
}

/** Inventory / item slot theme values. */
export interface InventoryTheme {
  /** Default slot background color. */
  slotBackgroundColor: Color3;
  /** Slot border color. */
  slotBorderColor: Color3;
  /** Slot border thickness. */
  slotBorderThickness: number;
  /** Slot corner radius. */
  slotCornerRadius: UDim;
  /** Hover highlight color. */
  hoverColor: Color3;
  /** Selected highlight color. */
  selectedColor: Color3;
  /** Quantity badge text color. */
  quantityTextColor: Color3;
}

/** Nameplate theme values. */
export interface NameplateTheme {
  /** Name text color (friendly). */
  friendlyNameColor: Color3;
  /** Name text color (enemy). */
  enemyNameColor: Color3;
  /** Title/guild text color. */
  titleColor: Color3;
  /** Level badge background color. */
  levelBadgeColor: Color3;
  /** Level badge text color. */
  levelBadgeTextColor: Color3;
  /** Health bar fill color. */
  healthFillColor: Color3;
  /** Health bar background color. */
  healthBackgroundColor: Color3;
}

/** Notification / toast theme values. */
export interface NotificationTheme {
  /** Info variant color. */
  infoColor: Color3;
  /** Success variant color. */
  successColor: Color3;
  /** Warning variant color. */
  warningColor: Color3;
  /** Error variant color. */
  errorColor: Color3;
  /** Toast background color. */
  backgroundColor: Color3;
  /** Toast background transparency. */
  backgroundTransparency: number;
  /** Toast text color. */
  textColor: Color3;
  /** Toast corner radius. */
  cornerRadius: UDim;
}

/** Timer / countdown theme values. */
export interface TimerTheme {
  /** Fill color. */
  fillColor: Color3;
  /** Background color. */
  backgroundColor: Color3;
  /** Urgency fill color (below threshold). */
  urgencyColor: Color3;
  /** Text color. */
  textColor: Color3;
  /** Buff indicator border color. */
  buffBorderColor: Color3;
  /** Debuff indicator border color. */
  debuffBorderColor: Color3;
}

/** Action bar theme values. */
export interface ActionBarTheme {
  /** Slot background color. */
  slotBackgroundColor: Color3;
  /** Slot border color. */
  slotBorderColor: Color3;
  /** Cooldown overlay color. */
  cooldownOverlayColor: Color3;
  /** Cooldown overlay transparency. */
  cooldownOverlayTransparency: number;
  /** Ready indicator color. */
  readyColor: Color3;
  /** Hotkey label text color. */
  hotkeyTextColor: Color3;
  /** Slot corner radius. */
  cornerRadius: UDim;
}

// ─── Master Theme ──────────────────────────────────────────────────────────

/** Complete ultra-ui theme covering all component families. */
export interface UltraTheme {
  /** Global text color fallback. */
  textColor: Color3;
  /** Global font. */
  font: Enum.Font;
  /** Global font (bold variant). */
  fontBold: Enum.Font;

  /** Bar-specific theme. */
  bar: BarTheme;
  /** Panel / container theme. */
  panel: PanelTheme;
  /** Inventory / equipment theme. */
  inventory: InventoryTheme;
  /** Nameplate theme. */
  nameplate: NameplateTheme;
  /** Notification / toast theme. */
  notification: NotificationTheme;
  /** Timer / countdown theme. */
  timer: TimerTheme;
  /** Action bar theme. */
  actionBar: ActionBarTheme;
}
