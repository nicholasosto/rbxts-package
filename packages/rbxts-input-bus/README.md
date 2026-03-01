# @trembus/rbxts-input-bus

Multi-device input bus for [roblox-ts](https://roblox-ts.com) games. Maps keyboard, gamepad, and touch inputs to logical actions through a priority-based context system.

## Features

- **Device-agnostic actions** — game code reacts to `"Jump"`, not `Enum.KeyCode.Space`
- **Context switching** — overlay Menu bindings on top of Gameplay without rewiring anything
- **Priority stack** — highest-priority context with a matching binding wins
- **Multi-device** — KBM, Gamepad, and Touch bindings defined side by side
- **Extensible actions** — add custom actions with full autocomplete for defaults
- **Framework-agnostic core** with optional Flamework adapter

## Install

```bash
npm install @trembus/rbxts-input-bus
```

## Quick Start

### 1. Start the controller

**Without Flamework:**

```typescript
import { InputController, GameplayContext, MenuContext } from '@trembus/rbxts-input-bus';

const controller = new InputController();
controller.initialize([GameplayContext, MenuContext]);
```

**With Flamework:**

```typescript
// Just import it — Flamework auto-instantiates @Controller classes.
import { FlameworkInputController } from '@trembus/rbxts-input-bus';
```

### 2. Subscribe to actions

```typescript
import { inputBus, Actions, ActionPhase } from '@trembus/rbxts-input-bus';

inputBus.onAction((payload) => {
  if (payload.action === Actions.Jump && payload.phase === ActionPhase.Started) {
    handleJump();
  }
});
```

### 3. Switch contexts

```typescript
// Open a menu — Menu context (priority 100) overrides Gameplay (50)
controller.enableContext('Menu');

// Close it — back to gameplay bindings
controller.disableContext('Menu');
```

## Concepts

### Actions

Actions are logical names like `"Jump"`, `"Attack"`, or `"Ability1"`. The `Actions` constant provides autocomplete:

```typescript
import { Actions } from '@trembus/rbxts-input-bus';

Actions.Jump; // "Jump"
Actions.Ability3; // "Ability3"
```

The `InputAction` type is a string union with a `(string & {})` tail, so you can define custom actions:

```typescript
type MyAction = InputAction | 'Dodge' | 'Mount';
```

### Contexts

A context is a named set of `Action → Binding[]` mappings with a priority:

```typescript
const MinigameContext: InputContext = {
  name: 'Minigame',
  priority: 200, // beats Menu (100) and Gameplay (50)
  enabledByDefault: false,
  bindings: {
    [Actions.Submit]: [
      { device: 'KBM', keys: [[Enum.KeyCode.Space]] },
      { device: 'Gamepad', buttons: [Enum.KeyCode.ButtonA] },
    ],
  },
};

controller.registerContext(MinigameContext);
controller.enableContext('Minigame');
```

When multiple contexts are enabled, the controller checks them in priority order and stops at the first match.

### Bindings

Each binding targets a specific device:

```typescript
// Keyboard/Mouse
{ device: "KBM", keys: [[Enum.KeyCode.E]], mouseButtons: [Enum.UserInputType.MouseButton1] }

// Gamepad
{ device: "Gamepad", buttons: [Enum.KeyCode.ButtonA], axis2D: "Thumbstick1" }

// Touch
{ device: "Touch", gestures: ["Tap"], showTouchButton: true, virtualButtonKey: Enum.KeyCode.Space }
```

### Phases

Every action fires with a phase:

- `ActionPhase.Started` — key/button pressed
- `ActionPhase.Changed` — analog value changed (stick, trigger)
- `ActionPhase.Ended` — key/button released

### Payload

```typescript
type ActionEventPayload = {
  action: InputAction;
  phase: ActionPhase;
  vec2?: Vector2; // analog 2D data
  value1D?: number; // analog 1D data (trigger)
  rawInput?: InputObject;
};
```

## Shipped Contexts

| Context           | Priority | Default  | Actions                                                                  |
| ----------------- | -------- | -------- | ------------------------------------------------------------------------ |
| `GameplayContext` | 50       | Enabled  | Move, Sprint, Jump, Attack, Interact, Ability1–5, UI toggles, debug keys |
| `MenuContext`     | 100      | Disabled | NavigateUp/Down/Left/Right, Submit, Cancel, OpenMenu                     |

Import and use them, extend them, or create your own.

## Extending the Controller

Subclass `InputController` to add custom behavior:

```typescript
class MyInputController extends InputController {
  protected onActionEmitted(payload: ActionEventPayload): void {
    // Log, analytics, custom side-effects
    print(`Action: ${payload.action} Phase: ${payload.phase}`);
  }
}
```

## API Reference

### InputBus

| Method               | Description                                                    |
| -------------------- | -------------------------------------------------------------- |
| `onAction(listener)` | Subscribe to all action events. Returns `RBXScriptConnection`. |
| `emit(payload)`      | Broadcast an action event.                                     |
| `destroy()`          | Clean up the underlying signal.                                |

### InputController

| Method                     | Description                                            |
| -------------------------- | ------------------------------------------------------ |
| `initialize(contexts?)`    | Start the input system with optional initial contexts. |
| `destroy()`                | Disconnect all listeners and reset state.              |
| `registerContext(context)` | Add a context (enables it if `enabledByDefault`).      |
| `enableContext(name)`      | Enable a registered context.                           |
| `disableContext(name)`     | Disable a context.                                     |
| `isContextEnabled(name)`   | Check if a context is active.                          |
| `getActiveDevice()`        | Returns `"KBM"`, `"Gamepad"`, or `"Touch"`.            |

### Singleton

```typescript
import { inputBus } from '@trembus/rbxts-input-bus';
```

A default `InputBus` instance shared across the project. Use `new InputBus()` if you need isolated instances.

## License

MIT
