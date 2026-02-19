/**
 * @nicholasosto/ultra-ui — Default theme presets
 */

import { type UltraTheme } from './types';

// ─── Dark Theme (default) ──────────────────────────────────────────────────

/** Default dark RPG theme. */
export const DARK_THEME: UltraTheme = {
  textColor: Color3.fromRGB(255, 255, 255),
  font: Enum.Font.GothamMedium,
  fontBold: Enum.Font.GothamBold,

  bar: {
    fillColor: Color3.fromRGB(0, 200, 80),
    lowFillColor: Color3.fromRGB(220, 40, 40),
    backgroundColor: Color3.fromRGB(30, 30, 30),
    ghostColor: Color3.fromRGB(255, 100, 100),
    glowColor: Color3.fromRGB(255, 60, 60),
    textColor: Color3.fromRGB(255, 255, 255),
    lowThreshold: 0.25,
    cornerRadius: new UDim(0.5, 0),
  },

  panel: {
    backgroundColor: Color3.fromRGB(25, 25, 35),
    backgroundTransparency: 0.05,
    titleBarColor: Color3.fromRGB(35, 35, 50),
    titleTextColor: Color3.fromRGB(240, 240, 255),
    borderColor: Color3.fromRGB(80, 80, 120),
    borderThickness: 1,
    cornerRadius: new UDim(0, 8),
    overlayTransparency: 0.4,
  },

  inventory: {
    slotBackgroundColor: Color3.fromRGB(40, 40, 55),
    slotBorderColor: Color3.fromRGB(70, 70, 100),
    slotBorderThickness: 1,
    slotCornerRadius: new UDim(0, 6),
    hoverColor: Color3.fromRGB(60, 60, 90),
    selectedColor: Color3.fromRGB(80, 120, 200),
    quantityTextColor: Color3.fromRGB(255, 255, 255),
  },

  nameplate: {
    friendlyNameColor: Color3.fromRGB(100, 255, 100),
    enemyNameColor: Color3.fromRGB(255, 80, 80),
    titleColor: Color3.fromRGB(200, 200, 200),
    levelBadgeColor: Color3.fromRGB(50, 50, 70),
    levelBadgeTextColor: Color3.fromRGB(255, 215, 0),
    healthFillColor: Color3.fromRGB(0, 200, 80),
    healthBackgroundColor: Color3.fromRGB(30, 30, 30),
  },

  notification: {
    infoColor: Color3.fromRGB(60, 140, 255),
    successColor: Color3.fromRGB(60, 200, 80),
    warningColor: Color3.fromRGB(240, 200, 40),
    errorColor: Color3.fromRGB(220, 50, 50),
    backgroundColor: Color3.fromRGB(30, 30, 40),
    backgroundTransparency: 0.1,
    textColor: Color3.fromRGB(255, 255, 255),
    cornerRadius: new UDim(0, 8),
  },

  timer: {
    fillColor: Color3.fromRGB(100, 180, 255),
    backgroundColor: Color3.fromRGB(30, 30, 40),
    urgencyColor: Color3.fromRGB(255, 80, 40),
    textColor: Color3.fromRGB(255, 255, 255),
    buffBorderColor: Color3.fromRGB(60, 200, 80),
    debuffBorderColor: Color3.fromRGB(220, 50, 50),
  },

  actionBar: {
    slotBackgroundColor: Color3.fromRGB(35, 35, 50),
    slotBorderColor: Color3.fromRGB(70, 70, 100),
    cooldownOverlayColor: Color3.fromRGB(0, 0, 0),
    cooldownOverlayTransparency: 0.4,
    readyColor: Color3.fromRGB(255, 255, 255),
    hotkeyTextColor: Color3.fromRGB(200, 200, 220),
    cornerRadius: new UDim(0, 6),
  },
};

// ─── Light Theme ───────────────────────────────────────────────────────────

/** Light theme for brighter game styles. */
export const LIGHT_THEME: UltraTheme = {
  textColor: Color3.fromRGB(30, 30, 30),
  font: Enum.Font.GothamMedium,
  fontBold: Enum.Font.GothamBold,

  bar: {
    fillColor: Color3.fromRGB(40, 180, 80),
    lowFillColor: Color3.fromRGB(200, 50, 50),
    backgroundColor: Color3.fromRGB(220, 220, 220),
    ghostColor: Color3.fromRGB(255, 140, 140),
    glowColor: Color3.fromRGB(255, 80, 80),
    textColor: Color3.fromRGB(30, 30, 30),
    lowThreshold: 0.25,
    cornerRadius: new UDim(0.5, 0),
  },

  panel: {
    backgroundColor: Color3.fromRGB(240, 240, 245),
    backgroundTransparency: 0.05,
    titleBarColor: Color3.fromRGB(220, 220, 230),
    titleTextColor: Color3.fromRGB(30, 30, 40),
    borderColor: Color3.fromRGB(180, 180, 200),
    borderThickness: 1,
    cornerRadius: new UDim(0, 8),
    overlayTransparency: 0.5,
  },

  inventory: {
    slotBackgroundColor: Color3.fromRGB(230, 230, 240),
    slotBorderColor: Color3.fromRGB(180, 180, 200),
    slotBorderThickness: 1,
    slotCornerRadius: new UDim(0, 6),
    hoverColor: Color3.fromRGB(210, 210, 230),
    selectedColor: Color3.fromRGB(100, 150, 230),
    quantityTextColor: Color3.fromRGB(30, 30, 30),
  },

  nameplate: {
    friendlyNameColor: Color3.fromRGB(40, 160, 40),
    enemyNameColor: Color3.fromRGB(200, 50, 50),
    titleColor: Color3.fromRGB(100, 100, 100),
    levelBadgeColor: Color3.fromRGB(220, 220, 230),
    levelBadgeTextColor: Color3.fromRGB(180, 140, 0),
    healthFillColor: Color3.fromRGB(40, 180, 80),
    healthBackgroundColor: Color3.fromRGB(200, 200, 200),
  },

  notification: {
    infoColor: Color3.fromRGB(40, 120, 220),
    successColor: Color3.fromRGB(40, 170, 60),
    warningColor: Color3.fromRGB(210, 170, 20),
    errorColor: Color3.fromRGB(200, 40, 40),
    backgroundColor: Color3.fromRGB(245, 245, 250),
    backgroundTransparency: 0.05,
    textColor: Color3.fromRGB(30, 30, 30),
    cornerRadius: new UDim(0, 8),
  },

  timer: {
    fillColor: Color3.fromRGB(60, 140, 230),
    backgroundColor: Color3.fromRGB(220, 220, 230),
    urgencyColor: Color3.fromRGB(220, 60, 30),
    textColor: Color3.fromRGB(30, 30, 30),
    buffBorderColor: Color3.fromRGB(40, 170, 60),
    debuffBorderColor: Color3.fromRGB(200, 40, 40),
  },

  actionBar: {
    slotBackgroundColor: Color3.fromRGB(230, 230, 240),
    slotBorderColor: Color3.fromRGB(180, 180, 200),
    cooldownOverlayColor: Color3.fromRGB(0, 0, 0),
    cooldownOverlayTransparency: 0.5,
    readyColor: Color3.fromRGB(30, 30, 30),
    hotkeyTextColor: Color3.fromRGB(80, 80, 100),
    cornerRadius: new UDim(0, 6),
  },
};
