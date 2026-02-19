/**
 * TopCenterBar — A boss health bar fixed at the top-center of the screen.
 *
 * Renders a large ResourceBar with a boss name label above it
 * and an optional subtitle. Designed for dramatic boss encounters.
 *
 * @example
 * ```tsx
 * <TopCenterBar
 *   bossName="Eldritch Guardian"
 *   subtitle="World Boss"
 *   current={bossHp}
 *   max={bossMaxHp}
 *   style={ResourceBarStyle.Health}
 * />
 * ```
 */

import React from '@rbxts/react';
import { type TopCenterBarProps } from '../../types';
import { ResourceBar } from '../ResourceBar';

// Boss bar defaults — wider and thicker than regular bars
const DEFAULT_BOSS_BAR_SIZE = UDim2.fromScale(0.45, 0.035);

export function TopCenterBar(props: TopCenterBarProps): React.Element {
  const bossName = props.bossName;
  const subtitle = props.subtitle;

  return (
    <frame
      key="TopCenterBar"
      AnchorPoint={new Vector2(0.5, 0)}
      Position={UDim2.fromScale(0.5, 0.02)}
      Size={new UDim2(0.5, 0, 0.08, 0)}
      BackgroundTransparency={1}
    >
      {/* Boss name */}
      <textlabel
        key="BossName"
        AnchorPoint={new Vector2(0.5, 0)}
        Position={UDim2.fromScale(0.5, 0)}
        Size={UDim2.fromScale(1, 0.4)}
        BackgroundTransparency={1}
        Text={bossName}
        TextColor3={Color3.fromRGB(255, 60, 60)}
        TextScaled={true}
        Font={Enum.Font.GothamBlack}
      />

      {/* Subtitle (optional) */}
      {subtitle !== undefined && (
        <textlabel
          key="Subtitle"
          AnchorPoint={new Vector2(0.5, 0)}
          Position={UDim2.fromScale(0.5, 0.35)}
          Size={UDim2.fromScale(0.6, 0.2)}
          BackgroundTransparency={1}
          Text={subtitle}
          TextColor3={Color3.fromRGB(200, 200, 200)}
          TextScaled={true}
          Font={Enum.Font.GothamMedium}
        />
      )}

      {/* Resource bar */}
      <frame
        key="BarContainer"
        AnchorPoint={new Vector2(0.5, 1)}
        Position={UDim2.fromScale(0.5, 1)}
        Size={UDim2.fromScale(1, 0.4)}
        BackgroundTransparency={1}
      >
        <ResourceBar
          current={props.current}
          max={props.max}
          style={props.style}
          theme={props.theme}
          effects={props.effects}
          label={props.label}
          showText={props.showText}
          size={props.size ?? DEFAULT_BOSS_BAR_SIZE}
        />
      </frame>
    </frame>
  );
}
