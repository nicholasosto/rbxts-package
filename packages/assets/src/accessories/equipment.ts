/** Equipment slot types */
export type AccessorySlot = 'Weapon' | 'Body' | 'Head';

export interface AccessoryEntry {
  readonly modelName: string;
  readonly slot: AccessorySlot;
}

/** Equipment accessories referenced by in-game model name */
export const Weapons = {
  SleptSword: { modelName: 'SleptSword', slot: 'Weapon' },
  DecaySword: { modelName: 'Decay Epic Blade', slot: 'Weapon' },
  RedClaw: { modelName: 'RedClaw', slot: 'Weapon' },
} as const satisfies Record<string, AccessoryEntry>;

export const BodyArmor = {
  BasicArmor: { modelName: 'BasicArmor', slot: 'Body' },
  LegendaryPlatron: { modelName: 'Plate_Legendary_RB', slot: 'Body' },
} as const satisfies Record<string, AccessoryEntry>;

export const HeadAccessories = {
  DemonicHalo: { modelName: 'Demon Lord Halo', slot: 'Head' },
} as const satisfies Record<string, AccessoryEntry>;
