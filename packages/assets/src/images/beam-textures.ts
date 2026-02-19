import { type ImageAsset, asImageAsset } from '../types';

/** Beam effect textures (two-part for Roblox Beam instances) */
export const BeamTextures = {
  Constrictor1: asImageAsset('rbxassetid://75175588188120'),
  Constrictor2: asImageAsset('rbxassetid://117812481070645'),
  SoulDrain1: asImageAsset('rbxassetid://95584643329398'),
  SoulDrain2: asImageAsset('rbxassetid://98023166137532'),
  IceChain1: asImageAsset('rbxassetid://101823462513180'),
  IceChain2: asImageAsset('rbxassetid://136513380446132'),
} as const satisfies Record<string, ImageAsset>;
