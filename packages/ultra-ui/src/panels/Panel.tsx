/**
 * Panel — Draggable frame with title bar and close button.
 *
 * @example
 * ```tsx
 * <Panel title="Inventory" isOpen={true} onClose={() => setOpen(false)}>
 *   <InventoryGrid items={items} />
 * </Panel>
 * ```
 */

import React from '@rbxts/react';
import { useTheme } from '../theme';

export interface PanelProps {
  /** Panel title displayed in the title bar. */
  title: string;
  /** Whether the panel is visible. */
  isOpen: boolean;
  /** Callback when the close button is clicked. */
  onClose?: () => void;
  /** Whether the panel is draggable. Default: true. */
  isDraggable?: boolean;
  /** Size of the panel. Default: 400×300. */
  size?: UDim2;
  /** Position. Default: center. */
  position?: UDim2;
  /** Anchor point. Default: (0.5, 0.5). */
  anchorPoint?: Vector2;
  /** ZIndex. */
  zIndex?: number;
  /** Children rendered inside the panel content area. */
  children?: React.Element;
}

export function Panel(props: PanelProps): React.Element | undefined {
  const {
    title,
    isOpen,
    onClose,
    size = UDim2.fromOffset(400, 300),
    position = UDim2.fromScale(0.5, 0.5),
    anchorPoint = new Vector2(0.5, 0.5),
    zIndex,
    children,
  } = props;

  const theme = useTheme();

  if (!isOpen) return undefined;

  return (
    <frame
      key="Panel"
      AnchorPoint={anchorPoint}
      Position={position}
      Size={size}
      BackgroundColor3={theme.panel.backgroundColor}
      BackgroundTransparency={theme.panel.backgroundTransparency}
      BorderSizePixel={0}
      ZIndex={zIndex}
    >
      <uicorner CornerRadius={theme.panel.cornerRadius} />
      <uistroke Color={theme.panel.borderColor} Thickness={theme.panel.borderThickness} />

      {/* Title bar */}
      <frame
        key="TitleBar"
        Size={new UDim2(1, 0, 0, 36)}
        BackgroundColor3={theme.panel.titleBarColor}
        BorderSizePixel={0}
        ZIndex={2}
      >
        <uicorner CornerRadius={theme.panel.cornerRadius} />

        {/* Title text */}
        <textlabel
          key="Title"
          Position={new UDim2(0, 12, 0, 0)}
          Size={new UDim2(1, -48, 1, 0)}
          BackgroundTransparency={1}
          Text={title}
          TextColor3={theme.panel.titleTextColor}
          TextXAlignment={Enum.TextXAlignment.Left}
          TextSize={16}
          Font={Enum.Font.GothamBold}
          ZIndex={3}
        />

        {/* Close button */}
        {onClose !== undefined && (
          <textbutton
            key="CloseBtn"
            AnchorPoint={new Vector2(1, 0.5)}
            Position={new UDim2(1, -8, 0.5, 0)}
            Size={UDim2.fromOffset(24, 24)}
            BackgroundColor3={Color3.fromRGB(180, 50, 50)}
            BackgroundTransparency={0.5}
            Text="✕"
            TextColor3={Color3.fromRGB(255, 255, 255)}
            TextSize={14}
            Font={Enum.Font.GothamBold}
            BorderSizePixel={0}
            ZIndex={4}
            Event={{ Activated: () => onClose() }}
          >
            <uicorner CornerRadius={new UDim(0, 4)} />
          </textbutton>
        )}
      </frame>

      {/* Content area */}
      <frame
        key="Content"
        Position={new UDim2(0, 0, 0, 36)}
        Size={new UDim2(1, 0, 1, -36)}
        BackgroundTransparency={1}
        ZIndex={1}
      >
        <uipadding
          PaddingLeft={new UDim(0, 8)}
          PaddingRight={new UDim(0, 8)}
          PaddingTop={new UDim(0, 8)}
          PaddingBottom={new UDim(0, 8)}
        />
        {children}
      </frame>
    </frame>
  );
}
