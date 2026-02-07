import { ImageAsset, asImageAsset } from '../types';

/** Common UI control icons (buttons, arrows) */
export const UiControls = {
  Increment: asImageAsset('rbxassetid://102421835119714'),
  Decrement: asImageAsset('rbxassetid://78091115085992'),
  Close: asImageAsset('rbxassetid://91437543746962'),
  TripleArrow: asImageAsset('rbxassetid://136693752293641'),
  Play: asImageAsset('rbxassetid://138751166365431'),
} as const satisfies Record<string, ImageAsset>;
