import React from '@rbxts/react';
import { HealthBar } from './health-bar';
import { AbilityBar } from './ability-bar';

/**
 * HudScreen — Top-level HUD layout.
 *
 * Always visible during gameplay. Contains the health bar,
 * ability bar, and any other persistent HUD elements.
 */
export function HudScreen(): React.Element {
  return (
    <frame key="HUD" Size={UDim2.fromScale(1, 1)} BackgroundTransparency={1}>
      {/* Health bar — top center */}
      <HealthBar current={100} max={100} />

      {/* Ability bar — bottom center */}
      <AbilityBar abilities={[]} />
    </frame>
  );
}
