import { ImageAsset, asImageAsset } from '../types';

/** Ability skill icons for UI */
export const AbilityIcons = {
  MeleeSkill: asImageAsset('rbxassetid://114327486101696'),
  Whirlwind: asImageAsset('rbxassetid://118559350384271'),
  Fireball: asImageAsset('rbxassetid://124529752479830'),
  IceRain: asImageAsset('rbxassetid://77085115837905'),
  LightningBolt: asImageAsset('rbxassetid://84562572112570'),
  Earthquake: asImageAsset('rbxassetid://72703784685790'),
  FlameSythe: asImageAsset('rbxassetid://108246514585300'),
  HallowHold: asImageAsset('rbxassetid://79001631229851'),
  BloodSiphon: asImageAsset('rbxassetid://135950973087916'),
  BloodHorror: asImageAsset('rbxassetid://82257212198629'),
  BloodElemental: asImageAsset('rbxassetid://122556254156811'),
  SoulDrain: asImageAsset('rbxassetid://78703065651895'),
} as const satisfies Record<string, ImageAsset>;
