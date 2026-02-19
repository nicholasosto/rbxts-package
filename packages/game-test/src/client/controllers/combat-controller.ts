import { Controller, type OnStart } from '@flamework/core';
import Maid from '@rbxts/maid';
import { clientEvents } from '../network';
import { producer } from '../store';
import { type AnimationController } from './animation-controller';
import { type AudioController } from './audio-controller';
import { type CombatState } from '../types';

const COMBO_TIMEOUT = 1.5; // seconds before combo resets
const ATTACK_COOLDOWN = 0.4; // seconds between attacks

/**
 * CombatController
 *
 * Manages client-side combat state, combo tracking, cooldowns,
 * and coordinates with Animation/Audio controllers on combat events.
 * Dispatches health/mana changes to the Reflex store.
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

  private maid = new Maid();

  constructor(
    private animationController: AnimationController,
    private audioController: AudioController,
  ) {}

  onStart(): void {
    this.listenForServerEvents();
  }

  /** Listen for damage and state updates from server */
  private listenForServerEvents(): void {
    this.maid.GiveTask(
      clientEvents.PlayerDamaged.connect((amount: number, _sourceId?: string) => {
        // Update health in store
        producer.takeDamage(amount);
        // Play hit SFX
        this.audioController.playSfx('SfxCombat', 'HitLight', 0.8);
      }),
    );

    this.maid.GiveTask(
      clientEvents.CombatStateUpdate.connect((serverState: Record<string, unknown>) => {
        // Merge server authority into local state
        if ('health' in serverState && 'maxHealth' in serverState) {
          producer.setHealth(serverState.health as number, serverState.maxHealth as number);
        }
        if ('mana' in serverState && 'maxMana' in serverState) {
          producer.setMana(serverState.mana as number, serverState.maxMana as number);
        }
      }),
    );
  }

  /** Called by InputController when player initiates an attack */
  public attack(): void {
    const now = os.clock();

    // Cooldown check
    if (now - this.state.lastAttackTick < ATTACK_COOLDOWN) return;
    if (this.state.isAttacking) return;

    // Combo tracking — reset if too much time passed
    if (now - this.state.lastAttackTick > COMBO_TIMEOUT) {
      this.state.comboCount = 0;
    }

    this.state.isAttacking = true;
    this.state.comboCount += 1;
    this.state.lastAttackTick = now;

    // Play attack animation based on combo count
    const animKey = this.state.comboCount % 2 === 1 ? 'BasicMelee01' : 'BasicMelee02';
    this.animationController.playAnimation('Melee', animKey);
    this.audioController.playSfx('SfxCombat', 'Swing');

    // Notify server
    clientEvents.CombatAction.fire('attack');

    // Reset attacking flag after a brief delay
    task.delay(ATTACK_COOLDOWN, () => {
      this.state.isAttacking = false;
    });
  }

  /** Called by InputController when player starts blocking */
  public block(): void {
    this.state.isBlocking = true;
    this.animationController.playAnimation('Combat', 'Block');
    clientEvents.CombatAction.fire('block');
  }

  /** Called by InputController when player stops blocking */
  public unblock(): void {
    this.state.isBlocking = false;
    this.animationController.stopAll();
  }

  /** Called by InputController when player dodges */
  public dodge(): void {
    this.animationController.playAnimation('Combat', 'Dodge');
    this.audioController.playSfx('SfxCombat', 'Dodge');
    clientEvents.CombatAction.fire('dodge');
  }

  /** Called by InputController for ability usage */
  public useAbility(abilityId: string): void {
    if (this.state.cooldowns.has(abilityId)) return;

    // Fire ability event to server
    clientEvents.AbilityUsed.fire(abilityId);
    this.audioController.playSfx('SfxCombat', 'AbilityCast');
  }

  /** Get current combat state (read-only for UI) */
  public getState(): Readonly<CombatState> {
    return this.state;
  }
}
