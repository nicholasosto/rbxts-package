/**
 * @trembus/rbxts-input-bus — Menu Input Context
 *
 * Input context for menu / UI navigation. At priority 100 it
 * overrides the Gameplay context (50) when enabled, so WASD
 * becomes navigate instead of move.
 *
 * Disabled by default — enable it when a menu opens, disable
 * when it closes.
 */

import { Actions, type InputContext } from '../core';

export const MenuContext: InputContext = {
  name: 'Menu',
  priority: 100,
  enabledByDefault: false,
  bindings: {
    // ── Navigation ──────────────────────────────────────────────

    [Actions.NavigateUp]: [
      { device: 'KBM', keys: [[Enum.KeyCode.W], [Enum.KeyCode.Up]] },
      { device: 'Gamepad', buttons: [Enum.KeyCode.DPadUp] },
    ],

    [Actions.NavigateDown]: [
      { device: 'KBM', keys: [[Enum.KeyCode.S], [Enum.KeyCode.Down]] },
      { device: 'Gamepad', buttons: [Enum.KeyCode.DPadDown] },
    ],

    [Actions.NavigateLeft]: [
      { device: 'KBM', keys: [[Enum.KeyCode.A], [Enum.KeyCode.Left]] },
      { device: 'Gamepad', buttons: [Enum.KeyCode.DPadLeft] },
    ],

    [Actions.NavigateRight]: [
      { device: 'KBM', keys: [[Enum.KeyCode.D], [Enum.KeyCode.Right]] },
      { device: 'Gamepad', buttons: [Enum.KeyCode.DPadRight] },
    ],

    // ── Confirm / Cancel ────────────────────────────────────────

    [Actions.Submit]: [
      { device: 'KBM', keys: [[Enum.KeyCode.Return], [Enum.KeyCode.Space]] },
      { device: 'Gamepad', buttons: [Enum.KeyCode.ButtonA] },
    ],

    [Actions.Cancel]: [
      { device: 'KBM', keys: [[Enum.KeyCode.Backspace], [Enum.KeyCode.Escape]] },
      { device: 'Gamepad', buttons: [Enum.KeyCode.ButtonB] },
    ],

    // ── Menu toggle (works from both contexts) ──────────────────

    [Actions.OpenMenu]: [
      { device: 'KBM', keys: [[Enum.KeyCode.M], [Enum.KeyCode.Escape]] },
      { device: 'Gamepad', buttons: [Enum.KeyCode.ButtonStart] },
      { device: 'Touch', showTouchButton: true, virtualButtonKey: Enum.KeyCode.M },
    ],
  },
};
