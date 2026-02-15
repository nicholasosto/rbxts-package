import React, { useEffect, useState } from '@rbxts/react';
import { useSelector } from '@rbxts/react-reflex';
import { IMAGE_CATALOG, ImageAsset } from '@nicholasosto/assets';
import { selectIsCatalogOpen } from '../../store';
import { useRootProducer } from '../hooks';
import { scaffold } from '../scaffold';

// ── Catalog data helpers ───────────────────────────────────

type CatalogKey = keyof typeof IMAGE_CATALOG;
const CATALOG_KEYS = [
  'AbilityIcons',
  'AttributeIcons',
  'BeamTextures',
  'ClassIcons',
  'CurrencyIcons',
  'DomainIcons',
  'EquipmentIcons',
  'GemIcons',
  'ItemSlotIcons',
  'MenuPanelIcons',
  'PanelBackgrounds',
  'RarityFrames',
  'Screens',
  'SoulGemIcons',
  'StatusIcons',
  'Textures',
  'UiControls',
] as const;

interface CatalogEntry {
  name: string;
  image: ImageAsset;
  isMissing: boolean;
}

/** Return true if the asset is a placeholder / known-missing value. */
function isPlaceholder(asset: ImageAsset): boolean {
  // 0 or empty string means the slot has no real asset yet
  return asset === ('rbxassetid://0' as unknown as ImageAsset);
}

function getEntries(key: CatalogKey): CatalogEntry[] {
  const subCatalog = IMAGE_CATALOG[key] as Record<string, ImageAsset>;
  const entries: CatalogEntry[] = [];
  for (const [name, image] of pairs(subCatalog)) {
    entries.push({
      name: name as string,
      image,
      isMissing: isPlaceholder(image),
    });
  }
  // Sort alphabetically for stable ordering
  table.sort(entries, (a, b) => a.name < b.name);
  return entries;
}

// ── Sub-components ─────────────────────────────────────────

interface TabButtonProps {
  label: string;
  isActive: boolean;
  layoutOrder: number;
  onClick: () => void;
}

function TabButton({ label, isActive, layoutOrder, onClick }: TabButtonProps): React.Element {
  return (
    <textbutton
      key={label}
      LayoutOrder={layoutOrder}
      Size={new UDim2(0, 120, 1, -4)}
      BackgroundColor3={isActive ? Color3.fromRGB(80, 140, 255) : Color3.fromRGB(50, 50, 65)}
      BackgroundTransparency={isActive ? 0 : 0.3}
      Text={label}
      TextColor3={isActive ? Color3.fromRGB(255, 255, 255) : Color3.fromRGB(180, 180, 190)}
      TextScaled={true}
      Font={isActive ? Enum.Font.GothamBold : Enum.Font.Gotham}
      BorderSizePixel={0}
      Event={{ Activated: onClick }}
    >
      <uicorner CornerRadius={new UDim(0, 6)} />
      <uipadding
        PaddingLeft={new UDim(0, 4)}
        PaddingRight={new UDim(0, 4)}
        PaddingTop={new UDim(0, 2)}
        PaddingBottom={new UDim(0, 2)}
      />
    </textbutton>
  );
}

interface ImageCellProps {
  entry: CatalogEntry;
  layoutOrder: number;
}

function ImageCell({ entry, layoutOrder }: ImageCellProps): React.Element {
  return (
    <frame
      key={entry.name}
      LayoutOrder={layoutOrder}
      Size={new UDim2(0, 100, 0, 120)}
      BackgroundColor3={entry.isMissing ? Color3.fromRGB(80, 30, 30) : Color3.fromRGB(35, 35, 48)}
      BackgroundTransparency={0.1}
      BorderSizePixel={0}
    >
      <uicorner CornerRadius={new UDim(0, 8)} />

      {/* Thumbnail */}
      <imagelabel
        key="Thumb"
        AnchorPoint={new Vector2(0.5, 0)}
        Position={UDim2.fromScale(0.5, 0.05)}
        Size={UDim2.fromScale(0.85, 0.65)}
        BackgroundTransparency={1}
        Image={entry.image as unknown as string}
        ScaleType={Enum.ScaleType.Fit}
      >
        {entry.isMissing && (
          <textlabel
            key="Missing"
            Size={UDim2.fromScale(1, 1)}
            BackgroundTransparency={1}
            Text="?"
            TextColor3={Color3.fromRGB(255, 80, 80)}
            TextScaled={true}
            Font={Enum.Font.GothamBold}
          />
        )}
      </imagelabel>

      {/* Label */}
      <textlabel
        key="Label"
        AnchorPoint={new Vector2(0.5, 1)}
        Position={UDim2.fromScale(0.5, 0.95)}
        Size={UDim2.fromScale(0.9, 0.22)}
        BackgroundTransparency={1}
        Text={entry.name}
        TextColor3={Color3.fromRGB(220, 220, 230)}
        TextScaled={true}
        Font={Enum.Font.Gotham}
        TextTruncate={Enum.TextTruncate.AtEnd}
      />
    </frame>
  );
}

// ── Main screen ────────────────────────────────────────────

export function AssetCatalogScreen(): React.Element {
  const isOpen = useSelector(selectIsCatalogOpen);
  const { closeAll } = useRootProducer();
  const [activeTab, setActiveTab] = useState<CatalogKey>('AbilityIcons');

  // Sync scaffold frame visibility with store state
  useEffect(() => {
    scaffold.gameplay.catalogFrame.Visible = isOpen;
  }, [isOpen]);

  const entries = getEntries(activeTab);
  const totalAssets = entries.size();
  const missingCount = entries.filter((e) => e.isMissing).size();

  return (
    <frame
      key="CatalogOverlay"
      Size={UDim2.fromScale(1, 1)}
      BackgroundColor3={Color3.fromRGB(18, 18, 28)}
      BackgroundTransparency={0.05}
    >
      {/* ── Header bar ───────────────────────────────────── */}
      <frame
        key="Header"
        Size={UDim2.fromScale(1, 0.07)}
        BackgroundColor3={Color3.fromRGB(25, 25, 40)}
        BackgroundTransparency={0}
        BorderSizePixel={0}
      >
        <textlabel
          key="Title"
          AnchorPoint={new Vector2(0, 0.5)}
          Position={new UDim2(0, 16, 0.5, 0)}
          Size={UDim2.fromScale(0.3, 0.7)}
          BackgroundTransparency={1}
          Text="Asset Catalog"
          TextColor3={Color3.fromRGB(255, 255, 255)}
          TextScaled={true}
          Font={Enum.Font.GothamBold}
          TextXAlignment={Enum.TextXAlignment.Left}
        />

        {/* Stats */}
        <textlabel
          key="Stats"
          AnchorPoint={new Vector2(0.5, 0.5)}
          Position={UDim2.fromScale(0.5, 0.5)}
          Size={UDim2.fromScale(0.25, 0.5)}
          BackgroundTransparency={1}
          Text={`${activeTab}  •  ${totalAssets} assets  •  ${missingCount} missing`}
          TextColor3={
            missingCount > 0 ? Color3.fromRGB(255, 180, 80) : Color3.fromRGB(140, 255, 140)
          }
          TextScaled={true}
          Font={Enum.Font.Gotham}
        />

        {/* Close button */}
        <textbutton
          key="CloseBtn"
          AnchorPoint={new Vector2(1, 0.5)}
          Position={new UDim2(1, -12, 0.5, 0)}
          Size={new UDim2(0, 36, 0, 36)}
          BackgroundColor3={Color3.fromRGB(180, 50, 50)}
          Text="X"
          TextColor3={Color3.fromRGB(255, 255, 255)}
          TextScaled={true}
          Font={Enum.Font.GothamBold}
          BorderSizePixel={0}
          Event={{ Activated: () => closeAll() }}
        >
          <uicorner CornerRadius={new UDim(0, 6)} />
        </textbutton>
      </frame>

      {/* ── Tab strip ────────────────────────────────────── */}
      <scrollingframe
        key="TabStrip"
        AnchorPoint={new Vector2(0, 0)}
        Position={UDim2.fromScale(0, 0.07)}
        Size={UDim2.fromScale(1, 0.055)}
        BackgroundColor3={Color3.fromRGB(22, 22, 35)}
        BackgroundTransparency={0}
        BorderSizePixel={0}
        ScrollBarThickness={0}
        CanvasSize={new UDim2(0, CATALOG_KEYS.size() * 124, 0, 0)}
        ScrollingDirection={Enum.ScrollingDirection.X}
        AutomaticCanvasSize={Enum.AutomaticSize.X}
      >
        <uilistlayout
          FillDirection={Enum.FillDirection.Horizontal}
          SortOrder={Enum.SortOrder.LayoutOrder}
          Padding={new UDim(0, 4)}
          VerticalAlignment={Enum.VerticalAlignment.Center}
        />
        <uipadding PaddingLeft={new UDim(0, 8)} PaddingRight={new UDim(0, 8)} />

        {CATALOG_KEYS.map((key, i) => (
          <TabButton
            key={key}
            label={key}
            isActive={key === activeTab}
            layoutOrder={i}
            onClick={() => setActiveTab(key as CatalogKey)}
          />
        ))}
      </scrollingframe>

      {/* ── Image grid ───────────────────────────────────── */}
      <scrollingframe
        key="Grid"
        AnchorPoint={new Vector2(0.5, 1)}
        Position={UDim2.fromScale(0.5, 0.98)}
        Size={UDim2.fromScale(0.95, 0.83)}
        BackgroundTransparency={1}
        BorderSizePixel={0}
        ScrollBarThickness={6}
        ScrollBarImageColor3={Color3.fromRGB(100, 100, 120)}
        CanvasSize={UDim2.fromScale(0, 0)}
        AutomaticCanvasSize={Enum.AutomaticSize.Y}
        ScrollingDirection={Enum.ScrollingDirection.Y}
      >
        <uigridlayout
          CellSize={new UDim2(0, 100, 0, 120)}
          CellPadding={new UDim2(0, 8, 0, 8)}
          SortOrder={Enum.SortOrder.LayoutOrder}
          HorizontalAlignment={Enum.HorizontalAlignment.Center}
        />
        <uipadding
          PaddingTop={new UDim(0, 8)}
          PaddingBottom={new UDim(0, 8)}
          PaddingLeft={new UDim(0, 8)}
          PaddingRight={new UDim(0, 8)}
        />

        {entries.map((entry, i) => (
          <ImageCell key={entry.name} entry={entry} layoutOrder={i} />
        ))}
      </scrollingframe>
    </frame>
  );
}
