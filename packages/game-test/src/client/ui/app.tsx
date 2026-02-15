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
    // Show the Loading layer while we wait for data
    scaffold.screens.loading.Enabled = true;

    // Mount the React tree into the Gameplay ScreenGui.
    // Portals project each screen into its scaffold container.
    const root = createRoot(scaffold.screens.gameplay);
    root.render(
      <ReflexProvider producer={producer}>
        {createPortal(<HudScreen />, scaffold.gameplay.hud)}
        {createPortal(<MenuScreen />, scaffold.gameplay.menuContent)}
        {createPortal(<InventoryScreen />, scaffold.gameplay.inventoryContent)}
        {createPortal(<AssetCatalogScreen />, scaffold.gameplay.catalogContent)}
      </ReflexProvider>,
    );

    // Wait for profile data to load, then swap layers
    const unsubscribe = producer.subscribe(selectIsProfileLoaded, (isLoaded) => {
      if (isLoaded) {
        scaffold.screens.gameplay.Enabled = true;
        scaffold.screens.loading.Enabled = false;
        unsubscribe();
      }
    });
  }
}
