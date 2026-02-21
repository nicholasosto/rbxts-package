import {
  ActionBar,
  BuffBar,
  CharacterCard,
  NotificationStack,
  type AbilitySlotData,
  type BuffData,
  type ToastData,
} from '@nicholasosto/ultra-ui';
import React from '@rbxts/react';
import { useSelector } from '@rbxts/react-reflex';
import { Players } from '@rbxts/services';
import {
  selectAbilities,
  selectBuffs,
  selectHealth,
  selectLevel,
  selectMana,
  selectToasts,
} from '../../store';
import { useRootProducer } from '../hooks';

/**
 * HudScreen — Top-level HUD layout using ultra-ui components.
 *
 * Portaled into the scaffold's Gameplay > HUD CanvasGroup.
 * Renders resource bars, action bar, level bar, notifications, and buffs.
 */
export function HudScreen(): React.Element {
  const health = useSelector(selectHealth);
  const mana = useSelector(selectMana);
  const abilities = useSelector(selectAbilities);
  const level = useSelector(selectLevel);
  const toasts = useSelector(selectToasts);
  const buffs = useSelector(selectBuffs);
  const { toggleCatalog, toggleInventory, toggleMenu, dismissToast } = useRootProducer();

  const localPlayer = Players.LocalPlayer;
  const username = localPlayer.DisplayName;
  const portraitImage = `rbxthumb://type=AvatarHeadShot&id=${localPlayer.UserId}&w=150&h=150`;

  // Map combat-stats AbilitySlot[] → ultra-ui AbilitySlotData[]
  const abilitySlotData: AbilitySlotData[] = abilities.map((slot, i) => ({
    abilityId: slot.abilityId,
    displayName: slot.displayName,
    iconImage: slot.iconImage,
    cooldownRemaining: slot.cooldownRemaining,
    cooldownTotal: 10, // default cooldown total for display
    isReady: slot.isReady,
    hotkeyLabel: `${i + 1}`,
  }));

  // Map store toasts → ultra-ui ToastData[]
  const toastData: ToastData[] = toasts.map((t) => ({
    id: t.id,
    message: t.message,
    severity: t.severity,
    duration: t.duration,
    icon: t.icon,
  }));

  // Map store buffs → ultra-ui BuffData[]
  const buffData: BuffData[] = buffs.map((b) => ({
    id: b.id,
    displayName: b.displayName,
    iconImage: b.iconImage,
    remainingSeconds: b.remainingSeconds,
    totalSeconds: b.totalSeconds,
    isDebuff: b.isDebuff,
    stacks: b.stacks,
  }));

  return (
    <React.Fragment>
      {/* ── Character Card — top left ─────────────────────── */}
      <CharacterCard
        username={username}
        level={level}
        health={health}
        mana={mana}
        stamina={{ current: 100, max: 100 }}
        portraitImage={portraitImage}
      />

      {/* ── Buff Bar — below resource bars ────────────────── */}
      <frame
        key="BuffBarContainer"
        AnchorPoint={new Vector2(0.5, 0)}
        Position={UDim2.fromScale(0.5, 0.15)}
        Size={UDim2.fromScale(0.3, 0.04)}
        BackgroundTransparency={1}
      >
        <BuffBar buffs={buffData} maxVisible={8} />
      </frame>

      {/* ── Action Bar — bottom center ────────────────────── */}
      <ActionBar
        abilities={abilitySlotData}
        slotCount={6}
        onActivate={(abilityId) => print(`[HUD] Activate ability: ${abilityId}`)}
        position={UDim2.fromScale(0.5, 0.95)}
        anchorPoint={new Vector2(0.5, 1)}
      />

      {/* ── Notification Stack — top right ────────────────── */}
      <NotificationStack
        toasts={toastData}
        onDismiss={(id) => dismissToast(id)}
        position="TopRight"
        maxVisible={5}
      />

      {/* ── HUD Buttons — bottom right ────────────────────── */}
      <frame
        key="HudButtons"
        AnchorPoint={new Vector2(1, 1)}
        Position={new UDim2(1, -12, 1, -12)}
        Size={new UDim2(0, 52, 0, 170)}
        BackgroundTransparency={1}
      >
        <uilistlayout
          FillDirection={Enum.FillDirection.Vertical}
          VerticalAlignment={Enum.VerticalAlignment.Bottom}
          Padding={new UDim(0, 8)}
        />
        <textbutton
          key="MenuBtn"
          Size={new UDim2(0, 48, 0, 48)}
          BackgroundColor3={Color3.fromRGB(60, 60, 90)}
          BackgroundTransparency={0.15}
          Text="☰"
          TextScaled={true}
          TextColor3={Color3.fromRGB(255, 255, 255)}
          Font={Enum.Font.GothamBold}
          BorderSizePixel={0}
          Event={{ Activated: () => toggleMenu() }}
        >
          <uicorner CornerRadius={new UDim(0, 8)} />
          <uistroke Color={Color3.fromRGB(100, 100, 140)} Thickness={1} />
        </textbutton>
        <textbutton
          key="InventoryBtn"
          Size={new UDim2(0, 48, 0, 48)}
          BackgroundColor3={Color3.fromRGB(60, 60, 90)}
          BackgroundTransparency={0.15}
          Text="🎒"
          TextScaled={true}
          TextColor3={Color3.fromRGB(255, 255, 255)}
          Font={Enum.Font.GothamBold}
          BorderSizePixel={0}
          Event={{ Activated: () => toggleInventory() }}
        >
          <uicorner CornerRadius={new UDim(0, 8)} />
          <uistroke Color={Color3.fromRGB(100, 100, 140)} Thickness={1} />
        </textbutton>
        <textbutton
          key="CatalogBtn"
          Size={new UDim2(0, 48, 0, 48)}
          BackgroundColor3={Color3.fromRGB(60, 60, 90)}
          BackgroundTransparency={0.15}
          Text="📦"
          TextScaled={true}
          TextColor3={Color3.fromRGB(255, 255, 255)}
          Font={Enum.Font.GothamBold}
          BorderSizePixel={0}
          Event={{ Activated: () => toggleCatalog() }}
        >
          <uicorner CornerRadius={new UDim(0, 8)} />
          <uistroke Color={Color3.fromRGB(100, 100, 140)} Thickness={1} />
        </textbutton>
      </frame>
    </React.Fragment>
  );
}
