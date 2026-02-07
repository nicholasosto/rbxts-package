import { AudioAsset, asAudioAsset } from '../types';

/** Boss voice lines — Penitent Knight */
export const VoicePenitentKnight = {
  Greeting: asAudioAsset('rbxassetid://92246731941536'),
  Phase2: asAudioAsset('rbxassetid://85615892150460'),
  Phase3: asAudioAsset('rbxassetid://102166397498866'),
  Taunt1: asAudioAsset('rbxassetid://108148884421041'),
  Taunt2: asAudioAsset('rbxassetid://91716758677776'),
  DamageReaction: asAudioAsset('rbxassetid://85320371161082'),
} as const satisfies Record<string, AudioAsset>;
