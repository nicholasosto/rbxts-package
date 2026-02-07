import { ImageAsset, asImageAsset } from '../types';

/** Soul gem collectible icons */
export const SoulGemIcons = {
  PenitentKnightSoul: asImageAsset('rbxassetid://76174031397497'),
  MoonlitSanctuaryGem: asImageAsset('rbxassetid://72332862236934'),
  FledglingSoulShard: asImageAsset('rbxassetid://94792536824771'),
  TravelersComfort: asImageAsset('rbxassetid://72225362452862'),
  PrimordialSoulNexus: asImageAsset('rbxassetid://116316685367117'),
  ScholarsInsight: asImageAsset('rbxassetid://0'), // TODO: Replace placeholder
  ForgottenSoulsWhisper: asImageAsset('rbxassetid://0'), // TODO: Replace placeholder
} as const satisfies Record<string, ImageAsset>;
