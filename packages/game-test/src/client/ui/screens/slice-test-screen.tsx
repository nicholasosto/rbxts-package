/**
 * SliceTestScreen — In-game 9-slice frame tester.
 *
 * Renders each uploaded SliceFrame entry at multiple sizes to verify
 * that 9-slice stretching works correctly. Shows panel frames and
 * title bars side-by-side with size labels.
 *
 * Toggle: Press "P" to show/hide.
 */

import { IMAGE_CATALOG } from '@nicholasosto/assets';
import { NineSlice } from '@nicholasosto/ultra-ui';
import React, { useEffect, useState } from '@rbxts/react';
import { UserInputService } from '@rbxts/services';

// ── Slice frame entries with real asset IDs (skip placeholder 0s) ───────
type SliceEntry = {
  label: string;
  image: string;
  sliceCenter: Rect;
};

function getUploadedSliceFrames(): SliceEntry[] {
  const entries: SliceEntry[] = [];
  const catalog = IMAGE_CATALOG.SliceFrames;

  for (const [key, descriptor] of pairs(catalog)) {
    // Skip placeholders that haven't been uploaded yet
    if ((descriptor.image as unknown as string) === 'rbxassetid://0') continue;
    entries.push({
      label: key as string,
      image: descriptor.image as unknown as string,
      sliceCenter: new Rect(
        descriptor.sliceMinX,
        descriptor.sliceMinY,
        descriptor.sliceMaxX,
        descriptor.sliceMaxY,
      ),
    });
  }
  return entries;
}

// ── Test sizes to render each frame at ──────────────────────────────────
const TEST_SIZES = [
  { label: '100×100', size: UDim2.fromOffset(100, 100) },
  { label: '200×60', size: UDim2.fromOffset(200, 60) },
  { label: '200×200', size: UDim2.fromOffset(200, 200) },
  { label: '400×120', size: UDim2.fromOffset(400, 120) },
  { label: '400×300', size: UDim2.fromOffset(400, 300) },
  { label: '600×400', size: UDim2.fromOffset(600, 400) },
];

// ── Individual frame preview ────────────────────────────────────────────
function FramePreview({
  entry,
  testSize,
  layoutOrder,
}: {
  entry: SliceEntry;
  testSize: { label: string; size: UDim2 };
  layoutOrder: number;
}): React.Element {
  return (
    <frame
      key={`${entry.label}-${testSize.label}`}
      LayoutOrder={layoutOrder}
      Size={new UDim2(0, testSize.size.X.Offset + 20, 0, testSize.size.Y.Offset + 40)}
      BackgroundTransparency={1}
    >
      {/* Size label */}
      <textlabel
        key="SizeLabel"
        Size={new UDim2(1, 0, 0, 18)}
        BackgroundTransparency={1}
        Text={`${entry.label} — ${testSize.label}`}
        TextColor3={Color3.fromRGB(200, 210, 230)}
        TextSize={12}
        Font={Enum.Font.GothamMedium}
        TextXAlignment={Enum.TextXAlignment.Left}
      />
      {/* 9-slice frame */}
      <frame
        key="FrameContainer"
        Position={new UDim2(0, 0, 0, 22)}
        Size={testSize.size}
        BackgroundTransparency={1}
      >
        <NineSlice image={entry.image} sliceCenter={entry.sliceCenter} size={UDim2.fromScale(1, 1)}>
          {/* Inner content sample text */}
          <textlabel
            key="Inner"
            AnchorPoint={new Vector2(0.5, 0.5)}
            Position={UDim2.fromScale(0.5, 0.5)}
            Size={UDim2.fromScale(0.8, 0.6)}
            BackgroundTransparency={1}
            Text="Content"
            TextColor3={Color3.fromRGB(180, 190, 210)}
            TextScaled={true}
            Font={Enum.Font.Gotham}
          />
        </NineSlice>
      </frame>
    </frame>
  );
}

// ── Main test screen ────────────────────────────────────────────────────
export function SliceTestScreen(): React.Element {
  const [isOpen, setIsOpen] = useState(false);

  // Toggle with "P" key
  useEffect(() => {
    const conn = UserInputService.InputBegan.Connect((input, processed) => {
      if (processed) return;
      if (input.KeyCode === Enum.KeyCode.P) {
        setIsOpen((prev) => !prev);
      }
    });
    return () => conn.Disconnect();
  }, []);

  if (!isOpen) return <></>;

  const entries = getUploadedSliceFrames();

  if (entries.size() === 0) {
    return (
      <screengui key="SliceTest" DisplayOrder={50} IgnoreGuiInset={true}>
        <textlabel
          key="NoEntries"
          AnchorPoint={new Vector2(0.5, 0.5)}
          Position={UDim2.fromScale(0.5, 0.5)}
          Size={UDim2.fromScale(0.4, 0.1)}
          BackgroundColor3={Color3.fromRGB(40, 30, 30)}
          Text="No uploaded slice frames found (all are rbxassetid://0)"
          TextColor3={Color3.fromRGB(255, 120, 120)}
          TextScaled={true}
          Font={Enum.Font.GothamMedium}
        >
          <uicorner CornerRadius={new UDim(0, 8)} />
        </textlabel>
      </screengui>
    );
  }

  let order = 0;

  return (
    <screengui key="SliceTest" DisplayOrder={50} IgnoreGuiInset={true}>
      {/* Dark overlay */}
      <frame
        key="Overlay"
        Size={UDim2.fromScale(1, 1)}
        BackgroundColor3={Color3.fromRGB(10, 10, 15)}
        BackgroundTransparency={0.15}
        BorderSizePixel={0}
      />

      {/* Header */}
      <textlabel
        key="Header"
        Position={new UDim2(0, 16, 0, 8)}
        Size={new UDim2(0.5, 0, 0, 30)}
        BackgroundTransparency={1}
        Text={`9-Slice Test — ${entries.size()} frame(s) × ${TEST_SIZES.size()} sizes  [P to close]`}
        TextColor3={Color3.fromRGB(0, 220, 255)}
        TextSize={16}
        Font={Enum.Font.GothamBold}
        TextXAlignment={Enum.TextXAlignment.Left}
      />

      {/* Scrollable grid of previews */}
      <scrollingframe
        key="Grid"
        Position={new UDim2(0, 8, 0, 44)}
        Size={new UDim2(1, -16, 1, -52)}
        BackgroundTransparency={1}
        BorderSizePixel={0}
        ScrollBarThickness={8}
        ScrollBarImageColor3={Color3.fromRGB(80, 80, 100)}
        CanvasSize={UDim2.fromScale(0, 0)}
        AutomaticCanvasSize={Enum.AutomaticSize.XY}
        ScrollingDirection={Enum.ScrollingDirection.XY}
      >
        <uilistlayout
          FillDirection={Enum.FillDirection.Vertical}
          SortOrder={Enum.SortOrder.LayoutOrder}
          Padding={new UDim(0, 12)}
        />

        {entries.map((entry) => (
          <frame
            key={entry.label}
            LayoutOrder={order++}
            Size={new UDim2(1, 0, 0, 0)}
            AutomaticSize={Enum.AutomaticSize.Y}
            BackgroundTransparency={1}
          >
            {/* Domain label */}
            <textlabel
              key="DomainLabel"
              Size={new UDim2(1, 0, 0, 24)}
              BackgroundTransparency={1}
              Text={`━━━ ${entry.label} ━━━`}
              TextColor3={Color3.fromRGB(255, 200, 100)}
              TextSize={14}
              Font={Enum.Font.GothamBold}
              TextXAlignment={Enum.TextXAlignment.Left}
            />

            {/* Sizes row */}
            <frame
              key="SizesRow"
              Position={new UDim2(0, 0, 0, 28)}
              Size={new UDim2(1, 0, 0, 0)}
              AutomaticSize={Enum.AutomaticSize.XY}
              BackgroundTransparency={1}
            >
              <uilistlayout
                FillDirection={Enum.FillDirection.Horizontal}
                SortOrder={Enum.SortOrder.LayoutOrder}
                Padding={new UDim(0, 16)}
                Wraps={true}
              />
              {TEST_SIZES.map((testSize, i) => (
                <FramePreview
                  key={`${entry.label}-${testSize.label}`}
                  entry={entry}
                  testSize={testSize}
                  layoutOrder={i}
                />
              ))}
            </frame>
          </frame>
        ))}
      </scrollingframe>
    </screengui>
  );
}
