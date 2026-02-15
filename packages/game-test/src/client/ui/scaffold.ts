import { Players } from '@rbxts/services';

/**
 * Scaffold — resolves Rojo-provided UI containers from PlayerGui.
 *
 * The instance tree is defined in `src/ui-scaffold.model.json` and
 * mapped into StarterGui via Rojo. Roblox clones StarterGui children
 * into PlayerGui on join. This module provides typed accessors for
 * each container so React can portal into them.
 *
 * Hierarchy:
 *   PlayerGui
 *   ├── UIScaffold (Folder)
 *   │   ├── Gameplay (ScreenGui, DisplayOrder 10)
 *   │   │   ├── HUD (CanvasGroup)
 *   │   │   └── Panels (Folder)
 *   │   │       ├── Menu (Frame) → Content (CanvasGroup)
 *   │   │       └── Inventory (Frame) → Content (CanvasGroup)
 *   │   ├── Start (ScreenGui, DisplayOrder 20)
 *   │   │   └── Content (CanvasGroup)
 *   │   ├── Loading (ScreenGui, DisplayOrder 30)
 *   │   │   └── Content (CanvasGroup)
 *   │   └── Dialogs (ScreenGui, DisplayOrder 40)
 *   │       └── Content (CanvasGroup)
 */

const playerGui = Players.LocalPlayer.WaitForChild('PlayerGui') as PlayerGui;
const uiScaffold = playerGui.WaitForChild('UIScaffold') as Folder;

// ── ScreenGui references ───────────────────────────────────
const gameplayGui = uiScaffold.WaitForChild('Gameplay') as ScreenGui;
const startGui = uiScaffold.WaitForChild('Start') as ScreenGui;
const loadingGui = uiScaffold.WaitForChild('Loading') as ScreenGui;
const dialogsGui = uiScaffold.WaitForChild('Dialogs') as ScreenGui;

// ── Gameplay containers ────────────────────────────────────
const hudContainer = gameplayGui.WaitForChild('HUD') as CanvasGroup;
const panelsFolder = gameplayGui.WaitForChild('Panels') as Folder;

const menuFrame = panelsFolder.WaitForChild('Menu') as Frame;
const menuContent = menuFrame.WaitForChild('Content') as CanvasGroup;

const inventoryFrame = panelsFolder.WaitForChild('Inventory') as Frame;
const inventoryContent = inventoryFrame.WaitForChild('Content') as CanvasGroup;

// ── Layer content containers ───────────────────────────────
const startContent = startGui.WaitForChild('Content') as CanvasGroup;
const loadingContent = loadingGui.WaitForChild('Content') as CanvasGroup;
const dialogsContent = dialogsGui.WaitForChild('Content') as CanvasGroup;

export const scaffold = {
  /** ScreenGui references — use to toggle Enabled */
  screens: {
    gameplay: gameplayGui,
    start: startGui,
    loading: loadingGui,
    dialogs: dialogsGui,
  },

  /** Gameplay layer containers — portal targets */
  gameplay: {
    hud: hudContainer,
    menuFrame,
    menuContent,
    inventoryFrame,
    inventoryContent,
  },

  /** Top-level content containers for other layers */
  start: startContent,
  loading: loadingContent,
  dialogs: dialogsContent,
} as const;
