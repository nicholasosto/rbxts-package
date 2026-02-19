// ─── Timer Package: Flamework Client Controller ──────────────────────────────
import { Controller, type OnInit } from '@flamework/core';
import { TimerDisplay } from './display';
import { Timer } from './timer';
import { type TimerDisplayConfig, type TimerOptions, type TimerTickPayload } from './types';

interface ManagedTimer {
  timer: Timer;
  display?: TimerDisplay;
}

/**
 * Client-side timer controller with automatic display and effects.
 *
 * Creates timers that automatically render on-screen with visual effects.
 * For server-side timers without display, use TimerService.
 */
@Controller()
export class TimerController implements OnInit {
  private managed = new Map<string, ManagedTimer>();

  onInit(): void {
    // Controller ready
  }

  /**
   * Creates a new client-side timer with optional display.
   */
  public create(options: TimerOptions = {}): Timer {
    const timer = new Timer(options);
    const managed: ManagedTimer = { timer };

    // Create display if config is provided and not false
    if (timer.getDisplayConfig() !== false) {
      const display = new TimerDisplay(
        timer.id,
        timer.getDisplayConfig() as TimerDisplayConfig,
        timer.config.duration,
      );
      managed.display = display;

      // Wire tick updates to display
      timer.onTick.Connect((payload: TimerTickPayload) => {
        display.onTick(payload);
      });

      // Wire completion
      timer.onCompleted.Connect(() => {
        display.onCompleted();
      });

      // Wire destruction
      timer.onDestroyed.Connect(() => {
        display.destroy();
      });
    }

    this.managed.set(timer.id, managed);

    timer.onDestroyed.Connect(() => {
      this.managed.delete(timer.id);
    });

    return timer;
  }

  /**
   * Quick countdown that resolves when complete.
   *
   * @param seconds Duration in seconds
   * @param options Additional timer options
   * @returns Promise that resolves when the countdown finishes
   */
  public countdown(
    seconds: number,
    options: Omit<TimerOptions, 'duration' | 'autoStart'> = {},
  ): Promise<void> {
    return new Promise((resolve) => {
      const timer = this.create({
        ...options,
        duration: seconds,
        autoStart: true,
      });

      timer.onCompleted.Once(() => {
        task.delay(0.5, () => {
          timer.destroy();
        });
        resolve();
      });
    });
  }

  /**
   * Creates a stopwatch (count-up timer with no duration).
   */
  public stopwatch(options: Omit<TimerOptions, 'duration' | 'direction'> = {}): Timer {
    return this.create({
      ...options,
      duration: 0,
      autoStart: options.autoStart ?? true,
    });
  }

  /**
   * Gets a managed timer by ID.
   */
  public get(id: string): Timer | undefined {
    return this.managed.get(id)?.timer;
  }

  /**
   * Gets the display for a timer.
   */
  public getDisplay(id: string): TimerDisplay | undefined {
    return this.managed.get(id)?.display;
  }

  /**
   * Updates the display configuration of an active timer.
   */
  public updateDisplay(id: string, config: Partial<TimerDisplayConfig>): void {
    const display = this.managed.get(id)?.display;
    if (display) {
      display.updateConfig(config);
    }
  }

  /**
   * Removes and destroys a timer and its display.
   */
  public remove(id: string): void {
    const managed = this.managed.get(id);
    if (managed) {
      managed.timer.destroy();
    }
  }

  /**
   * Removes and destroys all timers.
   */
  public removeAll(): void {
    for (const [, managed] of this.managed) {
      managed.timer.destroy();
    }
    this.managed.clear();
  }

  /**
   * Returns all active timer IDs.
   */
  public getAll(): string[] {
    const ids: string[] = [];
    for (const [id] of this.managed) {
      ids.push(id);
    }
    return ids;
  }
}
