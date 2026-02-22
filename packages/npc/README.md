# @nicholasosto/npc

NPC definitions, faction stat scaling, state machine configs, and zone-based spawning utilities for roblox-ts games.

This is a **pure data/utility library** — runtime spawning, AI execution, and model management are handled by the consuming game service (e.g. a Flamework `@Service` in `game-test`).

## Dependencies

| Package                        | Purpose                                         |
| ------------------------------ | ----------------------------------------------- |
| `@nicholasosto/assets`         | Rig model names (`RIG_CATALOG`), faction types  |
| `@nicholasosto/combat-stats`   | Attribute registry, stat profiles, combat state |
| `@nicholasosto/name-generator` | Themed NPC name generation                      |

## Quick Start

```ts
import {
  createNpcDefinition,
  createNpcInstance,
  createSpawnZoneConfig,
  getRandomRigForFaction,
} from '@nicholasosto/npc';

// Create a level 5 Robot NPC with a random rig
const definition = createNpcDefinition('Robot', undefined, 5);
// → { name: "Servo Ironclad the Forged", faction: "Robot", rigName: "Steambot", level: 5, ... }

// Spawn a runtime instance with computed stats
const instance = createNpcInstance(definition);
// → { id: "npc_123456_...", statProfile: { ... }, currentState: "Idle", currentHealth: 150, ... }

// Pick a specific rig
const rigName = getRandomRigForFaction('Spirit');
// → "Ghost" | "Wisp" | "Specter" | "Spirit_Elemental" | "Spirit_Dragon_Boy"

// Define a spawn zone
const zone = createSpawnZoneConfig('graveyard', 'Decay', [3, 8], {
  maxNpcs: 10,
  respawnDelay: 15,
});
```

## Factions & Stat Modifiers

Each faction applies attribute multipliers when building an NPC's stat profile, creating distinct combat roles:

| Faction    | Identity                   | Buffed                          | Weakened          |
| ---------- | -------------------------- | ------------------------------- | ----------------- |
| **Robot**  | Tanky bruisers             | Strength ×1.3, Vitality ×1.2    | Intelligence ×0.7 |
| **Spirit** | Glass-cannon casters       | Intelligence ×1.4, Spirit ×1.3  | Vitality ×0.8     |
| **Decay**  | Slow, durable undead       | Vitality ×1.5, Strength ×1.1    | Agility ×0.6      |
| **Void**   | Evasive shadow assassins   | Agility ×1.3, Intelligence ×1.2 | Luck ×0.7         |
| **Blood**  | Balanced melee / lifesteal | Strength ×1.2, Agility ×1.2     | Intelligence ×0.8 |

## Available Rigs

Rigs are model names referencing models in `ReplicatedStorage` (from `@nicholasosto/assets`):

- **Robot** — Evil_Hal, Monkey_Mecha, Steambot, Worker, Freddy_Faz
- **Spirit** — Ghost, Wisp, Specter, Spirit_Elemental, Spirit_Dragon_Boy
- **Decay** — Zombie, Zombie_Hipster
- **Void** — Shadow, Darkling, Void_Wendigo, Void_Master
- **Blood** — Vampire, Blood_Mist, Blood_Toad

## State Machine

NPCs use a configurable finite state machine. The default transitions:

```
Idle ──► Patrol ──► Aggro ──► Attack
 ▲          │          │         │
 └──────────┘          ▼         ▼
                     Flee ──► Idle
         (any state) ──► Dead
```

**Conditions** evaluated by the game service at runtime:

| Condition            | Triggers            |
| -------------------- | ------------------- |
| `patrolTimerElapsed` | Idle → Patrol       |
| `patrolComplete`     | Patrol → Idle       |
| `playerInRange`      | Idle/Patrol → Aggro |
| `targetLost`         | Aggro → Idle        |
| `inAttackRange`      | Aggro → Attack      |
| `targetOutOfRange`   | Attack → Aggro      |
| `healthLow`          | Attack/Aggro → Flee |
| `reachedSafety`      | Flee → Idle         |
| `healthZero`         | Any → Dead          |

Override the default state machine:

```ts
import { createStateMachineConfig } from '@nicholasosto/npc';

const bossStateMachine = createStateMachineConfig({
  initialState: 'Patrol',
  transitions: [
    { from: 'Patrol', to: 'Aggro', condition: 'playerInRange' },
    { from: 'Aggro', to: 'Attack', condition: 'inAttackRange' },
    { from: 'Attack', to: 'Dead', condition: 'healthZero' },
    // Bosses don't flee!
  ],
});
```

## Spawn Zones

Define zones that auto-spawn NPCs with faction, level range, and density:

```ts
import { createSpawnZoneConfig } from '@nicholasosto/npc';

const zones = [
  createSpawnZoneConfig('forest_clearing', 'Spirit', [1, 3]),
  createSpawnZoneConfig('robot_factory', 'Robot', [5, 10], { maxNpcs: 8 }),
  createSpawnZoneConfig('void_rift', 'Void', [15, 20], {
    maxNpcs: 3,
    respawnDelay: 60,
    rigNames: ['Void_Wendigo', 'Void_Master'],
  }),
];
```

## Faction Name Pools

Each faction has themed name pools loaded into `@nicholasosto/name-generator`:

```ts
import { generateNpcName } from '@nicholasosto/npc';

generateNpcName('Robot'); // → "Cog Steelbolt the Iron Fist"
generateNpcName('Void'); // → "Nyx Abyssgaze the Formless"
```

## Defaults

| Constant                      | Value    | Description                 |
| ----------------------------- | -------- | --------------------------- |
| `DEFAULT_NPC_LEVEL`           | 1        | Starting level              |
| `DEFAULT_LEVEL_SCALE`         | 0.08     | Attribute scaling per level |
| `DEFAULT_RESPAWN_DELAY`       | 30s      | Respawn timer               |
| `DEFAULT_MAX_NPCS_PER_ZONE`   | 5        | Zone capacity               |
| `DEFAULT_AGGRO_RANGE`         | 50 studs | Detection radius            |
| `DEFAULT_ATTACK_RANGE`        | 5 studs  | Melee range                 |
| `DEFAULT_FLEE_HEALTH_PERCENT` | 0.2      | Flee at 20% HP              |
| `DEFAULT_PATROL_DURATION`     | 10s      | Patrol cycle                |

## API Reference

### Factories

- `createNpcDefinition(faction, rigName?, level?, options?)` → `NpcDefinition`
- `createNpcStatProfile(definition)` → `StatProfile`
- `createNpcInstance(definition)` → `NpcInstance`
- `createSpawnZoneConfig(zoneName, faction, levelRange, options?)` → `SpawnZoneConfig`

### Utilities

- `getRigNamesForFaction(faction)` → `RigName[]`
- `getRandomRigForFaction(faction)` → `RigName`
- `generateNpcName(faction)` → `string`
- `createStateMachineConfig(overrides?)` → `StateMachineConfig`
- `getTransitionsFrom(config, state)` → `StateTransition[]`

### Constants

- `FACTION_MODIFIERS` — `Record<RigFaction, FactionModifier>`
- `FACTION_NAME_POOLS` — `Record<RigFaction, FactionNamePool>`
- `DEFAULT_STATE_MACHINE` — `StateMachineConfig`
- `NPC_STATES` — `readonly NpcState[]`
