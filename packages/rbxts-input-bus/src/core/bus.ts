/**
 * @nosto/rbxts-input-bus — Input Event Bus
 *
 * Central pub/sub channel for input actions. Producers (the
 * InputController) call emit(); consumers (gameplay controllers)
 * call onAction() to subscribe.
 *
 * Uses @rbxts/signal for type-safe, connection-managed events.
 */

import Signal from '@rbxts/signal';
import { type ActionEventPayload } from './types';

/**
 * Type-safe event bus for broadcasting input actions.
 *
 * @example
 * // Subscribe
 * const conn = inputBus.onAction((payload) => {
 *     if (payload.action === "Jump" && payload.phase === "Started") {
 *         handleJump();
 *     }
 * });
 *
 * // Emit (typically done by InputController)
 * inputBus.emit({ action: "Jump", phase: ActionPhase.Started });
 *
 * // Cleanup
 * conn.Disconnect();
 */
export class InputBus {
  private actionSignal = new Signal<(payload: ActionEventPayload) => void>();

  /**
   * Subscribe to all action events.
   * @returns An RBXScriptConnection that can be Disconnected.
   */
  public onAction(listener: (payload: ActionEventPayload) => void) {
    return this.actionSignal.Connect(listener);
  }

  /**
   * Broadcast an action event to all subscribers.
   */
  public emit(payload: ActionEventPayload) {
    this.actionSignal.Fire(payload);
  }

  /**
   * Destroy the underlying signal. Call when tearing down the
   * input system (e.g., test cleanup).
   */
  public destroy() {
    this.actionSignal.Destroy();
  }
}

/**
 * Default global InputBus singleton.
 *
 * Most projects should use this instance directly. If you need
 * isolated buses (e.g., for testing), construct `new InputBus()`.
 */
export const inputBus = new InputBus();
