import { Controller, type OnStart } from '@flamework/core';
import { createDefaultRegistry } from '@nicholasosto/combat-stats';
import type { PlayerProfile } from '../../shared/player-data';
import { clientEvents } from '../network';
import { producer } from '../store';

/**
 * DataController
 *
 * Listens for the `ProfileLoaded` event from the server and
 * hydrates all client-side Reflex slices with the player's
 * persisted profile data.
 *
 * Derives maxHealth / maxMana from base attributes using the
 * combat-stats registry so resource bars display correct values.
 */
@Controller({})
export class DataController implements OnStart {
  private registry = createDefaultRegistry();

  onStart(): void {
    clientEvents.ProfileLoaded.connect((profile: PlayerProfile) => {
      this.hydrateStore(profile);
    });
  }

  /**
   * Push profile data into all relevant Reflex slices.
   */
  private hydrateStore(profile: PlayerProfile): void {
    // Convert Record<string, number> → Map<string, number> for combat-stats
    const attrMap = new Map<string, number>();
    for (const [key, value] of pairs(profile.baseAttributes)) {
      attrMap.set(key as string, value as number);
    }

    // Compute derived stats (maxHealth, maxMana, etc.)
    const derived = this.registry.computeDerivedStats(attrMap);
    const maxHealth = derived.get('maxHealth') ?? 200;
    const maxMana = derived.get('maxMana') ?? 130;

    // Hydrate resource slices
    producer.setHealth(maxHealth, maxHealth);
    producer.setMana(maxMana, maxMana);

    // Hydrate ability slots from the loadout
    const abilitySlots = profile.abilityLoadout.map((abilityId, _index) => ({
      abilityId,
      displayName: abilityId,
      iconImage: '',
      cooldownRemaining: 0,
      isReady: true,
    }));
    producer.setAbilities(abilitySlots);

    // Hydrate the profile slice (level, currency, inventory, settings, etc.)
    producer.setProfile(profile);

    print(
      `[DataController] Profile hydrated — Level ${profile.level}, ` +
        `HP ${maxHealth}, MP ${maxMana}, ${profile.abilityLoadout.size()} abilities`,
    );
  }
}
