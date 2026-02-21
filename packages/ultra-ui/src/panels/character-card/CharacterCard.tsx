/**
 * CharacterCard — A metallic sci-fi HUD card displaying a character portrait,
 * username, level badge, and health/mana/stamina resource bars.
 *
 * Layout (left → right):
 *   Portrait (square) | Username banner + 3 resource bars
 *   Level badge overlaps bottom-right of portrait.
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

// ─── Default Asset IDs (Image type) ────────────────────────────────────────
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
  cardBg: Color3.fromRGB(20, 20, 30),
} as const;

// ─── Default Dimensions ────────────────────────────────────────────────────

/** Card overall: 380 × 150 px (wider than tall, compact) */
const DEFAULT_SIZE = UDim2.fromOffset(380, 150);
const DEFAULT_POSITION = UDim2.fromOffset(16, 16);

/** Portrait is a square matching the card height minus padding. */
const PORTRAIT_SIZE_PX = 120; // slightly smaller than card height for frame inset

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

  // Bar width fills the right section minus padding
  const barSize = new UDim2(1, 0, 0, 20);

  return (
    <frame
      key="CharacterCard"
      Size={size}
      Position={position}
      AnchorPoint={anchorPoint}
      BackgroundColor3={COLORS.cardBg}
      BackgroundTransparency={0.3}
      BorderSizePixel={0}
    >
      <uicorner CornerRadius={new UDim(0, 6)} />

      {/* ── Card Frame Overlay ──────────────────────────────── */}
      <imagelabel
        key="CardFrame"
        Size={UDim2.fromScale(1, 1)}
        BackgroundTransparency={1}
        Image={ASSETS.CardFrame}
        ScaleType={Enum.ScaleType.Stretch}
        ImageTransparency={0}
        ZIndex={5}
      />

      {/* ── Portrait Section (left, square) ────────────────── */}
      <frame
        key="PortraitSection"
        Size={UDim2.fromOffset(PORTRAIT_SIZE_PX, PORTRAIT_SIZE_PX)}
        Position={UDim2.fromScale(0, 0.5)}
        AnchorPoint={new Vector2(0, 0.5)}
        BackgroundTransparency={1}
        ZIndex={2}
      >
        <uipadding
          PaddingTop={new UDim(0, 8)}
          PaddingBottom={new UDim(0, 8)}
          PaddingLeft={new UDim(0, 8)}
          PaddingRight={new UDim(0, 4)}
        />

        {/* Portrait background */}
        <frame
          key="PortraitBg"
          Size={UDim2.fromScale(1, 1)}
          BackgroundColor3={COLORS.portraitBg}
          BorderSizePixel={0}
          ZIndex={1}
        >
          <uicorner CornerRadius={new UDim(0, 4)} />

          {/* Character thumbnail */}
          {portraitImage !== undefined && (
            <imagelabel
              key="PortraitImage"
              Size={UDim2.fromScale(1, 1)}
              BackgroundTransparency={1}
              Image={portraitImage}
              ScaleType={Enum.ScaleType.Crop}
              ZIndex={2}
            >
              <uicorner CornerRadius={new UDim(0, 4)} />
            </imagelabel>
          )}
        </frame>

        {/* Portrait border overlay — sits on top of portrait */}
        <imagelabel
          key="PortraitBorder"
          Size={new UDim2(1, 8, 1, 8)}
          Position={UDim2.fromScale(0.5, 0.5)}
          AnchorPoint={new Vector2(0.5, 0.5)}
          BackgroundTransparency={1}
          Image={ASSETS.PortraitBorder}
          ScaleType={Enum.ScaleType.Stretch}
          ZIndex={3}
        />
      </frame>

      {/* ── Level Badge (overlaps bottom-right of portrait) ── */}
      <frame
        key="LevelBadge"
        Size={UDim2.fromOffset(48, 28)}
        Position={UDim2.fromOffset(PORTRAIT_SIZE_PX - 8, PORTRAIT_SIZE_PX - 24)}
        AnchorPoint={new Vector2(0.5, 0.5)}
        BackgroundTransparency={1}
        ZIndex={6}
      >
        <imagelabel
          key="BadgeBg"
          Size={UDim2.fromScale(1, 1)}
          BackgroundTransparency={1}
          Image={ASSETS.LevelBadge}
          ScaleType={Enum.ScaleType.Stretch}
          ImageTransparency={0}
          ZIndex={0}
        />
        <textlabel
          key="LevelText"
          Size={UDim2.fromScale(1, 1)}
          BackgroundTransparency={1}
          Text={`Lv ${level}`}
          TextColor3={COLORS.levelNumber}
          Font={Enum.Font.GothamBold}
          TextSize={13}
          TextXAlignment={Enum.TextXAlignment.Center}
          TextYAlignment={Enum.TextYAlignment.Center}
          TextStrokeTransparency={0.3}
          TextStrokeColor3={Color3.fromRGB(0, 0, 0)}
          ZIndex={1}
        />
      </frame>

      {/* ── Info Section (right of portrait) ────────────────── */}
      <frame
        key="InfoSection"
        Size={new UDim2(1, -PORTRAIT_SIZE_PX, 1, 0)}
        Position={UDim2.fromOffset(PORTRAIT_SIZE_PX, 0)}
        BackgroundTransparency={1}
        ZIndex={2}
      >
        <uipadding
          PaddingTop={new UDim(0, 10)}
          PaddingBottom={new UDim(0, 10)}
          PaddingLeft={new UDim(0, 6)}
          PaddingRight={new UDim(0, 14)}
        />
        <uilistlayout
          SortOrder={Enum.SortOrder.LayoutOrder}
          VerticalAlignment={Enum.VerticalAlignment.Top}
          HorizontalAlignment={Enum.HorizontalAlignment.Center}
          Padding={new UDim(0, 5)}
        />

        {/* ── Username Banner ───────────────────────────────── */}
        <frame
          key="UsernameBanner"
          LayoutOrder={0}
          Size={new UDim2(1, 0, 0, 26)}
          BackgroundTransparency={1}
        >
          <imagelabel
            key="BannerBg"
            Size={UDim2.fromScale(1, 1)}
            BackgroundTransparency={1}
            Image={ASSETS.UsernameBanner}
            ScaleType={Enum.ScaleType.Stretch}
            ImageTransparency={0}
            ZIndex={0}
          />
          <textlabel
            key="UsernameText"
            Size={UDim2.fromScale(1, 1)}
            BackgroundTransparency={1}
            Text={username}
            TextColor3={COLORS.username}
            Font={Enum.Font.GothamBold}
            TextSize={14}
            TextXAlignment={Enum.TextXAlignment.Center}
            TextYAlignment={Enum.TextYAlignment.Center}
            TextStrokeTransparency={0.3}
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
      </frame>
    </frame>
  );
}
