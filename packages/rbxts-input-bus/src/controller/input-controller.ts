/**
 * @trembus/rbxts-input-bus — InputController (Framework-Agnostic)
 *
 * Manages multi-device input handling with context-based action
 * mapping. Maps physical inputs (keyboard, gamepad, touch) to
 * logical actions and emits them on the InputBus.
 *
 * This is the base class — no framework decorators or DI. Call
 * `initialize()` to start, `destroy()` to clean up.
 *
 * For Flamework projects, use `FlameworkInputController` which
 * wraps this with @Controller and OnStart.
 */

import { UserInputService } from '@rbxts/services';
import { inputBus } from '../core/bus';
import {
  type ActionEventPayload,
  ActionPhase,
  type Binding,
  type InputAction,
  type InputContext,
} from '../core/types';

/** The three device families supported. */
export type InputDevice = 'KBM' | 'Gamepad' | 'Touch';

export class InputController {
  // ── State ────────────────────────────────────────────────────
  private readonly contexts = new Map<string, InputContext>();
  private readonly enabledContexts = new Set<string>();
  private activeDevice: InputDevice = 'KBM';
  private connections: RBXScriptConnection[] = [];
  private initialized = false;

  // ════════════════════════════════════════════════════════════
  // PUBLIC API
  // ════════════════════════════════════════════════════════════

  /**
   * Start the input system.
   *
   * @param contexts Optional initial contexts to register. Any
   *   context with `enabledByDefault: true` will be enabled.
   */
  public initialize(contexts?: InputContext[]): void {
    if (this.initialized) return;
    this.initialized = true;

    if (contexts) {
      for (const ctx of contexts) {
        this.registerContext(ctx);
      }
    }

    this.detectInputDevice();
    this.bindInputHandlers();
  }

  /**
   * Tear down the input system and disconnect all listeners.
   */
  public destroy(): void {
    for (const conn of this.connections) {
      conn.Disconnect();
    }
    this.connections = [];
    this.contexts.clear();
    this.enabledContexts.clear();
    this.initialized = false;
  }

  /**
   * Register an input context. If `enabledByDefault` is true on
   * the context, it is enabled immediately.
   */
  public registerContext(context: InputContext): void {
    this.contexts.set(context.name, context);
    if (context.enabledByDefault) {
      this.enabledContexts.add(context.name);
    }
  }

  /** Enable a context by name. */
  public enableContext(contextName: string): void {
    if (!this.contexts.has(contextName)) {
      warn(`[InputController] Cannot enable unknown context: ${contextName}`);
      return;
    }
    this.enabledContexts.add(contextName);
  }

  /** Disable a context by name. */
  public disableContext(contextName: string): void {
    this.enabledContexts.delete(contextName);
  }

  /** Check whether a context is currently enabled. */
  public isContextEnabled(contextName: string): boolean {
    return this.enabledContexts.has(contextName);
  }

  /** Get the currently detected input device. */
  public getActiveDevice(): InputDevice {
    return this.activeDevice;
  }

  // ════════════════════════════════════════════════════════════
  // PROTECTED HOOKS (override in subclasses)
  // ════════════════════════════════════════════════════════════

  /**
   * Called after every action is emitted on the bus. Override to
   * add logging, analytics, or custom side-effects.
   */
  protected onActionEmitted(_payload: ActionEventPayload): void {
    // No-op by default.
  }

  // ════════════════════════════════════════════════════════════
  // CONTEXT RESOLUTION
  // ════════════════════════════════════════════════════════════

  /**
   * Returns enabled contexts sorted by priority (highest first).
   * The first context with a matching binding wins.
   */
  private getActiveContexts(): InputContext[] {
    const active: InputContext[] = [];

    this.enabledContexts.forEach((name) => {
      const context = this.contexts.get(name);
      if (context) {
        active.push(context);
      }
    });

    // Sort descending by priority (roblox-ts sort returns boolean)
    active.sort((a, b) => {
      if (b.priority > a.priority) return true;
      if (b.priority < a.priority) return false;
      return false;
    });

    return active;
  }

  // ════════════════════════════════════════════════════════════
  // DEVICE DETECTION
  // ════════════════════════════════════════════════════════════

  private detectInputDevice(): void {
    this.connections.push(
      UserInputService.GamepadConnected.Connect(() => {
        this.activeDevice = 'Gamepad';
      }),
    );

    this.connections.push(
      UserInputService.GamepadDisconnected.Connect(() => {
        this.activeDevice = 'KBM';
      }),
    );

    // Initial detection
    if (UserInputService.TouchEnabled) {
      this.activeDevice = 'Touch';
    }
    if (UserInputService.GamepadEnabled) {
      this.activeDevice = 'Gamepad';
    }
  }

  // ════════════════════════════════════════════════════════════
  // INPUT HANDLING
  // ════════════════════════════════════════════════════════════

  private bindInputHandlers(): void {
    this.connections.push(
      UserInputService.InputBegan.Connect((input, processed) => {
        if (processed) return;
        this.handleInput(input, ActionPhase.Started);
      }),
    );

    this.connections.push(
      UserInputService.InputChanged.Connect((input, processed) => {
        if (processed) return;
        this.handleInput(input, ActionPhase.Changed);
      }),
    );

    this.connections.push(
      UserInputService.InputEnded.Connect((input, _processed) => {
        this.handleInput(input, ActionPhase.Ended);
      }),
    );
  }

  private handleInput(input: InputObject, phase: ActionPhase): void {
    const activeContexts = this.getActiveContexts();

    for (const context of activeContexts) {
      const action = this.findActionForInput(context, input);
      if (action !== undefined) {
        this.emitAction(action, phase, input);
        return; // Stop at first matching context (highest priority)
      }
    }
  }

  // ════════════════════════════════════════════════════════════
  // BINDING MATCHING
  // ════════════════════════════════════════════════════════════

  private findActionForInput(context: InputContext, input: InputObject): InputAction | undefined {
    for (const [action, bindings] of pairs(context.bindings)) {
      for (const binding of bindings) {
        if (this.matchesBinding(binding, input)) {
          return action;
        }
      }
    }
    return undefined;
  }

  private matchesBinding(binding: Binding, input: InputObject): boolean {
    // Keyboard / Mouse
    if (binding.device === 'KBM') {
      if (binding.keys) {
        for (const keyChord of binding.keys) {
          if (keyChord.includes(input.KeyCode)) {
            return true;
          }
        }
      }
      if (binding.mouseButtons) {
        if (binding.mouseButtons.includes(input.UserInputType)) {
          return true;
        }
      }
    }

    // Gamepad
    if (binding.device === 'Gamepad' && binding.buttons) {
      if (binding.buttons.includes(input.KeyCode)) {
        return true;
      }
    }

    // Touch — currently matches virtual button KeyCodes
    if (binding.device === 'Touch' && binding.virtualButtonKey) {
      if (input.KeyCode === binding.virtualButtonKey) {
        return true;
      }
    }

    return false;
  }

  // ════════════════════════════════════════════════════════════
  // EMISSION
  // ════════════════════════════════════════════════════════════

  private emitAction(action: InputAction, phase: ActionPhase, input: InputObject): void {
    const payload: ActionEventPayload = {
      action,
      phase,
      rawInput: input,
    };

    // Pack analog position data if present
    if (input.Position.Magnitude > 0) {
      payload.vec2 = new Vector2(input.Position.X, input.Position.Y);
    }

    // Prefer delta data when available (mouse movement, stick change)
    if (input.Delta.Magnitude > 0) {
      payload.vec2 = new Vector2(input.Delta.X, input.Delta.Y);
    }

    inputBus.emit(payload);
    this.onActionEmitted(payload);
  }
}
