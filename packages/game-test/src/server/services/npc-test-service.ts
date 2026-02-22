import { Service, type OnStart } from '@flamework/core';
import {
  createNpcDefinition,
  createNpcInstance,
  getRigNamesForFaction,
  type NpcFaction,
  type NpcInstance,
} from '@nicholasosto/npc';
import { InsertService, ReplicatedStorage } from '@rbxts/services';

import { GlobalEvents } from '../../shared/network';

// Factions accepted by the NPC package
const VALID_FACTIONS: readonly NpcFaction[] = ['Robot', 'Spirit', 'Decay', 'Fateless', 'Blood'];

/** Asset ID for the "Asset Package - RIGS" saved package. */
const RIG_PACKAGE_ASSET_ID = 16034962856;

/** Name of the rig package model (used for both InsertService result and hierarchy lookup). */
const RIG_PACKAGE_NAME = 'Asset Package - RIGS';

/**
 * Maps code faction keys to the folder names inside the Roblox rig package.
 * The package uses "Robots" (plural) while the code faction is "Robot".
 */
const FACTION_FOLDER_NAMES: Record<NpcFaction, string> = {
  Blood: 'Blood',
  Decay: 'Decay',
  Fateless: 'Fateless',
  Robot: 'Robots',
  Spirit: 'Spirit',
};

/**
 * NpcTestService
 *
 * Server-side test harness for the @nicholasosto/npc package.
 * Listens for client events to spawn / despawn NPC instances and
 * clones rig models from a rig package.
 *
 * Rig resolution strategy (in order):
 *   1. **InsertService** — loads the package asset once on startup and caches it
 *      under ReplicatedStorage. Preferred for published experiences.
 *   2. **Hierarchy lookup** — searches the existing ReplicatedStorage tree
 *      (e.g. when the package was inserted manually in Studio).
 *   3. **Direct child** — last resort fallback.
 */
@Service()
export class NpcTestService implements OnStart {
  private networkEvents = GlobalEvents.createServer({});

  /** Active test NPC instances keyed by runtime ID. */
  private activeNpcs = new Map<string, NpcInstance>();

  /** Folder in workspace to parent spawned NPC models. */
  private npcFolder?: Folder;

  /** Cached reference to the loaded rig package root (from InsertService or hierarchy). */
  private rigPackageRoot?: Instance;

  onStart(): void {
    print('[NpcTestService] Started — waiting for client spawn requests');

    // Create a workspace folder for spawned NPCs
    const folder = new Instance('Folder');
    folder.Name = 'TestNPCs';
    folder.Parent = game.GetService('Workspace');
    this.npcFolder = folder;

    // Load the rig package (InsertService first, then hierarchy fallback)
    this.loadRigPackage();

    this.bindEvents();
  }

  /**
   * Attempt to load the rig package. Tries InsertService first;
   * falls back to finding it already present in ReplicatedStorage.
   */
  private loadRigPackage(): void {
    // 1. Check if already in ReplicatedStorage (e.g. manually inserted in Studio)
    const existing = ReplicatedStorage.FindFirstChild(RIG_PACKAGE_NAME);
    if (existing) {
      this.rigPackageRoot = existing;
      print(`[NpcTestService] Found rig package in ReplicatedStorage (hierarchy mode)`);
      return;
    }

    // 2. Try InsertService.LoadAsset
    const [success, result] = pcall(() => InsertService.LoadAsset(RIG_PACKAGE_ASSET_ID));
    if (success && result) {
      // LoadAsset returns a Model wrapper; the actual package is the first child
      const packageModel = result.FindFirstChild(RIG_PACKAGE_NAME) ?? result.GetChildren()[0];
      if (packageModel) {
        packageModel.Parent = ReplicatedStorage;
        this.rigPackageRoot = packageModel;
        result.Destroy(); // Clean up the wrapper
        print(
          `[NpcTestService] Loaded rig package via InsertService (asset ${RIG_PACKAGE_ASSET_ID})`,
        );
      } else {
        result.Destroy();
        warn('[NpcTestService] InsertService returned empty model — no rigs available');
      }
    } else {
      warn(
        `[NpcTestService] InsertService.LoadAsset failed — rigs will only spawn as data. ` +
          `Make sure the game has access to asset ${RIG_PACKAGE_ASSET_ID} or insert the package manually.`,
      );
    }
  }

  private bindEvents(): void {
    // ── Spawn NPC ───────────────────────────────────────────
    this.networkEvents.SpawnNpc.connect((player, factionRaw) => {
      const faction = this.validateFaction(factionRaw);
      if (!faction) {
        warn(`[NpcTestService] Invalid faction "${factionRaw}" from ${player.Name}`);
        return;
      }

      const instance = this.spawnNpc(faction, player);
      if (instance) {
        this.networkEvents.NpcSpawned.fire(
          player,
          instance.id,
          instance.definition.faction,
          instance.definition.name,
        );
      }
    });

    // ── Despawn All ─────────────────────────────────────────
    this.networkEvents.DespawnAllNpcs.connect((player) => {
      const count = this.despawnAll();
      print(`[NpcTestService] ${player.Name} despawned ${count} NPCs`);
      this.networkEvents.NpcsDespawned.fire(player, count);
    });
  }

  // ── Core Logic ──────────────────────────────────────────────────────────

  private spawnNpc(faction: NpcFaction, player: Player): NpcInstance | undefined {
    // 1. Create definition & instance (pure data)
    const definition = createNpcDefinition(faction);
    const instance = createNpcInstance(definition);

    // 2. Log stat summary
    this.logNpcStats(instance);

    // 3. Attempt to clone the rig model from the asset package
    const model = this.cloneRigModel(instance.definition.faction, instance.definition.rigName);
    if (model) {
      // Position near the player
      const character = player.Character;
      if (character) {
        const rootPart = character.FindFirstChild('HumanoidRootPart') as BasePart | undefined;
        if (rootPart) {
          const offset = new Vector3(math.random(-15, 15), 0, math.random(-15, 15));
          const spawnPos = rootPart.Position.add(offset).add(new Vector3(0, 3, 0));

          // Position the model
          if (model.PrimaryPart) {
            model.PivotTo(new CFrame(spawnPos));
          } else {
            // Fallback: move the first BasePart we find
            const firstPart = model.FindFirstChildWhichIsA('BasePart');
            if (firstPart) {
              firstPart.Position = spawnPos;
            }
          }
        }
      }

      model.Name = `${instance.definition.name} [${instance.id}]`;
      model.Parent = this.npcFolder;
      instance.model = model;
      print(`[NpcTestService] Cloned rig model "${instance.definition.rigName}"`);
    } else {
      warn(
        `[NpcTestService] Rig model "${instance.definition.rigName}" not found in ReplicatedStorage — spawned data only`,
      );
    }

    // 4. Register
    this.activeNpcs.set(instance.id, instance);
    print(
      `[NpcTestService] Spawned: ${instance.definition.name} | ${faction} | Level ${instance.definition.level} | ID: ${instance.id}`,
    );
    print(`[NpcTestService] Active NPCs: ${this.activeNpcs.size()}`);

    return instance;
  }

  private despawnAll(): number {
    let count = 0;
    for (const [_id, npc] of this.activeNpcs) {
      if (npc.model) {
        npc.model.Destroy();
      }
      count++;
    }
    this.activeNpcs.clear();
    return count;
  }

  // ── Helpers ─────────────────────────────────────────────────────────────

  private validateFaction(raw: string): NpcFaction | undefined {
    for (const f of VALID_FACTIONS) {
      if (f === raw) return f;
    }
    return undefined;
  }

  /**
   * Attempt to find and clone a rig model.
   *
   * Search order:
   *   1. Cached rig package root > [Faction Folder] > [RigName]
   *   2. Cached rig package root (recursive FindFirstChild)
   *   3. Direct child of ReplicatedStorage (fallback)
   */
  private cloneRigModel(faction: NpcFaction, rigName: string): Model | undefined {
    let model: Model | undefined;

    // 1–2. Search inside the cached rig package (loaded via InsertService or hierarchy)
    if (this.rigPackageRoot) {
      const factionFolder = this.rigPackageRoot.FindFirstChild(FACTION_FOLDER_NAMES[faction]);
      if (factionFolder) {
        model = factionFolder.FindFirstChild(rigName) as Model | undefined;
      }

      // Fallback: recursive search anywhere in the package
      if (!model) {
        model = this.rigPackageRoot.FindFirstChild(rigName, true) as Model | undefined;
      }
    }

    // 3. Last resort: direct child of ReplicatedStorage
    if (!model) {
      model = ReplicatedStorage.FindFirstChild(rigName) as Model | undefined;
    }

    if (model && model.IsA('Model')) {
      return model.Clone();
    }

    return undefined;
  }

  private logNpcStats(npc: NpcInstance): void {
    const def = npc.definition;
    const derived = npc.statProfile.derivedStats;

    const maxHp = derived.get('maxHealth') ?? '?';
    const maxMp = derived.get('maxMana') ?? '?';
    const physDmg = derived.get('physicalDamage') ?? '?';
    const magDmg = derived.get('magicDamage') ?? '?';
    const armor = derived.get('armor') ?? '?';

    print(`[NpcTestService] ── ${def.name} ──`);
    print(`  Faction: ${def.faction} | Rig: ${def.rigName} | Level: ${def.level}`);
    print(
      `  HP: ${maxHp} | MP: ${maxMp} | PhysDmg: ${physDmg} | MagDmg: ${magDmg} | Armor: ${armor}`,
    );
    print(`  State: ${npc.currentState} | Health: ${npc.currentHealth}`);

    // Log available rigs for this faction
    const rigs = getRigNamesForFaction(def.faction);
    print(`  Available rigs for ${def.faction}: ${rigs.join(', ')}`);
  }
}
