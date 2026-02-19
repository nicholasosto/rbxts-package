/**
 * BuffBar — A horizontal row of BuffIndicators for displaying active buffs/debuffs.
 *
 * @example
 * ```tsx
 * <BuffBar buffs={activeBuffs} maxVisible={8} />
 * ```
 */

import React from '@rbxts/react';
import { BuffIndicator } from './BuffIndicator';
import type { BuffData } from './types';

export interface BuffBarProps {
  /** Active buffs to display. */
  buffs: BuffData[];
  /** Icon size per indicator. Default: 36. */
  iconSize?: number;
  /** Gap between indicators. Default: 4. */
  gap?: number;
  /** Max visible indicators. Default: 10. */
  maxVisible?: number;
}

export function BuffBar(props: BuffBarProps): React.Element {
  const { buffs, iconSize = 36, gap = 4, maxVisible = 10 } = props;
  const visible = buffs.size() > maxVisible ? buffs.filter((_, i) => i < maxVisible) : buffs;

  return (
    <frame
      key="BuffBar"
      Size={new UDim2(0, 0, 0, iconSize)}
      AutomaticSize={Enum.AutomaticSize.X}
      BackgroundTransparency={1}
    >
      <uilistlayout
        FillDirection={Enum.FillDirection.Horizontal}
        Padding={new UDim(0, gap)}
        SortOrder={Enum.SortOrder.LayoutOrder}
      />
      {visible.map((buff) => (
        <BuffIndicator key={buff.id} buff={buff} iconSize={iconSize} />
      ))}
    </frame>
  );
}
