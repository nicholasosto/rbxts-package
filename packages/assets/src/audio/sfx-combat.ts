import { type AudioAsset, asAudioAsset } from '../types';

/** Combat-related sound effects */
export const SfxCombat = {
  HitLight: asAudioAsset('rbxassetid://86267666947038'),
  HitHeavy: asAudioAsset('rbxassetid://75822150781541'),
  AbilityCast: asAudioAsset('rbxassetid://87346703835485'),
  AbilityValidationFail: asAudioAsset('rbxassetid://131912667805687'),
  PowerCharge: asAudioAsset('rbxassetid://87346703835485'),
  StompHeavy: asAudioAsset('rbxassetid://97240293345639'),
  CastSuccess: asAudioAsset('rbxassetid://6874710483'),
  CastFail: asAudioAsset('rbxassetid://2390695935'),
  CombatHurt: asAudioAsset('rbxassetid://124168040156203'),
} as const satisfies Record<string, AudioAsset>;
