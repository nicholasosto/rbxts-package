/**
 * ProgressFill — A generic animated fill bar primitive.
 *
 * Extracted from ResourceBar internals. Supports horizontal fill
 * with tweening, ghost trail, and glow overlay. Used by ResourceBar,
 * CountdownBar, and Nameplate health bars.
 *
 * @example
 * ```tsx
 * <ProgressFill fraction={0.75} fillColor={Color3.fromRGB(0, 200, 80)} />
 * ```
 */

import React from '@rbxts/react';
import { TweenService } from '@rbxts/services';

export interface ProgressFillProps {
  /** Fill fraction 0–1. */
  fraction: number;
  /** Fill color. */
  fillColor: Color3;
  /** Background color. */
  backgroundColor?: Color3;
  /** Ghost trail color. */
  ghostColor?: Color3;
  /** Whether to show the ghost trail. Default: true. */
  showGhost?: boolean;
  /** Tween duration in seconds. Default: 0.3. */
  tweenDuration?: number;
  /** Ghost hold delay in seconds. Default: 0.4. */
  ghostDelay?: number;
  /** Ghost fade duration in seconds. Default: 0.8. */
  ghostFadeDuration?: number;
  /** Corner radius. */
  cornerRadius?: UDim;
  /** Size override (defaults to full parent). */
  size?: UDim2;
  /** ZIndex. */
  zIndex?: number;
}

export function ProgressFill(props: ProgressFillProps): React.Element {
  const {
    fraction: rawFraction,
    fillColor,
    backgroundColor = Color3.fromRGB(30, 30, 30),
    ghostColor = Color3.fromRGB(255, 100, 100),
    showGhost = true,
    tweenDuration = 0.3,
    ghostDelay = 0.4,
    ghostFadeDuration = 0.8,
    cornerRadius = new UDim(0.5, 0),
    size = UDim2.fromScale(1, 1),
    zIndex,
  } = props;

  const fraction = math.clamp(rawFraction, 0, 1);

  const fillRef = React.useRef<Frame>(undefined);
  const ghostRef = React.useRef<Frame>(undefined);
  const prevFractionRef = React.useRef(fraction);
  const cleanupRef = React.useRef<{ ghost?: () => void }>({});

  React.useEffect(() => {
    const fill = fillRef.current;
    const ghost = ghostRef.current;
    if (!fill) return;

    const prevFraction = prevFractionRef.current;
    const decreased = fraction < prevFraction;

    // Tween fill
    const tweenInfo = new TweenInfo(tweenDuration, Enum.EasingStyle.Quad, Enum.EasingDirection.Out);
    const tween = TweenService.Create(fill, tweenInfo, {
      Size: new UDim2(fraction, 0, 1, 0),
    });
    tween.Play();

    // Ghost on decrease
    if (decreased && showGhost && ghost) {
      cleanupRef.current.ghost?.();

      ghost.Size = new UDim2(prevFraction, 0, 1, 0);
      ghost.BackgroundTransparency = 0;

      let cancelled = false;
      let fadeTween: Tween | undefined;

      const delayThread = task.delay(ghostDelay, () => {
        if (cancelled) return;
        const fadeInfo = new TweenInfo(
          ghostFadeDuration,
          Enum.EasingStyle.Quad,
          Enum.EasingDirection.Out,
        );
        fadeTween = TweenService.Create(ghost, fadeInfo, {
          Size: new UDim2(fraction, 0, 1, 0),
          BackgroundTransparency: 0.6,
        });
        fadeTween.Play();
      });

      cleanupRef.current.ghost = () => {
        cancelled = true;
        task.cancel(delayThread);
        fadeTween?.Cancel();
      };
    }

    prevFractionRef.current = fraction;

    return () => {
      tween.Cancel();
    };
  }, [fraction]);

  return (
    <frame
      key="ProgressFill"
      Size={size}
      BackgroundColor3={backgroundColor}
      BorderSizePixel={0}
      ZIndex={zIndex}
    >
      <uicorner CornerRadius={cornerRadius} />

      {showGhost && (
        <frame
          key="Ghost"
          ref={ghostRef}
          Size={new UDim2(fraction, 0, 1, 0)}
          BackgroundColor3={ghostColor}
          BackgroundTransparency={0.6}
          BorderSizePixel={0}
          ZIndex={1}
        >
          <uicorner CornerRadius={cornerRadius} />
        </frame>
      )}

      <frame
        key="Fill"
        ref={fillRef}
        Size={new UDim2(fraction, 0, 1, 0)}
        BackgroundColor3={fillColor}
        BorderSizePixel={0}
        ZIndex={2}
      >
        <uicorner CornerRadius={cornerRadius} />
      </frame>
    </frame>
  );
}
