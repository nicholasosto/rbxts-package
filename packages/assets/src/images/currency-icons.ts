import { ImageAsset, asImageAsset } from '../types';

/** In-game currency icons */
// TODO: Replace — currently reusing attribute icon IDs
export const CurrencyIcons = {
  Coins: asImageAsset('rbxassetid://127745571044516'),
  Shards: asImageAsset('rbxassetid://73893872719367'),
  Tombs: asImageAsset('rbxassetid://121291227474039'),
} as const satisfies Record<string, ImageAsset>;
