import React, { useEffect } from '@rbxts/react';
import { useSelector } from '@rbxts/react-reflex';
import { selectIsMenuOpen } from '../../store';
import { useRootProducer } from '../hooks';
import { scaffold } from '../scaffold';

/**
 * MenuScreen — Pause/settings menu overlay.
 *
 * Portaled into the scaffold's Gameplay > Panels > Menu > Content.
 * Toggles the parent Menu Frame's Visible property via the store
 * so the Rojo-provided Frame acts as the visibility gate.
 */
export function MenuScreen(): React.Element {
  const isOpen = useSelector(selectIsMenuOpen);
  const { closeAll } = useRootProducer();

  // Sync scaffold frame visibility with store state
  useEffect(() => {
    scaffold.gameplay.menuFrame.Visible = isOpen;
  }, [isOpen]);

  return (
    <frame
      key="MenuOverlay"
      Size={UDim2.fromScale(1, 1)}
      BackgroundColor3={Color3.fromRGB(0, 0, 0)}
      BackgroundTransparency={0.4}
    >
      {/* Centered menu card */}
      <frame
        key="MenuCard"
        AnchorPoint={new Vector2(0.5, 0.5)}
        Position={UDim2.fromScale(0.5, 0.5)}
        Size={UDim2.fromScale(0.35, 0.5)}
        BackgroundColor3={Color3.fromRGB(30, 30, 40)}
        BorderSizePixel={0}
      >
        <uicorner CornerRadius={new UDim(0, 12)} />
        <uilistlayout
          HorizontalAlignment={Enum.HorizontalAlignment.Center}
          VerticalAlignment={Enum.VerticalAlignment.Center}
          Padding={new UDim(0, 12)}
        />

        {/* Title */}
        <textlabel
          key="Title"
          Size={UDim2.fromScale(0.8, 0.12)}
          BackgroundTransparency={1}
          Text="Menu"
          TextColor3={Color3.fromRGB(255, 255, 255)}
          TextScaled={true}
          Font={Enum.Font.GothamBold}
        />

        <textbutton
          key="ResumeBtn"
          Size={UDim2.fromScale(0.6, 0.1)}
          BackgroundColor3={Color3.fromRGB(60, 60, 80)}
          Text="Resume"
          TextColor3={Color3.fromRGB(255, 255, 255)}
          TextScaled={true}
          Font={Enum.Font.Gotham}
          BorderSizePixel={0}
          Event={{ Activated: () => closeAll() }}
        >
          <uicorner CornerRadius={new UDim(0, 8)} />
        </textbutton>

        <textbutton
          key="SettingsBtn"
          Size={UDim2.fromScale(0.6, 0.1)}
          BackgroundColor3={Color3.fromRGB(60, 60, 80)}
          Text="Settings"
          TextColor3={Color3.fromRGB(255, 255, 255)}
          TextScaled={true}
          Font={Enum.Font.Gotham}
          BorderSizePixel={0}
        >
          <uicorner CornerRadius={new UDim(0, 8)} />
        </textbutton>
      </frame>
    </frame>
  );
}
