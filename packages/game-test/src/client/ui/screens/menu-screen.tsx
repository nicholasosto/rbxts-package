import { Panel } from '@nicholasosto/ultra-ui';
import React, { useEffect } from '@rbxts/react';
import { useSelector } from '@rbxts/react-reflex';
import { selectIsMenuOpen } from '../../store';
import { useRootProducer } from '../hooks';
import { scaffold } from '../scaffold';

/**
 * MenuScreen — Pause/settings menu using ultra-ui Panel.
 *
 * Portaled into the scaffold's Gameplay > Panels > Menu > Content.
 * Uses the ultra-ui Panel component for consistent look & feel.
 */
export function MenuScreen(): React.Element {
  const isOpen = useSelector(selectIsMenuOpen);
  const { closeAll, pushToast } = useRootProducer();

  // Sync scaffold frame visibility with store state
  useEffect(() => {
    scaffold.gameplay.menuFrame.Visible = isOpen;
  }, [isOpen]);

  return (
    <Panel
      title="Menu"
      isOpen={isOpen}
      onClose={() => closeAll()}
      size={UDim2.fromOffset(320, 360)}
      position={UDim2.fromScale(0.5, 0.5)}
    >
      <frame key="MenuContent" Size={UDim2.fromScale(1, 1)} BackgroundTransparency={1}>
        <uilistlayout
          HorizontalAlignment={Enum.HorizontalAlignment.Center}
          VerticalAlignment={Enum.VerticalAlignment.Center}
          Padding={new UDim(0, 12)}
        />

        <textbutton
          key="ResumeBtn"
          Size={UDim2.fromScale(0.7, 0.1)}
          BackgroundColor3={Color3.fromRGB(60, 60, 80)}
          Text="Resume"
          TextColor3={Color3.fromRGB(255, 255, 255)}
          TextScaled={true}
          Font={Enum.Font.Gotham}
          BorderSizePixel={0}
          Event={{ Activated: () => closeAll() }}
        >
          <uicorner CornerRadius={new UDim(0, 8)} />
        </textbutton>

        <textbutton
          key="TestToastBtn"
          Size={UDim2.fromScale(0.7, 0.1)}
          BackgroundColor3={Color3.fromRGB(60, 140, 80)}
          Text="Test Notification"
          TextColor3={Color3.fromRGB(255, 255, 255)}
          TextScaled={true}
          Font={Enum.Font.Gotham}
          BorderSizePixel={0}
          Event={{
            Activated: () => {
              pushToast('This is a test notification!', 'info', 4);
              closeAll();
            },
          }}
        >
          <uicorner CornerRadius={new UDim(0, 8)} />
        </textbutton>

        <textbutton
          key="TestDamageBtn"
          Size={UDim2.fromScale(0.7, 0.1)}
          BackgroundColor3={Color3.fromRGB(180, 50, 50)}
          Text="Test Damage Toast"
          TextColor3={Color3.fromRGB(255, 255, 255)}
          TextScaled={true}
          Font={Enum.Font.Gotham}
          BorderSizePixel={0}
          Event={{
            Activated: () => {
              pushToast('You took 25 damage!', 'error', 3);
              closeAll();
            },
          }}
        >
          <uicorner CornerRadius={new UDim(0, 8)} />
        </textbutton>

        <textbutton
          key="SettingsBtn"
          Size={UDim2.fromScale(0.7, 0.1)}
          BackgroundColor3={Color3.fromRGB(60, 60, 80)}
          Text="Settings"
          TextColor3={Color3.fromRGB(255, 255, 255)}
          TextScaled={true}
          Font={Enum.Font.Gotham}
          BorderSizePixel={0}
        >
          <uicorner CornerRadius={new UDim(0, 8)} />
        </textbutton>
      </frame>
    </Panel>
  );
}
