import { Controller, OnStart } from '@flamework/core';
import { Players } from '@rbxts/services';
import React from '@rbxts/react';
import { createRoot } from '@rbxts/react-roblox';
import { HudScreen } from './hud/hud-screen';
import { InventoryScreen } from './screens/inventory-screen';
import { MenuScreen } from './screens/menu-screen';

/**
 * App — Root UI Controller
 *
 * Flamework controller that mounts the React component tree
 * into the local player's PlayerGui. All UI screens are children
 * of this root.
 */
@Controller({})
export class App implements OnStart {
  onStart(): void {
    print('[App] Mounting React UI');

    const playerGui = Players.LocalPlayer.WaitForChild('PlayerGui') as PlayerGui;
    const container = new Instance('Folder');
    container.Name = 'ReactRoot';
    container.Parent = playerGui;

    const root = createRoot(container);
    root.render(
      <screengui key="GameUI" ResetOnSpawn={false} ZIndexBehavior={Enum.ZIndexBehavior.Sibling}>
        <HudScreen />
        <InventoryScreen visible={false} />
        <MenuScreen visible={false} />
      </screengui>,
    );

    print('[App] React UI mounted');
  }
}
