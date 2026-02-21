/**
 * TabContainer — Panel with switchable tab buttons.
 *
 * @example
 * ```tsx
 * <TabContainer
 *   title="Menu"
 *   tabs={[
 *     { label: "Character", content: <CharacterPanel /> },
 *     { label: "Settings", content: <SettingsPanel /> },
 *   ]}
 *   isOpen={true}
 *   onClose={() => setOpen(false)}
 * />
 * ```
 */

import React from '@rbxts/react';
import { useTheme } from '../theme';

/** Definition of a single tab. */
export interface TabDefinition {
  /** Tab button label. */
  label: string;
  /** Optional icon image for the tab button. */
  icon?: string;
  /** Content to render when this tab is active. */
  content: React.Element;
}

export interface TabContainerProps {
  /** Panel title. */
  title: string;
  /** Array of tab definitions. */
  tabs: TabDefinition[];
  /** Whether the panel is visible. */
  isOpen: boolean;
  /** Callback when closed. */
  onClose?: () => void;
  /** Initial active tab index. Default: 0. */
  defaultTab?: number;
  /** Controlled active tab index (optional). */
  activeTab?: number;
  /** Called when a tab is selected. */
  onTabChange?: (index: number, tab: TabDefinition) => void;
  /** Panel size. Default: 450×350. */
  size?: UDim2;
  /** Position. */
  position?: UDim2;
  /** Anchor point. */
  anchorPoint?: Vector2;
}

export function TabContainer(props: TabContainerProps): React.Element | undefined {
  const {
    title,
    tabs,
    isOpen,
    onClose,
    defaultTab = 0,
    activeTab: controlledActiveTab,
    onTabChange,
    size = UDim2.fromOffset(450, 350),
    position = UDim2.fromScale(0.5, 0.5),
    anchorPoint = new Vector2(0.5, 0.5),
  } = props;

  const theme = useTheme();
  const [internalActiveIndex, setInternalActiveIndex] = React.useState(defaultTab);
  const hasTabs = tabs.size() > 0;
  const currentIndex = controlledActiveTab ?? internalActiveIndex;
  const safeIndex = hasTabs ? math.clamp(currentIndex, 0, tabs.size() - 1) : 0;
  const selectedTab = hasTabs ? tabs[safeIndex] : undefined;

  React.useEffect(() => {
    if (!hasTabs) return;
    if (controlledActiveTab !== undefined) return;
    setInternalActiveIndex(defaultTab);
  }, [controlledActiveTab, defaultTab, hasTabs]);

  React.useEffect(() => {
    if (!hasTabs) return;
    if (controlledActiveTab !== undefined) return;
    if (internalActiveIndex === safeIndex) return;
    setInternalActiveIndex(safeIndex);
  }, [controlledActiveTab, hasTabs, internalActiveIndex, safeIndex]);

  const handleTabSelected = (index: number) => {
    const tab = tabs[index];
    if (tab === undefined) return;

    if (controlledActiveTab === undefined) {
      setInternalActiveIndex(index);
    }

    onTabChange?.(index, tab);
  };

  if (!isOpen || !hasTabs || selectedTab === undefined) return undefined;

  return (
    <frame
      key="TabContainer"
      AnchorPoint={anchorPoint}
      Position={position}
      Size={size}
      BackgroundColor3={theme.panel.backgroundColor}
      BackgroundTransparency={theme.panel.backgroundTransparency}
      BorderSizePixel={0}
    >
      <uicorner CornerRadius={theme.panel.cornerRadius} />
      <uistroke Color={theme.panel.borderColor} Thickness={theme.panel.borderThickness} />

      {/* Title bar */}
      <frame
        key="TitleBar"
        Size={new UDim2(1, 0, 0, 32)}
        BackgroundColor3={theme.panel.titleBarColor}
        BorderSizePixel={0}
        ZIndex={2}
      >
        <uicorner CornerRadius={theme.panel.cornerRadius} />
        <textlabel
          key="Title"
          Position={new UDim2(0, 12, 0, 0)}
          Size={new UDim2(1, -48, 1, 0)}
          BackgroundTransparency={1}
          Text={title}
          TextColor3={theme.panel.titleTextColor}
          TextXAlignment={Enum.TextXAlignment.Left}
          TextSize={14}
          Font={Enum.Font.GothamBold}
          ZIndex={3}
        />
        {onClose !== undefined && (
          <textbutton
            key="CloseBtn"
            AnchorPoint={new Vector2(1, 0.5)}
            Position={new UDim2(1, -8, 0.5, 0)}
            Size={UDim2.fromOffset(22, 22)}
            BackgroundColor3={Color3.fromRGB(180, 50, 50)}
            BackgroundTransparency={0.5}
            Text="✕"
            TextColor3={Color3.fromRGB(255, 255, 255)}
            TextSize={12}
            Font={Enum.Font.GothamBold}
            BorderSizePixel={0}
            ZIndex={4}
            Event={{ Activated: () => onClose() }}
          >
            <uicorner CornerRadius={new UDim(0, 4)} />
          </textbutton>
        )}
      </frame>

      {/* Tab buttons */}
      <frame
        key="TabBar"
        Position={new UDim2(0, 0, 0, 32)}
        Size={new UDim2(1, 0, 0, 30)}
        BackgroundTransparency={1}
        ZIndex={2}
      >
        <uilistlayout
          FillDirection={Enum.FillDirection.Horizontal}
          HorizontalAlignment={Enum.HorizontalAlignment.Left}
          Padding={new UDim(0, 2)}
        />
        <uipadding PaddingLeft={new UDim(0, 8)} />

        {tabs.map((tab, idx) => {
          const isActive = idx === safeIndex;
          return (
            <textbutton
              key={`Tab_${idx}`}
              Size={new UDim2(0, 80, 1, 0)}
              BackgroundColor3={isActive ? theme.panel.backgroundColor : theme.panel.titleBarColor}
              BackgroundTransparency={isActive ? 0 : 0.3}
              Text={tab.label}
              TextColor3={isActive ? theme.panel.titleTextColor : theme.panel.borderColor}
              TextSize={12}
              Font={isActive ? Enum.Font.GothamBold : Enum.Font.GothamMedium}
              BorderSizePixel={0}
              LayoutOrder={idx}
              Event={{ Activated: () => handleTabSelected(idx) }}
            >
              <uicorner CornerRadius={new UDim(0, 4)} />
            </textbutton>
          );
        })}
      </frame>

      {/* Content area */}
      <frame
        key="Content"
        Position={new UDim2(0, 0, 0, 62)}
        Size={new UDim2(1, 0, 1, -62)}
        BackgroundTransparency={1}
        ZIndex={1}
      >
        <uipadding
          PaddingLeft={new UDim(0, 8)}
          PaddingRight={new UDim(0, 8)}
          PaddingTop={new UDim(0, 8)}
          PaddingBottom={new UDim(0, 8)}
        />
        {selectedTab.content}
      </frame>
    </frame>
  );
}
