/**
 * CharacterCard — A metallic sci-fi HUD card displaying a character portrait,
 * username, level badge, and health/mana/stamina resource bars.
 *
 * Designed for ScreenGui placement at the top-left of the screen.
 *
 * @example
 * ```tsx
 * <CharacterCard
 *   username="ShadowKnight"
 *   level={25}
 *   health={{ current: 750, max: 1000 }}
 *   mana={{ current: 300, max: 500 }}
 *   stamina={{ current: 180, max: 200 }}
 * />
 * ```
 */

import React from '@rbxts/react';
import { ResourceBar, ResourceBarStyle } from '../../bars';
import type { CharacterCardProps } from './types';

// ─── Default Asset IDs ─────────────────────────────────────────────────────
// Generated via rbxts-mcp generate_and_upload_decal pipeline.

const ASSETS = {
  CardFrame: 'rbxassetid://113565347585990',
  PortraitBorder: 'rbxassetid://89132910467794',
  UsernameBanner: 'rbxassetid://123800454254824',
  LevelBadge: 'rbxassetid://126474240603682',
} as const;

// ─── Theme Colors ──────────────────────────────────────────────────────────

const COLORS = {
  username: Color3.fromRGB(255, 255, 255),
  levelLabel: Color3.fromRGB(255, 200, 60),
  levelNumber: Color3.fromRGB(255, 215, 0),
  portraitBg: Color3.fromRGB(15, 15, 25),
} as const;

// ─── Default Dimensions ────────────────────────────────────────────────────

const DEFAULT_SIZE = UDim2.fromOffset(450, 140);
const DEFAULT_POSITION = UDim2.fromOffset(20, 20);

// ─── Component ─────────────────────────────────────────────────────────────

export function CharacterCard(props: CharacterCardProps): React.Element | undefined {
  const {
    username,
    level,
    health,
    mana,
    stamina,
    portraitImage,
    size = DEFAULT_SIZE,
    position = DEFAULT_POSITION,
    anchorPoint = Vector2.zero,
    visible = true,
  } = props;

  if (!visible) return undefined;

  // Bar sizes — slightly narrower to fit inside the card frame
  const barSize = new UDim2(1, -8, 0, 18);

  return (
    <frame
      key="CharacterCard"
      Size={size}
      Position={position}
      AnchorPoint={anchorPoint}
      BackgroundTransparency={1}
      BorderSizePixel={0}
    >
      {/* ── Card Frame Background ───────────────────────────── */}
      <imagelabel
        key="CardFrame"
        Size={UDim2.fromScale(1, 1)}
        BackgroundTransparency={1}
        Image={ASSETS.CardFrame}
        ScaleType={Enum.ScaleType.Stretch}
        ImageTransparency={0.05}
        ZIndex={0}
      />

      {/* ── Portrait Section (left ~30%) ────────────────────── */}
      <frame
        key="PortraitSection"
        Size={UDim2.fromScale(0.28, 1)}
        Position={UDim2.fromScale(0, 0)}
        BackgroundTransparency={1}
        ZIndex={1}
      >
        {/* Portrait background */}
        <frame
          key="PortraitBg"
          Size={new UDim2(0.85, 0, 0.85, 0)}
          Position={UDim2.fromScale(0.5, 0.5)}
          AnchorPoint={new Vector2(0.5, 0.5)}
          BackgroundColor3={COLORS.portraitBg}
          BorderSizePixel={0}
          ZIndex={1}
        >
          <uicorner CornerRadius={new UDim(0, 4)} />

          {/* Character thumbnail */}
          {portraitImage !== undefined && (
            <imagelabel
              key="PortraitImage"
              Size={UDim2.fromScale(0.92, 0.92)}
              Position={UDim2.fromScale(0.5, 0.5)}
              AnchorPoint={new Vector2(0.5, 0.5)}
              BackgroundTransparency={1}
              Image={portraitImage}
              ScaleType={Enum.ScaleType.Fit}
              ZIndex={2}
            />
          )}
        </frame>

        {/* Portrait border overlay */}
        <imagelabel
          key="PortraitBorder"
          Size={new UDim2(0.92, 0, 0.92, 0)}
          Position={UDim2.fromScale(0.5, 0.5)}
          AnchorPoint={new Vector2(0.5, 0.5)}
          BackgroundTransparency={1}
          Image={ASSETS.PortraitBorder}
          ScaleType={Enum.ScaleType.Fit}
          ZIndex={3}
        />
      </frame>

      {/* ── Info Section (right ~70%) ───────────────────────── */}
      <frame
        key="InfoSection"
        Size={new UDim2(0.7, 0, 1, 0)}
        Position={UDim2.fromScale(0.28, 0)}
        BackgroundTransparency={1}
        ZIndex={1}
      >
        <uilistlayout
          SortOrder={Enum.SortOrder.LayoutOrder}
          VerticalAlignment={Enum.VerticalAlignment.Top}
          HorizontalAlignment={Enum.HorizontalAlignment.Center}
          Padding={new UDim(0, 3)}
        />
        <uipadding
          PaddingTop={new UDim(0, 4)}
          PaddingLeft={new UDim(0, 4)}
          PaddingRight={new UDim(0, 4)}
        />

        {/* ── Username Banner ───────────────────────────────── */}
        <frame
          key="UsernameBannerContainer"
          LayoutOrder={1}
          Size={new UDim2(1, 0, 0, 28)}
          BackgroundTransparency={1}
        >
          <imagelabel
            key="BannerBg"
            Size={UDim2.fromScale(1, 1)}
            BackgroundTransparency={1}
            Image={ASSETS.UsernameBanner}
            ScaleType={Enum.ScaleType.Stretch}
            ZIndex={0}
          />
          <textlabel
            key="UsernameText"
            Size={UDim2.fromScale(1, 1)}
            BackgroundTransparency={1}
            Text={username}
            TextColor3={COLORS.username}
            Font={Enum.Font.GothamBold}
            TextSize={16}
            TextXAlignment={Enum.TextXAlignment.Center}
            TextYAlignment={Enum.TextYAlignment.Center}
            TextStrokeTransparency={0.4}
            TextStrokeColor3={Color3.fromRGB(0, 0, 0)}
            ZIndex={1}
          />
        </frame>

        {/* ── Health Bar (red) ──────────────────────────────── */}
        <ResourceBar
          current={health.current}
          max={health.max}
          style={ResourceBarStyle.Health}
          theme={{
            fillColor: Color3.fromRGB(200, 30, 30),
            lowFillColor: Color3.fromRGB(140, 20, 20),
            backgroundColor: Color3.fromRGB(40, 10, 10),
            ghostColor: Color3.fromRGB(255, 80, 80),
          }}
          label="HP"
          size={barSize}
        />

        {/* ── Mana Bar (blue) ──────────────────────────────── */}
        <ResourceBar
          current={mana.current}
          max={mana.max}
          style={ResourceBarStyle.Mana}
          label="MP"
          size={barSize}
        />

        {/* ── Stamina Bar (green) ──────────────────────────── */}
        <ResourceBar
          current={stamina.current}
          max={stamina.max}
          style={ResourceBarStyle.Stamina}
          theme={{
            fillColor: Color3.fromRGB(80, 200, 40),
            lowFillColor: Color3.fromRGB(60, 140, 20),
            backgroundColor: Color3.fromRGB(15, 35, 10),
            ghostColor: Color3.fromRGB(140, 255, 100),
          }}
          label="SP"
          size={barSize}
        />

        {/* ── Level Badge (bottom-right) ────────────────────── */}
        <frame
          key="LevelBadgeContainer"
          LayoutOrder={5}
          Size={new UDim2(0.4, 0, 0, 24)}
          BackgroundTransparency={1}
          AnchorPoint={new Vector2(1, 1)}
        >
          <uilistlayout
            SortOrder={Enum.SortOrder.LayoutOrder}
            FillDirection={Enum.FillDirection.Horizontal}
            VerticalAlignment={Enum.VerticalAlignment.Center}
            HorizontalAlignment={Enum.HorizontalAlignment.Right}
            Padding={new UDim(0, 2)}
          />

          <imagelabel
            key="BadgeBg"
            LayoutOrder={1}
            Size={new UDim2(1, 0, 1, 0)}
            BackgroundTransparency={1}
            Image={ASSETS.LevelBadge}
            ScaleType={Enum.ScaleType.Stretch}
            ZIndex={0}
          />

          {/* Level text overlay */}
          <textlabel
            key="LvlPrefix"
            LayoutOrder={1}
            Size={new UDim2(0.4, 0, 1, 0)}
            BackgroundTransparency={1}
            Text="Lvl"
            TextColor3={COLORS.levelLabel}
            Font={Enum.Font.GothamMedium}
            TextSize={12}
            TextXAlignment={Enum.TextXAlignment.Right}
            ZIndex={1}
          />
          <textlabel
            key="LvlNumber"
            LayoutOrder={2}
            Size={new UDim2(0.55, 0, 1, 0)}
            BackgroundTransparency={1}
            Text={tostring(level)}
            TextColor3={COLORS.levelNumber}
            Font={Enum.Font.GothamBold}
            TextSize={18}
            TextXAlignment={Enum.TextXAlignment.Left}
            ZIndex={1}
          />
        </frame>
      </frame>
    </frame>
  );
}
