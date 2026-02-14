import { Controller, OnStart } from '@flamework/core';
import { GlobalEvents } from '../../shared/network';
import { AnimationController } from './animation-controller';
import { AudioController } from './audio-controller';
import { CombatState } from '../types';

/**
 * CombatController
 *
 * Manages client-side combat state, combo tracking, cooldowns,
 * and coordinates with Animation/Audio controllers on combat events.
 */
@Controller({})
export class CombatController implements OnStart {
  private state: CombatState = {
    isAttacking: false,
    isBlocking: false,
    comboCount: 0,
    lastAttackTick: 0,
    cooldowns: new Map(),
  };

  private networkEvents!: ReturnType<typeof GlobalEvents.createClient>;

  constructor(
    private animationController: AnimationController,
    private audioController: AudioController,
  ) {}

  onStart(): void {
    print('[CombatController] Started');
    this.networkEvents = GlobalEvents.createClient({});
    this.listenForServerEvents();
  }

  /** Listen for damage and state updates from server */
  private listenForServerEvents(): void {
    this.networkEvents.PlayerDamaged.connect((amount: number, sourceId?: string) => {
      // TODO: Shake camera, flash HUD, play hit SFX
      print(`[CombatController] Took ${amount} damage from ${sourceId}`);
    });

    this.networkEvents.CombatStateUpdate.connect((serverState: Record<string, unknown>) => {
      // TODO: Merge server authority into local state
      print('[CombatController] State update received');
    });
  }

  /** Called by InputController when player initiates an attack */
  public attack(): void {
    if (this.state.isAttacking) return;
    // TODO: Validate cooldown, increment combo, fire server event
    this.state.isAttacking = true;
    this.state.comboCount += 1;
    this.state.lastAttackTick = os.clock();

    // TODO: this.animationController.playAnimation('BasicMelee01');
    // TODO: this.audioController.playSfx('HitLight');
    // TODO: GlobalEvents.client.fire('CombatAction', 'attack');
  }

  /** Called by InputController when player starts blocking */
  public block(): void {
    // TODO: Set blocking state, play block animation
    this.state.isBlocking = true;
  }

  /** Called by InputController when player dodges */
  public dodge(): void {
    // TODO: Play dodge animation, apply i-frames
  }

  /** Called by InputController for ability usage */
  public useAbility(abilityId: string): void {
    if (this.state.cooldowns.has(abilityId)) return;
    // TODO: Fire ability event to server
    // TODO: GlobalEvents.client.fire('AbilityUsed', abilityId);
  }

  /** Get current combat state (read-only for UI) */
  public getState(): Readonly<CombatState> {
    return this.state;
  }
}
