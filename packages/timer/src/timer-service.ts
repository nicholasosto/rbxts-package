// ─── Timer Package: Flamework Server Service ─────────────────────────────────
import { Service, OnInit } from '@flamework/core';
import { Timer } from './timer';
import { TimerOptions } from './types';

/**
 * Server-side authoritative timer management.
 *
 * Timers created here have no display — they run purely on the server.
 * Use for match timers, cooldowns, or any server-authoritative timing.
 */
@Service()
export class TimerService implements OnInit {
  private timers = new Map<string, Timer>();

  onInit(): void {
    // Service ready
  }

  /**
   * Creates a new server-side timer.
   * Display is always suppressed on the server.
   */
  public create(options: TimerOptions = {}): Timer {
    const timerOptions: TimerOptions = {
      ...options,
      display: false, // Never display on server
    };

    const timer = new Timer(timerOptions);
    this.timers.set(timer.id, timer);

    timer.onDestroyed.Connect(() => {
      this.timers.delete(timer.id);
    });

    return timer;
  }

  /**
   * Gets a timer by ID.
   */
  public get(id: string): Timer | undefined {
    return this.timers.get(id);
  }

  /**
   * Removes and destroys a timer.
   */
  public remove(id: string): void {
    const timer = this.timers.get(id);
    if (timer) {
      timer.destroy();
    }
  }

  /**
   * Removes and destroys all timers.
   */
  public removeAll(): void {
    for (const [, timer] of this.timers) {
      timer.destroy();
    }
    this.timers.clear();
  }

  /**
   * Returns all active timer IDs.
   */
  public getAll(): string[] {
    const ids: string[] = [];
    for (const [id] of this.timers) {
      ids.push(id);
    }
    return ids;
  }
}
