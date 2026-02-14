import { Controller, OnStart } from '@flamework/core';
import { UserInputService } from '@rbxts/services';
import {
  TimerController,
  TimerAnchor,
  TimerEffect,
  TimerFormat,
  Timer,
  TimerHooks,
} from '@nicholasosto/timer';

/**
 * TimerTestController
 *
 * Interactive test harness for the @nicholasosto/timer package.
 * Press keys to exercise different timer features:
 *
 *   T — 30s round timer (TopCenter, ColorShift + Pulse + Shake)
 *   Y — 3-2-1 countdown → "Go!" (Center, big text)
 *   U — Stopwatch (BottomRight)
 *   P — Pause / resume the most recent timer
 *   G — Add 5 seconds to the most recent timer
 *   H — Subtract 5 seconds from the most recent timer
 *   X — Destroy the most recent timer
 *   Z — Destroy all timers
 */
@Controller({})
export class TimerTestController implements OnStart {
  private lastTimer?: Timer;

  constructor(private timerCtrl: TimerController) {}

  onStart(): void {
    print('[TimerTestController] Started — press T / Y / U / P / G / H / X / Z to test');

    // Global hook: log every completion
    TimerHooks.onCompleted.Connect((payload) => {
      print(`[TimerHooks] Timer ${payload.timerId} completed at ${payload.elapsed}s`);
    });

    TimerHooks.onThresholdReached.Connect((payload) => {
      print(`[TimerHooks] Threshold "${payload.threshold.id}" reached on ${payload.timerId}`);
    });

    this.bindKeys();
  }

  private bindKeys(): void {
    UserInputService.InputBegan.Connect((input, gameProcessed) => {
      if (gameProcessed) return;

      switch (input.KeyCode) {
        case Enum.KeyCode.T:
          this.testRoundTimer();
          break;
        case Enum.KeyCode.Y:
          this.testCountdown();
          break;
        case Enum.KeyCode.U:
          this.testStopwatch();
          break;
        case Enum.KeyCode.P:
          this.testPauseResume();
          break;
        case Enum.KeyCode.G:
          this.testAddTime();
          break;
        case Enum.KeyCode.H:
          this.testSubtractTime();
          break;
        case Enum.KeyCode.X:
          this.testDestroy();
          break;
        case Enum.KeyCode.Z:
          this.testDestroyAll();
          break;
      }
    });
  }

  // ── Test Scenarios ──────────────────────────────────────────────────────

  /** T — 30-second round timer with multiple effects */
  private testRoundTimer(): void {
    print('[TimerTest] Creating 30s round timer');

    const timer = this.timerCtrl.create({
      duration: 30,
      autoStart: true,
      display: {
        anchor: TimerAnchor.TopCenter,
        label: 'Round Timer',
        effects: [
          TimerEffect.FadeIn,
          TimerEffect.ColorShift,
          TimerEffect.Pulse,
          { effect: TimerEffect.Shake, config: { thresholdSeconds: 5, intensity: 4 } },
          TimerEffect.CompletionBurst,
        ],
      },
      thresholds: [
        { id: 'halfway', time: 15 },
        { id: 'warning', time: 10 },
        { id: 'critical', time: 3 },
      ],
    });

    timer.onThresholdReached.Connect(({ threshold }) => {
      print(`[RoundTimer] Threshold reached: ${threshold.id}`);
    });

    timer.onCompleted.Connect(() => {
      print('[RoundTimer] Completed!');
    });

    this.lastTimer = timer;
  }

  /** Y — Quick 3-2-1 countdown */
  private testCountdown(): void {
    print('[TimerTest] Starting 3-2-1 countdown...');

    this.timerCtrl
      .countdown(3, {
        display: {
          anchor: TimerAnchor.Center,
          fontSize: 72,
          format: TimerFormat.RawSeconds,
          effects: [TimerEffect.Pulse, TimerEffect.CompletionBurst],
          backgroundTransparency: 0.7,
          width: 120,
          height: 120,
          cornerRadius: 60,
        },
      })
      .then(() => {
        print('[TimerTest] Go!');
      });
  }

  /** U — Stopwatch */
  private testStopwatch(): void {
    print('[TimerTest] Starting stopwatch');

    const sw = this.timerCtrl.stopwatch({
      display: {
        anchor: TimerAnchor.BottomRight,
        format: TimerFormat.MinSecTenth,
        label: 'Elapsed',
        effects: [TimerEffect.FadeIn],
      },
    });

    this.lastTimer = sw;
  }

  /** P — Pause / resume */
  private testPauseResume(): void {
    if (!this.lastTimer) {
      print('[TimerTest] No active timer to pause/resume');
      return;
    }
    this.lastTimer.toggle();
    print(`[TimerTest] Toggled — state: ${this.lastTimer.getState()}`);
  }

  /** G — Add 5 seconds */
  private testAddTime(): void {
    if (!this.lastTimer) {
      print('[TimerTest] No active timer');
      return;
    }
    this.lastTimer.addTime(5);
    print(`[TimerTest] Added 5s — remaining: ${this.lastTimer.getRemaining()}`);
  }

  /** H — Subtract 5 seconds */
  private testSubtractTime(): void {
    if (!this.lastTimer) {
      print('[TimerTest] No active timer');
      return;
    }
    this.lastTimer.subtractTime(5);
    print(`[TimerTest] Subtracted 5s — remaining: ${this.lastTimer.getRemaining()}`);
  }

  /** X — Destroy last timer */
  private testDestroy(): void {
    if (!this.lastTimer) {
      print('[TimerTest] No active timer to destroy');
      return;
    }
    print(`[TimerTest] Destroying timer ${this.lastTimer.id}`);
    this.lastTimer.destroy();
    this.lastTimer = undefined;
  }

  /** Z — Destroy all */
  private testDestroyAll(): void {
    print('[TimerTest] Destroying all timers');
    this.timerCtrl.removeAll();
    this.lastTimer = undefined;
  }
}
