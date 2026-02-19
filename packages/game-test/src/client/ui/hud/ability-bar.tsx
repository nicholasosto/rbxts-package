import React from '@rbxts/react';
import { type AbilitySlot } from '../../types';

interface AbilityBarProps {
  abilities: AbilitySlot[];
}

/**
 * AbilityBar — Row of ability icons at the bottom of the HUD.
 *
 * Maps each ability slot and displays its icon (from IMAGE_CATALOG.AbilityIcons).
 * Cooldown overlay dims the slot when on cooldown.
 */
export function AbilityBar({ abilities }: AbilityBarProps): React.Element {
  return (
    <frame
      key="AbilityBar"
      AnchorPoint={new Vector2(0.5, 1)}
      Position={UDim2.fromScale(0.5, 0.95)}
      Size={UDim2.fromScale(0.4, 0.08)}
      BackgroundTransparency={1}
    >
      <uilistlayout
        FillDirection={Enum.FillDirection.Horizontal}
        HorizontalAlignment={Enum.HorizontalAlignment.Center}
        VerticalAlignment={Enum.VerticalAlignment.Center}
        Padding={new UDim(0, 8)}
      />

      {abilities.map((slot, i) => (
        <imagebutton
          key={`Ability_${i}`}
          Size={UDim2.fromOffset(64, 64)}
          Image={slot.iconImage}
          BackgroundColor3={Color3.fromRGB(40, 40, 40)}
          ImageTransparency={slot.isReady ? 0 : 0.6}
          BorderSizePixel={0}
        >
          <uicorner CornerRadius={new UDim(0, 8)} />
          {/* Cooldown overlay */}
          {!slot.isReady && (
            <textlabel
              key="Cooldown"
              Size={UDim2.fromScale(1, 1)}
              BackgroundTransparency={1}
              Text={`${math.ceil(slot.cooldownRemaining)}`}
              TextColor3={Color3.fromRGB(255, 255, 255)}
              TextScaled={true}
              Font={Enum.Font.GothamBold}
            />
          )}
        </imagebutton>
      ))}

      {/* Empty slots when no abilities loaded */}
      {abilities.size() === 0 && (
        <textlabel
          key="Empty"
          Size={UDim2.fromOffset(200, 40)}
          BackgroundTransparency={1}
          Text="No abilities equipped"
          TextColor3={Color3.fromRGB(150, 150, 150)}
          TextScaled={true}
          Font={Enum.Font.Gotham}
        />
      )}
    </frame>
  );
}
