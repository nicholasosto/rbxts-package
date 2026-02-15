import React, { useEffect } from '@rbxts/react';
import { useSelector } from '@rbxts/react-reflex';
import { selectIsInventoryOpen } from '../../store';
import { scaffold } from '../scaffold';

/**
 * InventoryScreen — Full-screen inventory overlay.
 *
 * Portaled into the scaffold's Gameplay > Panels > Inventory > Content.
 * Toggles the parent Inventory Frame's Visible property via the store.
 */
export function InventoryScreen(): React.Element {
  const isOpen = useSelector(selectIsInventoryOpen);

  // Sync scaffold frame visibility with store state
  useEffect(() => {
    scaffold.gameplay.inventoryFrame.Visible = isOpen;
  }, [isOpen]);

  return (
    <frame
      key="InventoryOverlay"
      Size={UDim2.fromScale(1, 1)}
      BackgroundColor3={Color3.fromRGB(20, 20, 30)}
      BackgroundTransparency={0.2}
    >
      {/* Header */}
      <textlabel
        key="Title"
        AnchorPoint={new Vector2(0.5, 0)}
        Position={UDim2.fromScale(0.5, 0.05)}
        Size={UDim2.fromScale(0.3, 0.06)}
        BackgroundTransparency={1}
        Text="Inventory"
        TextColor3={Color3.fromRGB(255, 255, 255)}
        TextScaled={true}
        Font={Enum.Font.GothamBold}
      />

      {/* TODO: Equipment grid, item list, ability loadout slots */}
      <frame
        key="ContentArea"
        AnchorPoint={new Vector2(0.5, 0.5)}
        Position={UDim2.fromScale(0.5, 0.5)}
        Size={UDim2.fromScale(0.8, 0.7)}
        BackgroundColor3={Color3.fromRGB(40, 40, 50)}
        BackgroundTransparency={0.3}
        BorderSizePixel={0}
      >
        <uicorner CornerRadius={new UDim(0, 12)} />
      </frame>
    </frame>
  );
}
