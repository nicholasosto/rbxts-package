import { type ImageAsset, asImageAsset } from '../types';

/** In-game currency icons */
export const CurrencyIcons = {
  Coins: asImageAsset('rbxassetid://88854732557277'),
  Shards: asImageAsset('rbxassetid://104322457235181'),
  Tombs: asImageAsset('rbxassetid://137584232945521'),
} as const satisfies Record<string, ImageAsset>;
