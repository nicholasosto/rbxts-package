/**
 * @nosto/rbxts-input-bus — Flamework Adapter
 *
 * Thin wrapper that makes InputController work as a Flamework
 * @Controller with OnStart lifecycle. Registers the default
 * GameplayContext on start.
 *
 * Requires @flamework/core as a peer dependency.
 *
 * @example
 * // In your game's client entry point — Flamework will
 * // auto-instantiate this controller and call onStart().
 * // Then subscribe to the bus in your other controllers:
 *
 * import { inputBus, Actions, ActionPhase } from "@nosto/rbxts-input-bus";
 *
 * inputBus.onAction((payload) => {
 *     if (payload.action === Actions.Jump && payload.phase === ActionPhase.Started) {
 *         handleJump();
 *     }
 * });
 */

import { Controller, type OnStart } from '@flamework/core';
import { GameplayContext } from '../contexts';
import { type InputContext } from '../core';
import { InputController } from './input-controller';

@Controller({})
export class FlameworkInputController extends InputController implements OnStart {
  /**
   * Contexts to register on startup. Override in a subclass to
   * customize which contexts load by default.
   */
  protected getInitialContexts(): InputContext[] {
    return [GameplayContext];
  }

  onStart(): void {
    this.initialize(this.getInitialContexts());
  }
}
