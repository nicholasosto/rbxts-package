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
 *   │   │   │   ├── Inventory (Frame) → Content (CanvasGroup)
 *   │   │   │   └── Catalog (Frame) → Content (CanvasGroup)
 *   │   ├── Start (ScreenGui, DisplayOrder 20)
 *   │   │   └── Content (CanvasGroup)
 *   │   ├── Loading (ScreenGui, DisplayOrder 30)
 *   │   │   └── Content (CanvasGroup)
 *   │   └── Dialogs (ScreenGui, DisplayOrder 40)
 *   │       └── Content (CanvasGroup)
 */

print('[scaffold] Resolving PlayerGui...');
const playerGui = Players.LocalPlayer.WaitForChild('PlayerGui') as PlayerGui;
const uiScaffold = playerGui.WaitForChild('UIScaffold') as Folder;
print('[scaffold] UIScaffold found — resolving ScreenGuis...');

// ── ScreenGui references ───────────────────────────────────
const gameplayGui = uiScaffold.WaitForChild('Gameplay') as ScreenGui;
const startGui = uiScaffold.WaitForChild('Start') as ScreenGui;
const loadingGui = uiScaffold.WaitForChild('Loading') as ScreenGui;
const dialogsGui = uiScaffold.WaitForChild('Dialogs') as ScreenGui;
print('[scaffold] ScreenGuis resolved — resolving Gameplay children...');

// ── Gameplay containers ────────────────────────────────────
print(
  `[scaffold] Gameplay has ${gameplayGui.GetChildren().size()} children: ${gameplayGui
    .GetChildren()
    .map((c) => c.Name)
    .join(', ')}`,
);
const hudContainer = gameplayGui.WaitForChild('HUD', 10) as CanvasGroup | undefined;
if (!hudContainer) {
  warn(
    '[scaffold] FATAL: HUD not found in Gameplay after 10s! Check ui-scaffold.model.json and Rojo sync.',
  );
  warn(
    `[scaffold] Gameplay children: ${gameplayGui
      .GetChildren()
      .map((c) => `${c.Name} (${c.ClassName})`)
      .join(', ')}`,
  );
}
const panelsFolder = gameplayGui.WaitForChild('Panels', 10) as Folder | undefined;
if (!panelsFolder) {
  warn('[scaffold] FATAL: Panels folder not found in Gameplay after 10s!');
}

const menuFrame = panelsFolder?.WaitForChild('Menu') as Frame;
const menuContent = menuFrame?.WaitForChild('Content') as CanvasGroup;

const inventoryFrame = panelsFolder?.WaitForChild('Inventory') as Frame;
const inventoryContent = inventoryFrame?.WaitForChild('Content') as CanvasGroup;

const catalogFrame = panelsFolder?.WaitForChild('Catalog') as Frame;
const catalogContent = catalogFrame?.WaitForChild('Content') as CanvasGroup;

// ── Layer content containers ───────────────────────────────
const startContent = startGui.WaitForChild('Content') as CanvasGroup;
const loadingContent = loadingGui.WaitForChild('Content') as CanvasGroup;
const dialogsContent = dialogsGui.WaitForChild('Content') as CanvasGroup;
print('[scaffold] All scaffold containers resolved ✓');

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
    catalogFrame,
    catalogContent,
  },

  /** Top-level content containers for other layers */
  start: startContent,
  loading: loadingContent,
  dialogs: dialogsContent,
} as const;
