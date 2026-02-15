import { Controller, OnStart } from '@flamework/core';
import { Players } from '@rbxts/services';
import React from '@rbxts/react';
import { createRoot } from '@rbxts/react-roblox';
import { ReflexProvider } from '@rbxts/react-reflex';
import { producer } from '../store';
import { HudScreen } from './hud/hud-screen';
import { InventoryScreen } from './screens/inventory-screen';
import { MenuScreen } from './screens/menu-screen';

/**
 * App — Root UI Controller
 *
 * Flamework controller that mounts the React component tree
 * into the local player's PlayerGui. Wraps the tree in a
 * ReflexProvider so all components can access the store.
 */
@Controller({})
export class App implements OnStart {
  onStart(): void {
    const playerGui = Players.LocalPlayer.WaitForChild('PlayerGui') as PlayerGui;
    const container = new Instance('Folder');
    container.Name = 'ReactRoot';
    container.Parent = playerGui;

    const root = createRoot(container);
    root.render(
      <ReflexProvider producer={producer}>
        <screengui key="GameUI" ResetOnSpawn={false} ZIndexBehavior={Enum.ZIndexBehavior.Sibling}>
          <HudScreen />
          <InventoryScreen />
          <MenuScreen />
        </screengui>
      </ReflexProvider>,
    );
  }
}
