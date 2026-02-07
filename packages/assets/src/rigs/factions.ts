/** Rig model names organized by faction — referenced by name in ReplicatedStorage */

export const RobotFaction = {
  EvilHal: 'Evil_Hal',
  MonkeyMecha: 'Monkey_Mecha',
  Steambot: 'Steambot',
  Worker: 'Worker',
  FreddyFaz: 'Freddy_Faz',
} as const;

export const SpiritFaction = {
  Ghost: 'Ghost',
  Wisp: 'Wisp',
  Specter: 'Specter',
  Elemental: 'Spirit_Elemental',
  DragonBoy: 'Spirit_Dragon_Boy',
} as const;

export const DecayFaction = {
  Zombie: 'Zombie',
  ZombieHipster: 'Zombie_Hipster',
} as const;

export const VoidFaction = {
  Shadow: 'Shadow',
  Darkling: 'Darkling',
  Wendigo: 'Void_Wendigo',
  VoidMaster: 'Void_Master',
} as const;

export const BloodFaction = {
  Vampire: 'Vampire',
  BloodMist: 'Blood_Mist',
  BloodToad: 'Blood_Toad',
} as const;
