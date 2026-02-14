import { Service, OnStart } from '@flamework/core';
import { GlobalEvents, GlobalFunctions } from '../../shared/network';

/**
 * Core server service — handles incoming client events.
 * This service ensures Flamework networking is initialized on the server,
 * which creates the necessary RemoteEvents in ReplicatedStorage.
 */
@Service()
export class GameService implements OnStart {
  private networkEvents = GlobalEvents.createServer({});
  private networkFunctions = GlobalFunctions.createServer({});

  onStart(): void {
    print('[GameService] Started');

    this.networkEvents.CombatAction.connect((player, action, targetId) => {
      print(`[GameService] ${player.Name} used CombatAction: ${action}, target: ${targetId}`);
    });

    this.networkEvents.AbilityUsed.connect((player, abilityId) => {
      print(`[GameService] ${player.Name} used Ability: ${abilityId}`);
    });

    this.networkFunctions.GetAbilityLoadout.setCallback((player) => {
      print(`[GameService] ${player.Name} requested ability loadout`);
      return ['Fireball', 'Shield', 'Heal'];
    });
  }
}
