import { type ImageAsset, asImageAsset } from '../types';

/** Equipment item thumbnail icons */
export const EquipmentIcons = {
  BronzeHelm: asImageAsset('rbxassetid://120886988612649'),
  BronzeSword: asImageAsset('rbxassetid://121475161731571'),
  RedClaw: asImageAsset('rbxassetid://79484036913795'),
  BasicArmor: asImageAsset('rbxassetid://81143206579336'),
  LegendaryPlatron: asImageAsset('rbxassetid://136889833528991'),
  DemonicHalo: asImageAsset('rbxassetid://100823924200826'),
} as const satisfies Record<string, ImageAsset>;
