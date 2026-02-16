import { Controller, OnStart } from '@flamework/core';
import React from '@rbxts/react';
import { createRoot, createPortal } from '@rbxts/react-roblox';
import { ReflexProvider } from '@rbxts/react-reflex';
import { producer } from '../store';
import { selectIsProfileLoaded } from '../store/selectors';
import { scaffold } from './scaffold';
import { HudScreen } from './hud/hud-screen';
import { InventoryScreen } from './screens/inventory-screen';
import { MenuScreen } from './screens/menu-screen';
import { AssetCatalogScreen } from './screens/asset-catalog-screen';

/**
 * App — Root UI Controller
 *
 * Mounts React components into the Rojo-provided UI scaffold
 * using portals. The scaffold (ui-scaffold.model.json) defines
 * ScreenGui layers with proper DisplayOrder; React fills
 * the content via createPortal.
 *
 * The Gameplay layer is enabled only after the player's profile
 * has been loaded from the server (gated on isProfileLoaded).
 *
 * Layers:
 *   Gameplay (10) — HUD + Panels (Menu, Inventory)
 *   Start    (20) — title / character select (future)
 *   Loading  (30) — loading overlay (future)
 *   Dialogs  (40) — modals / confirmations (future)
 */
@Controller({})
export class App implements OnStart {
  onStart(): void {
    print('[App] onStart — initializing UI controller');

    // Disable legacy ScreenGuis baked into the .rbxl that overlay our scaffold
    const playerGui = scaffold.screens.gameplay.Parent!.Parent as PlayerGui;
    const legacyNames = ['FlameworkGUI', 'ScreenButtons', 'InventorySystem'];
    for (const name of legacyNames) {
      const gui = playerGui.FindFirstChild(name) as ScreenGui | undefined;
      if (gui && gui.IsA('ScreenGui')) {
        gui.Enabled = false;
        warn(`[App] Disabled legacy ScreenGui: ${name}`);
      }
    }

    // Verify scaffold containers exist before mounting React
    if (!scaffold.gameplay.hud) {
      warn('[App] FATAL: scaffold.gameplay.hud is nil — cannot mount React UI');
      // Force-enable Gameplay so at least something is visible
      scaffold.screens.gameplay.Enabled = true;
      return;
    }

    // Show the Loading layer while we wait for data
    scaffold.screens.loading.Enabled = true;

    // Mount the React tree into the Gameplay ScreenGui.
    // Portals project each screen into its scaffold container.
    print('[App] Mounting React tree...');
    const root = createRoot(scaffold.screens.gameplay);
    root.render(
      <ReflexProvider producer={producer}>
        {createPortal(<HudScreen />, scaffold.gameplay.hud)}
        {scaffold.gameplay.menuContent &&
          createPortal(<MenuScreen />, scaffold.gameplay.menuContent)}
        {scaffold.gameplay.inventoryContent &&
          createPortal(<InventoryScreen />, scaffold.gameplay.inventoryContent)}
        {scaffold.gameplay.catalogContent &&
          createPortal(<AssetCatalogScreen />, scaffold.gameplay.catalogContent)}
      </ReflexProvider>,
    );
    print('[App] React tree mounted ✓');

    // Wait for profile data to load, then swap layers.
    let shown = false;
    const showGameplay = () => {
      if (shown) return;
      shown = true;
      scaffold.screens.gameplay.Enabled = true;
      scaffold.screens.loading.Enabled = false;
      print('[App] Gameplay layer ENABLED ✓');
    };

    const unsubscribe = producer.subscribe(selectIsProfileLoaded, (isLoaded) => {
      if (isLoaded) {
        print('[App] Profile loaded (via subscribe) — enabling Gameplay');
        showGameplay();
        unsubscribe();
      }
    });

    // Immediately check current state — fixes race where DataController
    // hydrates the profile BEFORE App subscribes (subscribe only fires on changes).
    if (selectIsProfileLoaded(producer.getState())) {
      print('[App] Profile already loaded — enabling Gameplay immediately');
      showGameplay();
      unsubscribe();
    }

    // Final fallback: force-show after 2s so UI is always visible in Studio.
    task.delay(2, () => {
      if (!shown) {
        warn('[App] Profile not loaded after 2s — showing UI anyway');
        showGameplay();
        unsubscribe();
      }
    });
  }
}
