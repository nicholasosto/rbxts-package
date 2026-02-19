/**
 * Tooltip — Floating info box for displaying item/ability details.
 *
 * Position is provided via anchor + offset so the consumer can
 * place it near the cursor or a hovered element.
 *
 * @example
 * ```tsx
 * <Tooltip
 *   isVisible={hovered}
 *   title="Iron Sword"
 *   description="+12 Attack Power"
 *   rarity="Rare"
 *   position={cursorPosition}
 * />
 * ```
 */

import React from '@rbxts/react';
import { useTheme } from '../theme';

/** Rarity levels that map to border accent colors. */
export type ItemRarity = 'Common' | 'Uncommon' | 'Rare' | 'Epic' | 'Legendary';

const RARITY_COLORS: Record<ItemRarity, Color3> = {
  Common: Color3.fromRGB(180, 180, 180),
  Uncommon: Color3.fromRGB(30, 200, 70),
  Rare: Color3.fromRGB(40, 120, 255),
  Epic: Color3.fromRGB(180, 60, 255),
  Legendary: Color3.fromRGB(255, 170, 0),
};

export interface TooltipProps {
  /** Whether the tooltip is visible. */
  isVisible: boolean;
  /** Title text (item/ability name). */
  title: string;
  /** Optional description / flavor text. */
  description?: string;
  /** Optional rarity — drives border accent colour. */
  rarity?: ItemRarity;
  /** Optional stats lines rendered below description. */
  stats?: string[];
  /** Absolute position on screen (top-left of the tooltip). */
  position?: UDim2;
  /** Tooltip width. Default: 220. */
  width?: number;
}

export function Tooltip(props: TooltipProps): React.Element | undefined {
  const {
    isVisible,
    title,
    description,
    rarity,
    stats,
    position = UDim2.fromOffset(0, 0),
    width = 220,
  } = props;

  const theme = useTheme();

  if (!isVisible) return undefined;

  const borderColor = rarity !== undefined ? RARITY_COLORS[rarity] : theme.panel.borderColor;

  return (
    <frame
      key="Tooltip"
      Position={position}
      Size={new UDim2(0, width, 0, 0)}
      AutomaticSize={Enum.AutomaticSize.Y}
      BackgroundColor3={theme.panel.backgroundColor}
      BackgroundTransparency={0.05}
      BorderSizePixel={0}
      ZIndex={200}
    >
      <uicorner CornerRadius={new UDim(0, 6)} />
      <uistroke Color={borderColor} Thickness={2} />
      <uipadding
        PaddingLeft={new UDim(0, 10)}
        PaddingRight={new UDim(0, 10)}
        PaddingTop={new UDim(0, 8)}
        PaddingBottom={new UDim(0, 8)}
      />
      <uilistlayout SortOrder={Enum.SortOrder.LayoutOrder} Padding={new UDim(0, 4)} />

      {/* Title */}
      <textlabel
        key="Title"
        LayoutOrder={1}
        Size={new UDim2(1, 0, 0, 0)}
        AutomaticSize={Enum.AutomaticSize.Y}
        BackgroundTransparency={1}
        Text={title}
        TextColor3={rarity !== undefined ? RARITY_COLORS[rarity] : theme.textColor}
        TextSize={16}
        Font={Enum.Font.GothamBold}
        TextXAlignment={Enum.TextXAlignment.Left}
        TextWrapped={true}
      />

      {/* Rarity label */}
      {rarity !== undefined && (
        <textlabel
          key="Rarity"
          LayoutOrder={2}
          Size={new UDim2(1, 0, 0, 0)}
          AutomaticSize={Enum.AutomaticSize.Y}
          BackgroundTransparency={1}
          Text={rarity}
          TextColor3={RARITY_COLORS[rarity]}
          TextSize={12}
          Font={Enum.Font.GothamMedium}
          TextXAlignment={Enum.TextXAlignment.Left}
        />
      )}

      {/* Description */}
      {description !== undefined && (
        <textlabel
          key="Description"
          LayoutOrder={3}
          Size={new UDim2(1, 0, 0, 0)}
          AutomaticSize={Enum.AutomaticSize.Y}
          BackgroundTransparency={1}
          Text={description}
          TextColor3={theme.textColor}
          TextSize={13}
          Font={Enum.Font.Gotham}
          TextXAlignment={Enum.TextXAlignment.Left}
          TextWrapped={true}
        />
      )}

      {/* Stats */}
      {stats !== undefined &&
        stats.map((line, i) => (
          <textlabel
            key={`Stat_${i}`}
            LayoutOrder={10 + i}
            Size={new UDim2(1, 0, 0, 0)}
            AutomaticSize={Enum.AutomaticSize.Y}
            BackgroundTransparency={1}
            Text={line}
            TextColor3={Color3.fromRGB(100, 220, 120)}
            TextSize={13}
            Font={Enum.Font.GothamMedium}
            TextXAlignment={Enum.TextXAlignment.Left}
            TextWrapped={true}
          />
        ))}
    </frame>
  );
}
