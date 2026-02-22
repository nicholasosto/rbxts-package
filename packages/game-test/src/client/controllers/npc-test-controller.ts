import { Controller, type OnStart } from '@flamework/core';
import type { NpcFaction } from '@nicholasosto/npc';
import { UserInputService } from '@rbxts/services';

import { GlobalEvents } from '../../shared/network';

/** Map number keys to factions for quick testing. */
const FACTION_KEYBINDS: ReadonlyMap<Enum.KeyCode, NpcFaction> = new Map<Enum.KeyCode, NpcFaction>([
  [Enum.KeyCode.One, 'Robot'],
  [Enum.KeyCode.Two, 'Spirit'],
  [Enum.KeyCode.Three, 'Decay'],
  [Enum.KeyCode.Four, 'Fateless'],
  [Enum.KeyCode.Five, 'Blood'],
]);

const FACTIONS: readonly NpcFaction[] = ['Robot', 'Spirit', 'Decay', 'Fateless', 'Blood'];

/**
 * NpcTestController
 *
 * Interactive test harness for the @nicholasosto/npc package.
 * Press keys to exercise NPC spawning on the server:
 *
 *   1 — Spawn Robot NPC
 *   2 — Spawn Spirit NPC
 *   3 — Spawn Decay NPC
 *   4 — Spawn Fateless NPC
 *   5 — Spawn Blood NPC
 *   N — Spawn random-faction NPC
 *   B — Despawn all test NPCs
 */
@Controller({})
export class NpcTestController implements OnStart {
  private networkEvents = GlobalEvents.createClient({});

  onStart(): void {
    print('[NpcTestController] Started — press 1-5 / N / B to test NPC spawning');
    print('  1=Robot  2=Spirit  3=Decay  4=Void  5=Blood  N=Random  B=DespawnAll');

    this.listenForServerEvents();
    this.bindKeys();
  }

  private listenForServerEvents(): void {
    // Confirm spawns
    this.networkEvents.NpcSpawned.connect((npcId, faction, name) => {
      print(`[NpcTest] ✓ Spawned: "${name}" (${faction}) — ID: ${npcId}`);
    });

    // Confirm despawn
    this.networkEvents.NpcsDespawned.connect((count) => {
      print(`[NpcTest] ✓ Despawned ${count} NPC(s)`);
    });
  }

  private bindKeys(): void {
    UserInputService.InputBegan.Connect((input, gameProcessed) => {
      if (gameProcessed) return;

      // Number keys 1-5 → spawn specific faction
      const faction = FACTION_KEYBINDS.get(input.KeyCode);
      if (faction) {
        print(`[NpcTest] Requesting ${faction} NPC spawn...`);
        this.networkEvents.SpawnNpc.fire(faction);
        return;
      }

      switch (input.KeyCode) {
        case Enum.KeyCode.N: {
          // Random faction
          const randomFaction = FACTIONS[math.random(0, FACTIONS.size() - 1)];
          print(`[NpcTest] Requesting random NPC spawn (${randomFaction})...`);
          this.networkEvents.SpawnNpc.fire(randomFaction);
          break;
        }
        case Enum.KeyCode.B: {
          print('[NpcTest] Requesting despawn all NPCs...');
          this.networkEvents.DespawnAllNpcs.fire();
          break;
        }
      }
    });
  }
}
