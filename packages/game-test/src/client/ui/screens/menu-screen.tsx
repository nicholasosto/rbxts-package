import React from '@rbxts/react';

interface MenuScreenProps {
  visible: boolean;
}

/**
 * MenuScreen — Pause/settings menu overlay.
 *
 * Toggled via InputAction.ToggleMenu (Escape key).
 * Provides settings, quit, and resume options.
 */
export function MenuScreen({ visible }: MenuScreenProps): React.Element {
  if (!visible) {
    return <frame key="MenuScreen" Visible={false} />;
  }

  return (
    <frame
      key="MenuScreen"
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

        {/* TODO: Resume, Settings, Quit buttons */}
        <textbutton
          key="ResumeBtn"
          Size={UDim2.fromScale(0.6, 0.1)}
          BackgroundColor3={Color3.fromRGB(60, 60, 80)}
          Text="Resume"
          TextColor3={Color3.fromRGB(255, 255, 255)}
          TextScaled={true}
          Font={Enum.Font.Gotham}
          BorderSizePixel={0}
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
