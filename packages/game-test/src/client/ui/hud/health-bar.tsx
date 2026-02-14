import React from '@rbxts/react';

interface HealthBarProps {
  current: number;
  max: number;
}

/**
 * HealthBar — Displays the player's current health.
 *
 * Uses IMAGE_CATALOG.UiControls for bar textures (TODO).
 */
export function HealthBar({ current, max }: HealthBarProps): React.Element {
  const fillPercent = math.clamp(current / max, 0, 1);

  return (
    <frame
      key="HealthBar"
      AnchorPoint={new Vector2(0.5, 0)}
      Position={UDim2.fromScale(0.5, 0.02)}
      Size={UDim2.fromScale(0.3, 0.04)}
      BackgroundColor3={Color3.fromRGB(30, 30, 30)}
      BorderSizePixel={0}
    >
      {/* Corner rounding */}
      <uicorner CornerRadius={new UDim(0.5, 0)} />

      {/* Fill bar */}
      <frame
        key="Fill"
        Size={UDim2.fromScale(fillPercent, 1)}
        BackgroundColor3={Color3.fromRGB(0, 200, 80)}
        BorderSizePixel={0}
      >
        <uicorner CornerRadius={new UDim(0.5, 0)} />
      </frame>

      {/* Label */}
      <textlabel
        key="Label"
        Size={UDim2.fromScale(1, 1)}
        BackgroundTransparency={1}
        Text={`${current} / ${max}`}
        TextColor3={Color3.fromRGB(255, 255, 255)}
        TextScaled={true}
        Font={Enum.Font.GothamBold}
      />
    </frame>
  );
}
