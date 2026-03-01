/**
 * @trembus/rbxts-input-bus — Gameplay Input Context
 *
 * Default input context for RPG-style gameplay. Includes bindings
 * for movement, combat, abilities (5 slots), UI toggles, and debug
 * keys across keyboard/mouse, gamepad, and touch.
 *
 * Priority 50 — designed to be overridden by higher-priority
 * contexts (Menu at 100, Minigame at 200, etc.).
 */

import { Actions, type InputContext } from '../core';

export const GameplayContext: InputContext = {
  name: 'Gameplay',
  priority: 50,
  enabledByDefault: true,
  bindings: {
    // ── Movement & Basic Actions ────────────────────────────────

    [Actions.Move]: [
      {
        device: 'KBM',
        keys: [[Enum.KeyCode.W], [Enum.KeyCode.A], [Enum.KeyCode.S], [Enum.KeyCode.D]],
      },
      { device: 'Gamepad', axis2D: 'Thumbstick1' },
    ],

    [Actions.Sprint]: [
      { device: 'KBM', keys: [[Enum.KeyCode.LeftShift]] },
      { device: 'Gamepad', buttons: [Enum.KeyCode.ButtonL3] },
      { device: 'Touch', showTouchButton: true, virtualButtonKey: Enum.KeyCode.LeftShift },
    ],

    [Actions.Jump]: [
      { device: 'KBM', keys: [[Enum.KeyCode.Space]] },
      { device: 'Gamepad', buttons: [Enum.KeyCode.ButtonA] },
      {
        device: 'Touch',
        gestures: ['Tap'],
        showTouchButton: true,
        virtualButtonKey: Enum.KeyCode.Space,
      },
    ],

    [Actions.Attack]: [
      { device: 'KBM', mouseButtons: [Enum.UserInputType.MouseButton1] },
      { device: 'Gamepad', buttons: [Enum.KeyCode.ButtonR2] },
      {
        device: 'Touch',
        gestures: ['LongPress'],
        showTouchButton: true,
        virtualButtonKey: Enum.KeyCode.ButtonR2,
      },
    ],

    [Actions.Interact]: [
      { device: 'KBM', keys: [[Enum.KeyCode.E]] },
      { device: 'Gamepad', buttons: [Enum.KeyCode.ButtonX] },
      {
        device: 'Touch',
        gestures: ['Tap'],
        showTouchButton: true,
        virtualButtonKey: Enum.KeyCode.ButtonX,
      },
    ],

    // ── Abilities ───────────────────────────────────────────────

    [Actions.Ability1]: [
      { device: 'KBM', keys: [[Enum.KeyCode.One]] },
      { device: 'Gamepad', buttons: [Enum.KeyCode.ButtonY] },
      { device: 'Touch', showTouchButton: true, virtualButtonKey: Enum.KeyCode.One },
    ],

    [Actions.Ability2]: [
      { device: 'KBM', keys: [[Enum.KeyCode.Two]] },
      { device: 'Gamepad', buttons: [Enum.KeyCode.ButtonB] },
      { device: 'Touch', showTouchButton: true, virtualButtonKey: Enum.KeyCode.Two },
    ],

    [Actions.Ability3]: [
      { device: 'KBM', keys: [[Enum.KeyCode.Three]] },
      { device: 'Gamepad', buttons: [Enum.KeyCode.ButtonL1] },
      { device: 'Touch', showTouchButton: true, virtualButtonKey: Enum.KeyCode.Three },
    ],

    [Actions.Ability4]: [
      { device: 'KBM', keys: [[Enum.KeyCode.Four]] },
      { device: 'Gamepad', buttons: [Enum.KeyCode.ButtonR1] },
      { device: 'Touch', showTouchButton: true, virtualButtonKey: Enum.KeyCode.Four },
    ],

    [Actions.Ability5]: [
      { device: 'KBM', keys: [[Enum.KeyCode.Five]] },
      { device: 'Gamepad', buttons: [Enum.KeyCode.DPadRight] },
      { device: 'Touch', showTouchButton: true, virtualButtonKey: Enum.KeyCode.Five },
    ],

    // ── UI Toggles ──────────────────────────────────────────────

    [Actions.OpenMenu]: [
      { device: 'KBM', keys: [[Enum.KeyCode.M], [Enum.KeyCode.Escape]] },
      { device: 'Gamepad', buttons: [Enum.KeyCode.ButtonStart] },
      { device: 'Touch', showTouchButton: true, virtualButtonKey: Enum.KeyCode.M },
    ],

    [Actions.ToggleInventory]: [
      { device: 'KBM', keys: [[Enum.KeyCode.I], [Enum.KeyCode.Tab]] },
      { device: 'Gamepad', buttons: [Enum.KeyCode.ButtonSelect] },
      { device: 'Touch', showTouchButton: true, virtualButtonKey: Enum.KeyCode.I },
    ],

    [Actions.ToggleCharacterSheet]: [
      { device: 'KBM', keys: [[Enum.KeyCode.C]] },
      { device: 'Gamepad', buttons: [Enum.KeyCode.DPadUp] },
      { device: 'Touch', showTouchButton: true, virtualButtonKey: Enum.KeyCode.C },
    ],

    // ── Debug ───────────────────────────────────────────────────

    [Actions.ToggleHUD]: [
      { device: 'KBM', keys: [[Enum.KeyCode.F1]] },
      { device: 'Gamepad', buttons: [Enum.KeyCode.DPadDown] },
    ],

    [Actions.ToggleDevConsole]: [
      { device: 'KBM', keys: [[Enum.KeyCode.F9]] },
      { device: 'Gamepad', buttons: [Enum.KeyCode.DPadLeft] },
    ],
  },
};
