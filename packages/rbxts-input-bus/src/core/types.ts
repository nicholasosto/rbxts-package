/**
 * @nosto/rbxts-input-bus — Core Type Definitions
 *
 * Defines the vocabulary for a multi-device input system:
 * logical actions, phases, device-specific bindings, and contexts.
 */

// ─────────────────────────────────────────────────────────────────
// INPUT ACTIONS
// ─────────────────────────────────────────────────────────────────

/**
 * Logical input action names.
 *
 * Includes common defaults for RPG-style games. The trailing
 * `(string & {})` allows consumers to add custom actions while
 * preserving autocomplete for the built-in ones.
 *
 * @example
 * // Custom action with full type safety
 * type MyAction = InputAction | "Dodge" | "Mount";
 */
export type InputAction =
  // Movement & interaction
  | 'Move'
  | 'Sprint'
  | 'Jump'
  | 'Attack'
  | 'Interact'
  // Menu / UI navigation
  | 'OpenMenu'
  | 'NavigateUp'
  | 'NavigateDown'
  | 'NavigateLeft'
  | 'NavigateRight'
  | 'Submit'
  | 'Cancel'
  // Abilities
  | 'Ability1'
  | 'Ability2'
  | 'Ability3'
  | 'Ability4'
  | 'Ability5'
  // Toggles
  | 'ToggleInventory'
  | 'ToggleCharacterSheet'
  | 'ToggleHUD'
  | 'ToggleDevConsole'
  // Extensibility — any string is valid, but the above get autocomplete
  | (string & {});

/**
 * Convenience constant for referencing default actions without
 * string literals.
 *
 * @example
 * if (payload.action === Actions.Jump) { ... }
 */
export const Actions = {
  // Movement & interaction
  Move: 'Move' as InputAction,
  Sprint: 'Sprint' as InputAction,
  Jump: 'Jump' as InputAction,
  Attack: 'Attack' as InputAction,
  Interact: 'Interact' as InputAction,
  // Menu / UI navigation
  OpenMenu: 'OpenMenu' as InputAction,
  NavigateUp: 'NavigateUp' as InputAction,
  NavigateDown: 'NavigateDown' as InputAction,
  NavigateLeft: 'NavigateLeft' as InputAction,
  NavigateRight: 'NavigateRight' as InputAction,
  Submit: 'Submit' as InputAction,
  Cancel: 'Cancel' as InputAction,
  // Abilities
  Ability1: 'Ability1' as InputAction,
  Ability2: 'Ability2' as InputAction,
  Ability3: 'Ability3' as InputAction,
  Ability4: 'Ability4' as InputAction,
  Ability5: 'Ability5' as InputAction,
  // Toggles
  ToggleInventory: 'ToggleInventory' as InputAction,
  ToggleCharacterSheet: 'ToggleCharacterSheet' as InputAction,
  ToggleHUD: 'ToggleHUD' as InputAction,
  ToggleDevConsole: 'ToggleDevConsole' as InputAction,
} as const;

// ─────────────────────────────────────────────────────────────────
// ACTION PHASE
// ─────────────────────────────────────────────────────────────────

/** Phase of an input action (press, hold/change, release). */
export enum ActionPhase {
  Started = 'Started',
  Changed = 'Changed',
  Ended = 'Ended',
}

// ─────────────────────────────────────────────────────────────────
// ACTION EVENT PAYLOAD
// ─────────────────────────────────────────────────────────────────

/** Payload emitted on the InputBus when an action fires. */
export type ActionEventPayload = {
  /** The logical action that was triggered. */
  action: InputAction;
  /** Phase of the input (press, change, release). */
  phase: ActionPhase;
  /** Optional 2D analog data (movement vector, mouse delta). */
  vec2?: Vector2;
  /** Optional 1D analog data (trigger pressure). */
  value1D?: number;
  /** The original Roblox InputObject, if available. */
  rawInput?: InputObject;
};

// ─────────────────────────────────────────────────────────────────
// DEVICE BINDINGS
// ─────────────────────────────────────────────────────────────────

/** A chord is one or more keys that must be held together. */
export type KeyChord = Enum.KeyCode[];

/** Keyboard / mouse binding. */
export type KBMBinding = {
  device: 'KBM';
  /** Key chord options — input matches if ANY chord matches. */
  keys?: KeyChord[];
  /** Mouse button options. */
  mouseButtons?: Enum.UserInputType[];
  /** Optional axis binding (mouse delta, scroll wheel). */
  axis?: 'MouseDelta' | 'Wheel';
};

/** Gamepad binding. */
export type GamepadBinding = {
  device: 'Gamepad';
  /** Gamepad button KeyCodes (e.g., ButtonA, ButtonR2). */
  buttons?: Enum.KeyCode[];
  /** 2D axis (Thumbstick1 for move, Thumbstick2 for look). */
  axis2D?: 'Thumbstick1' | 'Thumbstick2';
  /** 1D axis (analog triggers). */
  axis1D?: 'TriggerL' | 'TriggerR';
};

/** Touch binding. */
export type TouchBinding = {
  device: 'Touch';
  /** Gesture types to match. */
  gestures?: ('Tap' | 'Swipe' | 'LongPress')[];
  /** Virtual button KeyCode for ContextActionService. */
  virtualButtonKey?: Enum.KeyCode;
  /** Whether to show a touch button via CAS. */
  showTouchButton?: boolean;
};

/** Discriminated union of all device binding types. */
export type Binding = KBMBinding | GamepadBinding | TouchBinding;

// ─────────────────────────────────────────────────────────────────
// INPUT CONTEXT
// ─────────────────────────────────────────────────────────────────

/** Maps actions to an array of bindings (one per supported device). */
export type ActionBindingMap = Partial<Record<InputAction, Binding[]>>;

/**
 * An input context groups bindings under a name and priority.
 *
 * When multiple contexts are enabled, the highest-priority context
 * that has a matching binding wins. This lets you overlay a Menu
 * context (priority 100) on top of a Gameplay context (priority 50)
 * so that WASD becomes navigate instead of move.
 */
export interface InputContext {
  /** Human-readable name (e.g., "Gameplay", "Menu"). */
  name: string;
  /** Higher priority wins when multiple contexts match. */
  priority: number;
  /** Action-to-binding mappings for this context. */
  bindings: ActionBindingMap;
  /** Whether this context starts enabled. Default: false. */
  enabledByDefault?: boolean;
}
