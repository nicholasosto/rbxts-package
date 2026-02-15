/**
 * AboveHeadBar — Renders a ResourceBar inside a BillboardGui above a character model.
 *
 * Ideal for mob / NPC health bars that float above their heads in world space.
 *
 * @example
 * ```tsx
 * <AboveHeadBar
 *   adornee={npcModel}
 *   current={npcHealth}
 *   max={npcMaxHealth}
 *   style={ResourceBarStyle.Health}
 *   showText={false}
 * />
 * ```
 */

import React from '@rbxts/react';
import { AboveHeadBarProps } from '../../types';
import { ResourceBar } from '../ResourceBar';

// Default bar size inside the BillboardGui (in offset pixels within the gui)
const DEFAULT_BAR_SIZE = UDim2.fromScale(1, 0.3);

export function AboveHeadBar(props: AboveHeadBarProps): React.Element {
  const adornee = props.adornee;
  const offset = props.offset ?? new Vector3(0, 3, 0);
  const maxDistance = props.maxDistance ?? 100;

  return (
    <billboardgui
      key="AboveHeadBar"
      Adornee={adornee}
      Size={new UDim2(4, 0, 0.5, 0)}
      StudsOffset={offset}
      AlwaysOnTop={true}
      MaxDistance={maxDistance}
      ResetOnSpawn={false}
      LightInfluence={0}
    >
      <ResourceBar
        current={props.current}
        max={props.max}
        style={props.style}
        theme={props.theme}
        effects={props.effects}
        label={props.label}
        showText={props.showText ?? false}
        size={props.size ?? DEFAULT_BAR_SIZE}
      />
    </billboardgui>
  );
}
