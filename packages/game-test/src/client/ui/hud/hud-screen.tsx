import React from '@rbxts/react';
import { useSelector } from '@rbxts/react-reflex';
import { ResourceBar, ResourceBarStyle } from '@nicholasosto/rpg-ui-bars';
import { selectHealth, selectMana } from '../../store';
import { AbilityBar } from './ability-bar';

/**
 * HudScreen — Top-level HUD layout.
 *
 * Portaled into the scaffold's Gameplay > HUD CanvasGroup.
 * The container is already full-size and transparent, so this
 * component renders content directly without a wrapper frame.
 */
export function HudScreen(): React.Element {
  const health = useSelector(selectHealth);
  const mana = useSelector(selectMana);

  return (
    <React.Fragment>
      {/* Resource bars — top center */}
      <frame
        key="ResourceBars"
        AnchorPoint={new Vector2(0.5, 0)}
        Position={UDim2.fromScale(0.5, 0.02)}
        Size={UDim2.fromScale(0.35, 0.1)}
        BackgroundTransparency={1}
      >
        <uilistlayout
          FillDirection={Enum.FillDirection.Vertical}
          Padding={new UDim(0, 4)}
          HorizontalAlignment={Enum.HorizontalAlignment.Center}
        />
        <ResourceBar
          current={health.current}
          max={health.max}
          style={ResourceBarStyle.Health}
          label="HP"
          size={UDim2.fromScale(1, 0.4)}
        />
        <ResourceBar
          current={mana.current}
          max={mana.max}
          style={ResourceBarStyle.Mana}
          label="MP"
          size={UDim2.fromScale(0.85, 0.3)}
        />
      </frame>

      {/* Ability bar — bottom center */}
      <AbilityBar abilities={[]} />
    </React.Fragment>
  );
}
