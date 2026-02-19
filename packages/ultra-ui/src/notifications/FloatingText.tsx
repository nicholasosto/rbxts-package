/**
 * FloatingText — World-space text popup via BillboardGui.
 * Useful for "+5 XP", "Level Up!", quest announcements, etc.
 */

import React, { useEffect, useState } from '@rbxts/react';
import { useTheme } from '../theme';

export interface FloatingTextProps {
  /** Text to display. */
  text: string;
  /** Part or Model to attach the BillboardGui to. */
  adornee: PVInstance;
  /** Text color override. */
  color?: Color3;
  /** Text size. Default: 18. */
  textSize?: number;
  /** Duration in seconds. Default: 2. */
  duration?: number;
  /** Called when display expires. */
  onComplete?: () => void;
}

export function FloatingText(props: FloatingTextProps): React.Element | undefined {
  const { text, adornee, color, textSize = 18, duration = 2, onComplete } = props;

  const theme = useTheme();
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const t = task.delay(duration, () => {
      setVisible(false);
      if (onComplete !== undefined) onComplete();
    });
    return () => task.cancel(t);
  }, []);

  if (!visible) return undefined;

  return (
    <billboardgui
      key="FloatingText"
      Size={new UDim2(0, 200, 0, 40)}
      StudsOffset={new Vector3(0, 3, 0)}
      AlwaysOnTop={true}
      MaxDistance={50}
      ResetOnSpawn={false}
      LightInfluence={0}
      Adornee={adornee}
    >
      <textlabel
        key="Text"
        Size={UDim2.fromScale(1, 1)}
        BackgroundTransparency={1}
        Text={text}
        TextColor3={color ?? theme.textColor}
        TextSize={textSize}
        Font={Enum.Font.GothamBold}
        TextStrokeTransparency={0.5}
        TextStrokeColor3={Color3.fromRGB(0, 0, 0)}
      />
    </billboardgui>
  );
}
