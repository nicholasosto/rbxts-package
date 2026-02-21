import { IMAGE_CATALOG } from '@nicholasosto/assets';
import { Panel } from '@nicholasosto/ultra-ui';
import React, { useEffect, useState } from '@rbxts/react';
import { useSelector } from '@rbxts/react-reflex';
import { selectIsMenuOpen } from '../../store';
import { scaffold } from '../scaffold';

type MenuPanelKey = keyof typeof IMAGE_CATALOG.MenuPanelIcons;

const MENU_PANEL_KEYS: MenuPanelKey[] = [
  'Settings',
  'Inventory',
  'Quests',
  'Character',
  'Forge',
  'Shop',
  'Teleport',
];

/**
 * MenuScreen — Icon rail that toggles placeholder panels.
 *
 * Portaled into the scaffold's Gameplay > Panels > Menu > Content.
 */
export function MenuScreen(): React.Element {
  const isOpen = useSelector(selectIsMenuOpen);
  const [activePanel, setActivePanel] = useState<MenuPanelKey | undefined>(undefined);

  // Sync scaffold frame visibility with store state
  useEffect(() => {
    scaffold.gameplay.menuFrame.Visible = isOpen;
  }, [isOpen]);

  // Reset panel selection when menu closes so each open starts clean.
  useEffect(() => {
    if (!isOpen) {
      setActivePanel(undefined);
    }
  }, [isOpen]);

  if (!isOpen) return <></>;

  return (
    <frame key="MenuOverlay" Size={UDim2.fromScale(1, 1)} BackgroundTransparency={1}>
      <frame
        key="MenuRail"
        AnchorPoint={new Vector2(1, 0.5)}
        Position={new UDim2(1, -16, 0.5, 0)}
        Size={UDim2.fromOffset(64, 420)}
        BackgroundColor3={Color3.fromRGB(28, 30, 42)}
        BackgroundTransparency={0.2}
        BorderSizePixel={0}
      >
        <uicorner CornerRadius={new UDim(0, 10)} />
        <uistroke Color={Color3.fromRGB(88, 96, 124)} Thickness={1} />
        <uilistlayout
          FillDirection={Enum.FillDirection.Vertical}
          HorizontalAlignment={Enum.HorizontalAlignment.Center}
          VerticalAlignment={Enum.VerticalAlignment.Top}
          Padding={new UDim(0, 6)}
        />
        <uipadding
          PaddingTop={new UDim(0, 8)}
          PaddingBottom={new UDim(0, 8)}
          PaddingLeft={new UDim(0, 8)}
          PaddingRight={new UDim(0, 8)}
        />

        {MENU_PANEL_KEYS.map((key, index) => {
          const isActive = activePanel === key;
          return (
            <textbutton
              key={`${key}IconBtn`}
              Size={UDim2.fromOffset(48, 48)}
              LayoutOrder={index}
              BackgroundColor3={
                isActive ? Color3.fromRGB(78, 112, 190) : Color3.fromRGB(46, 50, 70)
              }
              BackgroundTransparency={isActive ? 0 : 0.15}
              Text=""
              BorderSizePixel={0}
              Event={{
                Activated: () => setActivePanel((current) => (current === key ? undefined : key)),
              }}
            >
              <uicorner CornerRadius={new UDim(0, 8)} />
              <uistroke
                Color={isActive ? Color3.fromRGB(180, 210, 255) : Color3.fromRGB(96, 102, 130)}
                Thickness={1}
              />
              <imagelabel
                key="Icon"
                AnchorPoint={new Vector2(0.5, 0.5)}
                Position={UDim2.fromScale(0.5, 0.5)}
                Size={UDim2.fromOffset(28, 28)}
                BackgroundTransparency={1}
                Image={IMAGE_CATALOG.MenuPanelIcons[key] as unknown as string}
                ScaleType={Enum.ScaleType.Fit}
              />
            </textbutton>
          );
        })}
      </frame>

      {activePanel !== undefined && (
        <Panel
          title={activePanel}
          isOpen={activePanel !== undefined}
          onClose={() => setActivePanel(undefined)}
          size={UDim2.fromOffset(420, 300)}
          position={UDim2.fromScale(0.5, 0.5)}
        >
          <frame key="PlaceholderContent" Size={UDim2.fromScale(1, 1)} BackgroundTransparency={1}>
            <textlabel
              key="PlaceholderLabel"
              AnchorPoint={new Vector2(0.5, 0.5)}
              Position={UDim2.fromScale(0.5, 0.5)}
              Size={UDim2.fromScale(0.9, 0.25)}
              BackgroundTransparency={1}
              Text={`${activePanel} panel`}
              TextColor3={Color3.fromRGB(220, 226, 245)}
              TextScaled={true}
              Font={Enum.Font.GothamMedium}
            />
          </frame>
        </Panel>
      )}
    </frame>
  );
}
