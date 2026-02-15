import { Service, OnStart } from '@flamework/core';
import { Players } from '@rbxts/services';
import { GlobalEvents, GlobalFunctions } from '../../shared/network';

/**
 * Core server service — handles incoming client events.
 *
 * Validates player requests, applies damage / ability logic,
 * and fires state updates back to the client.
 */
@Service()
export class GameService implements OnStart {
  private networkEvents = GlobalEvents.createServer({});
  private networkFunctions = GlobalFunctions.createServer({});

  onStart(): void {
    // ── Combat Actions ──────────────────────────────────────
    this.networkEvents.CombatAction.connect((player, action, _targetId) => {
      const character = player.Character;
      if (!character) return;
      const humanoid = character.FindFirstChildOfClass('Humanoid');
      if (!humanoid) return;

      // Validate the player is alive
      if (humanoid.Health <= 0) return;

      switch (action) {
        case 'Attack': {
          // TODO: hit-detection / raycast, apply damage to target
          // For now echo an animation + audio to all nearby clients
          this.networkEvents.AnimationPlay.fire(player, 'Melee.Swing', player.UserId + '');
          this.networkEvents.AudioCue.fire(player, 'Combat.Swing');
          break;
        }
        case 'Block': {
          this.networkEvents.AnimationPlay.fire(player, 'Combat.Block', player.UserId + '');
          break;
        }
        case 'Dodge': {
          this.networkEvents.AnimationPlay.fire(player, 'Combat.Dodge', player.UserId + '');
          break;
        }
        default:
          break;
      }
    });

    // ── Ability Used ────────────────────────────────────────
    this.networkEvents.AbilityUsed.connect((player, abilityId) => {
      const character = player.Character;
      if (!character) return;
      const humanoid = character.FindFirstChildOfClass('Humanoid');
      if (!humanoid || humanoid.Health <= 0) return;

      // TODO: validate cooldown, mana cost, then apply effect
      this.networkEvents.AnimationPlay.fire(player, `Magic.${abilityId}`, player.UserId + '');
      this.networkEvents.AudioCue.fire(player, `Ability.${abilityId}`);
    });

    // ── Ability Loadout ─────────────────────────────────────
    this.networkFunctions.GetAbilityLoadout.setCallback((_player) => {
      // TODO: load from data store per player
      return ['Fireball', 'Shield', 'Heal', 'Dash'];
    });
  }
}
