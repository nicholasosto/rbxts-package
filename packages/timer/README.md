# @nicholasosto/timer

> Full-featured Flamework-native timer system for Roblox-TS with display, effects, lifecycle hooks, and chainable API.

---

## Table of Contents

- [Installation](#installation)
- [Quick Start](#quick-start)
- [Core Concepts](#core-concepts)
- [Architecture](#architecture)
- [API Reference](#api-reference)
  - [Enums](#enums)
  - [Timer Class](#timer-class)
  - [TimerController (Client)](#timercontroller-client)
  - [TimerService (Server)](#timerservice-server)
  - [Signals — TimerHooks](#signals--timerhooks)
  - [formatTime()](#formattime)
- [Display & Effects](#display--effects)
  - [Display Config](#display-config)
  - [Effects](#effects)
- [Defaults](#defaults)
- [FAQ / Troubleshooting](#faq--troubleshooting)
- [Changelog](#changelog)

---

## Installation

```bash
pnpm add @nicholasosto/timer
```

### Peer Dependencies

| Package           | Version  |
| ----------------- | -------- |
| `@flamework/core` | `^1.3.2` |
| `@rbxts/services` | `^1.6.0` |
| `@rbxts/signal`   | `^1.1.1` |

---

## Quick Start

### Countdown (client)

```ts
import { TimerController } from '@nicholasosto/timer';

// Promise-based — resolves when the countdown finishes, auto-destroys after 0.5s
await TimerController.countdown(30);
print('Done!');
```

### Countdown with options (client)

```ts
import { TimerController, TimerAnchor, TimerEffect } from '@nicholasosto/timer';

const timer = TimerController.create({
  duration: 60,
  autoStart: true,
  display: {
    anchor: TimerAnchor.Center,
    label: 'Match',
    effects: [TimerEffect.ColorShift, TimerEffect.Pulse],
  },
});

timer.onCompleted.Connect(() => {
  print('Match over!');
});
```

### Stopwatch (client)

```ts
const sw = TimerController.stopwatch();
// later…
sw.pause();
print(`Elapsed: ${sw.getElapsed()}s`);
```

### Server timer (no display)

```ts
import { TimerService } from '@nicholasosto/timer';

const cooldown = TimerService.create({ duration: 5, autoStart: true });

cooldown.onCompleted.Connect(() => {
  print('Cooldown finished');
});
```

---

## Core Concepts

### State Machine

```
Idle ──▶ Running ◀──▶ Paused ──▶ Completed ──▶ Destroyed
```

- `start()` transitions from `Idle` or `Paused` → `Running`
- `pause()` / `resume()` toggle between `Running` ↔ `Paused`
- `stop()` forces `Completed`
- `destroy()` cleans up everything — signals, heartbeat, display

### Direction

| Direction | Use Case                              | Auto-inferred when |
| --------- | ------------------------------------- | ------------------ |
| `Down`    | Countdown — elapsed goes 0 → duration | `duration > 0`     |
| `Up`      | Stopwatch — elapsed increases forever | `duration === 0`   |

### Dual Signal System

Every timer fires events on **two** levels:

- **Instance signals** — `timer.onTick`, `timer.onCompleted`, etc.
- **Global bus** — `TimerHooks.onTick`, `TimerHooks.onCompleted`, etc.

Subscribe to `TimerHooks` to receive events from _every_ active timer in one place.

### Chainable API

All control methods return `this`:

```ts
timer.start().addTime(10).setSpeed(2);
```

---

## Architecture

```
TimerOptions
    │
    ▼
resolveTimerConfig()  ──▶  ResolvedTimerConfig
                                │
               ┌────────────────┴───────────────┐
               ▼                                ▼
         Timer (core)                   TimerDisplayConfig
         ├─ Heartbeat loop              ├─ resolveDisplayConfig()
         ├─ State machine               ▼
         ├─ Thresholds             TimerDisplay (ScreenGui)
         ├─ Instance signals       ├─ EffectsEngine
         └─ Global hooks           └─ formatTime()
               │
    ┌──────────┴──────────┐
    ▼                     ▼
TimerController     TimerService
 (client)             (server)
 @Controller()        @Service()
 ├ auto-wires         ├ display: false
 │  display           ├ create / get
 ├ countdown()        └ remove / removeAll
 └ stopwatch()
```

---

## API Reference

### Enums

Defined in [`src/types.ts`](src/types.ts).

| Enum             | Values                                                                                                                 |
| ---------------- | ---------------------------------------------------------------------------------------------------------------------- |
| `TimerDirection` | `Up`, `Down`                                                                                                           |
| `TimerState`     | `Idle`, `Running`, `Paused`, `Completed`, `Destroyed`                                                                  |
| `TimerFormat`    | `MinSec`, `MinSecTenth`, `HourMinSec`, `RawSeconds`, `Compact`                                                         |
| `TimerAnchor`    | `TopLeft`, `TopCenter`, `TopRight`, `MiddleLeft`, `Center`, `MiddleRight`, `BottomLeft`, `BottomCenter`, `BottomRight` |
| `TimerEffect`    | `Pulse`, `Flash`, `ColorShift`, `Shake`, `FadeIn`, `FadeOut`, `UrgencyGlow`, `CompletionBurst`, `ProgressRing`         |

### Timer Class

Defined in [`src/timer.ts`](src/timer.ts). Framework-agnostic — works without Flamework.

#### Constructor

```ts
new Timer(options?: TimerOptions)
```

Auto-starts if `autoStart: true`. Auto-generates an ID via `HttpService.GenerateGUID()` if omitted.

#### Accessors

| Method               | Returns                       | Description                                   |
| -------------------- | ----------------------------- | --------------------------------------------- |
| `getState()`         | `TimerState`                  | Current lifecycle state                       |
| `getElapsed()`       | `number`                      | Seconds elapsed                               |
| `getRemaining()`     | `number`                      | Seconds remaining (`math.huge` for stopwatch) |
| `getFraction()`      | `number`                      | 0 → 1 progress (0 for stopwatch)              |
| `getSpeed()`         | `number`                      | Current playback multiplier                   |
| `getIsRunning()`     | `boolean`                     | `true` when `Running`                         |
| `getDisplayConfig()` | `TimerDisplayConfig \| false` | Display config used at creation               |

#### Controls (chainable → `Timer`)

| Method                  | Description                           |
| ----------------------- | ------------------------------------- |
| `start()`               | Begin or resume the timer             |
| `pause()`               | Pause (only from `Running`)           |
| `resume()`              | Alias for `start()` from `Paused`     |
| `toggle()`              | Pause ↔ Resume ↔ Start                |
| `stop()`                | Force-complete                        |
| `reset()`               | Reset elapsed to 0, state to `Idle`   |
| `restart()`             | `reset()` then `start()`              |
| `addTime(seconds)`      | Extend remaining time                 |
| `subtractTime(seconds)` | Reduce remaining time                 |
| `setElapsed(seconds)`   | Set elapsed directly                  |
| `setSpeed(multiplier)`  | Change playback speed                 |
| `addThreshold(t)`       | Add a `TimerThreshold`                |
| `removeThreshold(id)`   | Remove a threshold by ID              |
| `destroy()`             | Disconnect heartbeat, destroy signals |

#### Instance Signals

| Signal               | Payload                                                      |
| -------------------- | ------------------------------------------------------------ |
| `onTick`             | `TimerTickPayload { timerId, elapsed, remaining, fraction }` |
| `onStarted`          | `TimerLifecyclePayload { timerId, elapsed }`                 |
| `onPaused`           | `TimerLifecyclePayload`                                      |
| `onResumed`          | `TimerLifecyclePayload`                                      |
| `onCompleted`        | `TimerLifecyclePayload`                                      |
| `onReset`            | `TimerLifecyclePayload`                                      |
| `onDestroyed`        | `TimerLifecyclePayload`                                      |
| `onThresholdReached` | `TimerThresholdPayload { timerId, elapsed, threshold }`      |
| `onLoopRestart`      | `TimerLifecyclePayload`                                      |

### TimerController (Client)

Defined in [`src/timer-controller.ts`](src/timer-controller.ts). Flamework `@Controller()` — auto-wires display + effects.

| Method                         | Returns         | Description                                          |
| ------------------------------ | --------------- | ---------------------------------------------------- |
| `create(options?)`             | `Timer`         | Create timer + auto-attach display                   |
| `countdown(seconds, options?)` | `Promise<void>` | Countdown that resolves on completion, auto-destroys |
| `stopwatch(options?)`          | `Timer`         | Count-up timer, `autoStart` defaults to `true`       |
| `get(id)`                      | `Timer?`        | Retrieve timer by ID                                 |
| `getDisplay(id)`               | `TimerDisplay?` | Retrieve display by ID                               |
| `updateDisplay(id, config)`    | `void`          | Update display config at runtime                     |
| `remove(id)`                   | `void`          | Destroy timer + display                              |
| `removeAll()`                  | `void`          | Destroy all managed timers                           |
| `getAll()`                     | `string[]`      | All active timer IDs                                 |

### TimerService (Server)

Defined in [`src/timer-service.ts`](src/timer-service.ts). Flamework `@Service()` — display is always suppressed.

| Method             | Returns    | Description                                   |
| ------------------ | ---------- | --------------------------------------------- |
| `create(options?)` | `Timer`    | Create a server-only timer (`display: false`) |
| `get(id)`          | `Timer?`   | Retrieve timer by ID                          |
| `remove(id)`       | `void`     | Destroy a timer                               |
| `removeAll()`      | `void`     | Destroy all timers                            |
| `getAll()`         | `string[]` | All active timer IDs                          |

### Signals — TimerHooks

Defined in [`src/signals.ts`](src/signals.ts). Global event bus — fires for **all** timer instances.

```ts
import { TimerHooks } from '@nicholasosto/timer';

TimerHooks.onCompleted.Connect((payload) => {
  print(`Timer ${payload.timerId} completed`);
});
```

All 9 signals mirror the instance-level ones: `onTick`, `onStarted`, `onPaused`, `onResumed`, `onCompleted`, `onReset`, `onDestroyed`, `onThresholdReached`, `onLoopRestart`.

### formatTime()

Defined in [`src/format.ts`](src/format.ts).

```ts
formatTime(seconds: number, fmt: TimerFormat): string
```

| Format        | Example (90s) |
| ------------- | ------------- |
| `MinSec`      | `01:30`       |
| `MinSecTenth` | `01:30.0`     |
| `HourMinSec`  | `00:01:30`    |
| `RawSeconds`  | `90`          |
| `Compact`     | `1:30`        |

---

## Display & Effects

### Display Config

Pass a `TimerDisplayConfig` in the `display` option, or `false` to suppress UI entirely. See [`src/types.ts`](src/types.ts) for all fields.

```ts
TimerController.create({
  duration: 30,
  autoStart: true,
  display: {
    anchor: TimerAnchor.BottomCenter,
    width: 240,
    height: 50,
    format: TimerFormat.MinSecTenth,
    fontSize: 28,
    font: Enum.Font.GothamBold,
    textColor: new Color3(1, 1, 1),
    backgroundColor: new Color3(0, 0, 0),
    backgroundTransparency: 0.4,
    cornerRadius: 12,
    label: 'Round',
    effects: [TimerEffect.FadeIn, TimerEffect.FadeOut, TimerEffect.ColorShift],
    displayOrder: 10,
  },
});
```

### Effects

Defined in [`src/effects.ts`](src/effects.ts). Effects are passed as an `EffectEntry[]` — either a bare enum or `{ effect, config }`.

| Effect            | Trigger      | Description                                           |
| ----------------- | ------------ | ----------------------------------------------------- |
| `Pulse`           | Per-second   | Briefly enlarges text (configurable scale, threshold) |
| `Flash`           | Per-second   | White flash overlay on the frame                      |
| `ColorShift`      | Every tick   | Lerps text color: safe → warning → critical           |
| `Shake`           | Every tick   | Random position offset, intensifies as time runs out  |
| `FadeIn`          | On show      | Tweens frame/text from transparent to visible         |
| `FadeOut`         | On hide      | Tweens frame/text to transparent                      |
| `UrgencyGlow`     | Every tick   | Adds/grows `UIStroke` border as time runs out         |
| `CompletionBurst` | On completed | Scale burst animation with optional fade              |
| `ProgressRing`    | Every tick   | _(config defined, rendering not yet implemented)_     |

#### Custom effect config example

```ts
const effects: EffectEntry[] = [
  TimerEffect.FadeIn,
  TimerEffect.FadeOut,
  {
    effect: TimerEffect.ColorShift,
    config: {
      safeColor: new Color3(0, 1, 0),
      warningColor: new Color3(1, 1, 0),
      criticalColor: new Color3(1, 0, 0),
      warningThreshold: 0.5,
      criticalThreshold: 0.8,
    },
  },
  {
    effect: TimerEffect.Pulse,
    config: { scale: 1.2, thresholdSeconds: 10 },
  },
];
```

---

## Defaults

Defined in [`src/defaults.ts`](src/defaults.ts).

### `DEFAULT_TIMER_OPTIONS`

| Field        | Default                  |
| ------------ | ------------------------ |
| `duration`   | `0` (stopwatch)          |
| `direction`  | `Down`                   |
| `autoStart`  | `false`                  |
| `loop`       | `false`                  |
| `speed`      | `1`                      |
| `thresholds` | `[]`                     |
| `display`    | `DEFAULT_DISPLAY_CONFIG` |

### `DEFAULT_DISPLAY_CONFIG`

| Field                    | Default                         |
| ------------------------ | ------------------------------- |
| `anchor`                 | `TopCenter`                     |
| `offset`                 | `(0, 0)`                        |
| `width` × `height`       | `200 × 60`                      |
| `format`                 | `MinSec`                        |
| `textColor`              | White `(1, 1, 1)`               |
| `fontSize`               | `32`                            |
| `font`                   | `GothamBold`                    |
| `backgroundTransparency` | `0.5`                           |
| `backgroundColor`        | Black `(0, 0, 0)`               |
| `cornerRadius`           | `8`                             |
| `effects`                | `[FadeIn, FadeOut, ColorShift]` |
| `displayOrder`           | `10`                            |

### Config Resolvers

- `resolveTimerConfig(options)` — merges with defaults, auto-generates GUID, auto-infers direction
- `resolveDisplayConfig(partial)` — merges partial display config field-by-field

---

## FAQ / Troubleshooting

**Timer doesn't tick**
Check that `autoStart` is `true` or call `timer.start()` manually. Verify the timer isn't already in `Completed` or `Destroyed` state.

**No display showing**
Display only works client-side via `TimerController`. `TimerService` always sets `display: false`. Also ensure `display` is not set to `false` in your options.

**Effects not applying**
Verify the `effects` array in your display config includes the effects you want. Effects are only processed by `TimerDisplay` on the client.

**Decorator context errors at compile time**
The [`src/decorator-context.d.ts`](src/decorator-context.d.ts) file provides TypeScript 5.x decorator context stubs required when `noLib: true` is set (standard for roblox-ts with `@rbxts/compiler-types`). Don't delete it.

**Timer keeps restarting**
Check `loop: true` — looping timers reset elapsed to 0 and fire `onLoopRestart` instead of completing.

**`addTime` / `subtractTime` seem reversed**
`addTime(n)` _extends_ the remaining time (reduces elapsed). `subtractTime(n)` _reduces_ remaining time (increases elapsed). This matches the "remaining time" mental model for countdowns.

---

## Changelog

### 0.1.0

- Initial release
- Core `Timer` class with chainable API
- `TimerController` (client) with auto-display, `countdown()`, `stopwatch()`
- `TimerService` (server) for headless timers
- `TimerDisplay` with 9 visual effects via `EffectsEngine`
- Global signal bus (`TimerHooks`)
- 5 time format presets
- 9 screen anchor presets
- Threshold system with repeating support
- Config resolution with auto-generated IDs
