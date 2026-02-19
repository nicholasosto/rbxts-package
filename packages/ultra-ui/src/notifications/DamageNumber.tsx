/**
 * DamageNumber — A floating combat number rendered via BillboardGui.
 * Fades up and out after a brief duration.
 *
 * @example
 * ```tsx
 * <DamageNumber
 *   value={142}
 *   worldPosition={hitPosition}
 *   isCritical={true}
 * />
 * ```
 */

import React, { useEffect, useState } from '@rbxts/react';
import { useTheme } from '../theme';

export interface DamageNumberProps {
  /** Numeric value to display. */
  value: number;
  /** Part or Model to attach the BillboardGui to. */
  adornee: PVInstance;
  /** Heal (green) vs damage (red). Default: false (damage). */
  isHeal?: boolean;
  /** Critical hit — larger text. Default: false. */
  isCritical?: boolean;
  /** Lifetime in seconds. Default: 1.2. */
  lifetime?: number;
  /** Called when the number should be removed. */
  onComplete?: () => void;
}

export function DamageNumber(props: DamageNumberProps): React.Element | undefined {
  const { value, adornee, isHeal = false, isCritical = false, lifetime = 1.2, onComplete } = props;

  const theme = useTheme();
  const [visible, setVisible] = useState(true);

  const textColor = isHeal ? theme.notification.successColor : theme.notification.errorColor;
  const textSize = isCritical ? 28 : 20;
  const prefix = isHeal ? '+' : '-';
  const displayText = isCritical ? `${prefix}${value}!` : `${prefix}${value}`;

  useEffect(() => {
    const t = task.delay(lifetime, () => {
      setVisible(false);
      if (onComplete !== undefined) onComplete();
    });
    return () => task.cancel(t);
  }, []);

  if (!visible) return undefined;

  return (
    <billboardgui
      key="DamageNumber"
      Size={new UDim2(0, 120, 0, 40)}
      StudsOffset={new Vector3(0, 2, 0)}
      AlwaysOnTop={true}
      MaxDistance={60}
      ResetOnSpawn={false}
      LightInfluence={0}
      Adornee={adornee}
    >
      <textlabel
        key="Number"
        Size={UDim2.fromScale(1, 1)}
        BackgroundTransparency={1}
        Text={displayText}
        TextColor3={textColor}
        TextSize={textSize}
        Font={Enum.Font.GothamBold}
        TextStrokeTransparency={0.4}
        TextStrokeColor3={Color3.fromRGB(0, 0, 0)}
      />
    </billboardgui>
  );
}
