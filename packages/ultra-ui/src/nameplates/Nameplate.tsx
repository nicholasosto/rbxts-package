/**
 * Nameplate — A BillboardGui nameplate that floats above a character,
 * displaying name, optional title, guild tag, level badge, and health bar.
 *
 * @example
 * ```tsx
 * <Nameplate
 *   adornee={npcModel}
 *   data={{
 *     displayName: "Shadow Wolf",
 *     level: 12,
 *     currentHealth: 340,
 *     maxHealth: 500,
 *     isHostile: true,
 *   }}
 * />
 * ```
 */

import React from '@rbxts/react';
import { ProgressFill } from '../primitives';
import { useTheme } from '../theme';
import type { NameplateData } from './types';

export interface NameplateProps {
  /** The Model or Part to adornee the BillboardGui to. */
  adornee: PVInstance;
  /** Nameplate data. */
  data: NameplateData;
  /** StudsOffset from the adornee. Default: (0, 3.5, 0). */
  offset?: Vector3;
  /** Max render distance in studs. Default: 80. */
  maxDistance?: number;
  /** BillboardGui size. Default: 6×1 studs. */
  billboardSize?: UDim2;
}

export function Nameplate(props: NameplateProps): React.Element {
  const {
    adornee,
    data,
    offset = new Vector3(0, 3.5, 0),
    maxDistance = 80,
    billboardSize = new UDim2(6, 0, 1, 0),
  } = props;

  const theme = useTheme();
  const np = theme.nameplate;

  const nameColor =
    data.nameColor ?? (data.isHostile === true ? np.enemyNameColor : np.friendlyNameColor);
  const showHealth = data.currentHealth !== undefined && data.maxHealth !== undefined;
  const healthPct = showHealth ? (data.currentHealth as number) / (data.maxHealth as number) : 0;
  const healthColor = np.healthFillColor;

  return (
    <billboardgui
      key="Nameplate"
      Adornee={adornee as PVInstance}
      Size={billboardSize}
      StudsOffset={offset}
      AlwaysOnTop={true}
      MaxDistance={maxDistance}
      ResetOnSpawn={false}
      LightInfluence={0}
    >
      <frame key="Root" Size={UDim2.fromScale(1, 1)} BackgroundTransparency={1}>
        <uilistlayout
          SortOrder={Enum.SortOrder.LayoutOrder}
          HorizontalAlignment={Enum.HorizontalAlignment.Center}
          Padding={new UDim(0, 1)}
        />

        {/* Title (optional) */}
        {data.title !== undefined && (
          <textlabel
            key="Title"
            LayoutOrder={1}
            Size={new UDim2(1, 0, 0, 0)}
            AutomaticSize={Enum.AutomaticSize.Y}
            BackgroundTransparency={1}
            Text={`<${data.title}>`}
            TextColor3={np.titleColor}
            TextSize={12}
            Font={Enum.Font.GothamMedium}
            TextXAlignment={Enum.TextXAlignment.Center}
          />
        )}

        {/* Name + Level */}
        <textlabel
          key="Name"
          LayoutOrder={2}
          Size={new UDim2(1, 0, 0, 0)}
          AutomaticSize={Enum.AutomaticSize.Y}
          BackgroundTransparency={1}
          Text={
            data.level !== undefined ? `[Lv.${data.level}] ${data.displayName}` : data.displayName
          }
          TextColor3={nameColor}
          TextSize={14}
          Font={Enum.Font.GothamBold}
          TextXAlignment={Enum.TextXAlignment.Center}
          TextStrokeTransparency={0.5}
          TextStrokeColor3={Color3.fromRGB(0, 0, 0)}
        />

        {/* Guild tag (optional) */}
        {data.guildTag !== undefined && (
          <textlabel
            key="Guild"
            LayoutOrder={3}
            Size={new UDim2(1, 0, 0, 0)}
            AutomaticSize={Enum.AutomaticSize.Y}
            BackgroundTransparency={1}
            Text={`<${data.guildTag}>`}
            TextColor3={np.titleColor}
            TextSize={12}
            Font={Enum.Font.Gotham}
            TextXAlignment={Enum.TextXAlignment.Center}
          />
        )}

        {/* Health bar */}
        {showHealth && (
          <frame
            key="HealthBarContainer"
            LayoutOrder={4}
            Size={new UDim2(0.8, 0, 0, 6)}
            BackgroundColor3={Color3.fromRGB(20, 20, 20)}
            BackgroundTransparency={0.3}
            BorderSizePixel={0}
          >
            <uicorner CornerRadius={new UDim(0, 3)} />
            <ProgressFill fraction={healthPct} fillColor={healthColor} showGhost={true} />
          </frame>
        )}
      </frame>
    </billboardgui>
  );
}
