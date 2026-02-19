import { type AudioAsset, asAudioAsset } from '../types';

/** Background music tracks */
export const Music = {
  EpicMain: asAudioAsset('rbxassetid://88797678675646'),
  CampFire: asAudioAsset('rbxassetid://88801445687612'),
  LightRain: asAudioAsset('rbxassetid://123071170017486'),
  TribalCamp: asAudioAsset('rbxassetid://134608032579135'),
} as const satisfies Record<string, AudioAsset>;
