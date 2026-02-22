/**
 * @nicholasosto/npc
 *
 * Thematic name pools per faction.
 * Load these into @nicholasosto/name-generator before generating NPC names
 * to keep names faction-appropriate.
 */

import { type RigFaction } from '@nicholasosto/assets';

/** Shape of a faction's name pool. */
export interface FactionNamePool {
  readonly first: readonly string[];
  readonly last: readonly string[];
  readonly monikers: readonly string[];
}

/**
 * FACTION_NAME_POOLS
 *
 * Each faction has themed first names, last names, and monikers.
 */
export const FACTION_NAME_POOLS: Record<RigFaction, FactionNamePool> = {
  Blood: {
    first: [
      'Crimson',
      'Riven',
      'Scarlet',
      'Thorn',
      'Vlad',
      'Sanguine',
      'Hemlock',
      'Dagger',
      'Vesper',
      'Fang',
    ],
    last: [
      'Bloodthorn',
      'Redvein',
      'Nightpiercer',
      'Goreclaw',
      'Scarletmoon',
      'Hemogrim',
      'Cruorbane',
      'Bleedstone',
      'Thrallheart',
      'Crimsonpact',
    ],
    monikers: ['the Sanguine', 'the Crimson', 'the Bloodthirsty', 'the Draining', 'the Impaler'],
  },
  Decay: {
    first: [
      'Rot',
      'Graven',
      'Murk',
      'Blight',
      'Hollow',
      'Gouge',
      'Retch',
      'Fester',
      'Mire',
      'Sallow',
    ],
    last: [
      'Bonegnaw',
      'Ashencrypt',
      'Tombmire',
      'Gravepox',
      'Wormhollow',
      'Dirgerot',
      'Plaguedust',
      'Corpseveil',
      'Moldgrasp',
      'Deathbloom',
    ],
    monikers: ['the Rotting', 'the Undying', 'the Blighted', 'the Ravenous', 'the Hollow'],
  },
  Fateless: {
    first: [
      'Kael',
      'Varen',
      'Lyra',
      'Orin',
      'Selene',
      'Darius',
      'Freya',
      'Talon',
      'Mira',
      'Gideon',
    ],
    last: [
      'Stormwind',
      'Ironveil',
      'Dawnbreaker',
      'Ashford',
      'Greymane',
      'Silverblade',
      'Thornwall',
      'Nightforge',
      'Steelhart',
      'Ravencrest',
    ],
    monikers: ['the Unbound', 'the Defiant', 'the Fated', 'the Bold', 'the Unchained'],
  },
  Robot: {
    first: [
      'Cog',
      'Piston',
      'Servo',
      'Bolt',
      'Circuit',
      'Gear',
      'Chrome',
      'Rivet',
      'Spark',
      'Axle',
    ],
    last: [
      'Wrench',
      'Steelbolt',
      'Ironclad',
      'Gearshift',
      'Voltcore',
      'Heatsink',
      'Overlock',
      'Titanframe',
      'Weldfire',
      'Shockarm',
    ],
    monikers: [
      'the Unyielding',
      'the Relentless',
      'the Iron Fist',
      'the Forged',
      'the Overclocked',
    ],
  },
  Spirit: {
    first: [
      'Whisper',
      'Aether',
      'Lumina',
      'Shade',
      'Nimbus',
      'Gale',
      'Solara',
      'Fael',
      'Dusk',
      'Haze',
    ],
    last: [
      'Dreamweave',
      'Stardrift',
      'Moonveil',
      'Mistwalker',
      'Spiritbloom',
      'Fadelight',
      'Cloudthorn',
      'Glimmer',
      'Phantasm',
      'Twilight',
    ],
    monikers: ['the Ethereal', 'the Whispered', 'the Luminous', 'the Fading', 'the Unseen'],
  },
} as const;
