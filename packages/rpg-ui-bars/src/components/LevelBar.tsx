/**
 * LevelBar — XP / progress bar with level display and level-up effects.
 *
 * Shows current XP progress toward the next level with a gold-themed
 * fill, smooth tweened transitions, and a particle burst on level-up.
 *
 * @example
 * ```tsx
 * <LevelBar currentXP={350} requiredXP={1000} level={12} />
 * <LevelBar currentXP={xp} requiredXP={nextLevelXP} level={lvl} onLevelUp={() => print("LEVEL UP!")} />
 * ```
 */

import React from '@rbxts/react';
import { LevelBarProps, ResourceBarTheme, BarEffectConfig } from '../types';
import { LEVEL_THEME, mergeTheme, mergeEffects } from '../presets';
import { tweenFill } from '../effects/tween-fill';
import { triggerGhostBar } from '../effects/ghost-bar';
import { createBarParticles } from '../effects/particles';

// ─── Defaults ──────────────────────────────────────────────────────────────

const DEFAULT_SIZE = UDim2.fromScale(0.25, 0.025);
const CORNER_RADIUS = new UDim(0.5, 0);

// ─── Component ─────────────────────────────────────────────────────────────

export function LevelBar(props: LevelBarProps): React.Element {
  const {
    currentXP,
    requiredXP,
    level,
    showLevelText = true,
    size = DEFAULT_SIZE,
    onLevelUp,
  } = props;

  const theme: ResourceBarTheme = mergeTheme(LEVEL_THEME, props.theme);
  const fx: BarEffectConfig = mergeEffects(props.effects);

  const fraction = math.clamp(requiredXP > 0 ? currentXP / requiredXP : 0, 0, 1);

  // ── Refs ───────────────────────────────────────────────────────────
  const fillRef = React.useRef<Frame>(undefined);
  const ghostRef = React.useRef<Frame>(undefined);

  const prevFractionRef = React.useRef(fraction);
  const prevLevelRef = React.useRef(level);
  const cleanupRef = React.useRef<{
    ghost?: () => void;
    particles?: { emit: () => void; burst: () => void; destroy: () => void };
  }>({});

  // ── Particles ──────────────────────────────────────────────────────
  React.useEffect(() => {
    const fill = fillRef.current;
    if (!fill || !fx.particlesEnabled) return;

    const particles = createBarParticles(fill, {
      color: theme.fillColor,
      burstCount: 30,
    });
    cleanupRef.current.particles = particles;

    return () => {
      particles.destroy();
      cleanupRef.current.particles = undefined;
    };
  }, [fx.particlesEnabled]);

  // ── Level-up detection ─────────────────────────────────────────────
  React.useEffect(() => {
    if (level > prevLevelRef.current) {
      // Burst particles on level-up
      cleanupRef.current.particles?.burst();
      onLevelUp?.();
    }
    prevLevelRef.current = level;
  }, [level]);

  // ── Fraction change effects ────────────────────────────────────────
  React.useEffect(() => {
    const fill = fillRef.current;
    const ghost = ghostRef.current;
    if (!fill || !ghost) return;

    const prevFraction = prevFractionRef.current;
    const decreased = fraction < prevFraction;
    const changed = fraction !== prevFraction;

    // Tween fill
    const fillTween = tweenFill(fill, fraction, fx.tweenDuration);

    // Ghost on decrease (e.g. XP loss / level reset)
    if (decreased) {
      cleanupRef.current.ghost?.();
      cleanupRef.current.ghost = triggerGhostBar(
        ghost,
        prevFraction,
        fraction,
        fx.ghostDelay,
        fx.ghostFadeDuration,
      );
    }

    // Particles on change
    if (changed && fx.particlesEnabled) {
      cleanupRef.current.particles?.emit();
    }

    prevFractionRef.current = fraction;

    return () => {
      fillTween.Cancel();
    };
  }, [fraction]);

  // ── Label ──────────────────────────────────────────────────────────
  const labelText = showLevelText
    ? `Lv ${level}  —  ${math.floor(currentXP)} / ${math.floor(requiredXP)}`
    : `${math.floor(currentXP)} / ${math.floor(requiredXP)}`;

  // ── Render ─────────────────────────────────────────────────────────
  return (
    <frame key="LevelBar" Size={size} BackgroundColor3={theme.backgroundColor} BorderSizePixel={0}>
      <uicorner CornerRadius={CORNER_RADIUS} />

      {/* Ghost fill */}
      <frame
        key="Ghost"
        ref={ghostRef}
        Size={new UDim2(fraction, 0, 1, 0)}
        BackgroundColor3={theme.ghostColor}
        BackgroundTransparency={0.6}
        BorderSizePixel={0}
        ZIndex={1}
      >
        <uicorner CornerRadius={CORNER_RADIUS} />
      </frame>

      {/* Main fill */}
      <frame
        key="Fill"
        ref={fillRef}
        Size={new UDim2(fraction, 0, 1, 0)}
        BackgroundColor3={theme.fillColor}
        BorderSizePixel={0}
        ZIndex={2}
      >
        <uicorner CornerRadius={CORNER_RADIUS} />
      </frame>

      {/* Label */}
      <textlabel
        key="Label"
        Size={UDim2.fromScale(1, 1)}
        BackgroundTransparency={1}
        Text={labelText}
        TextColor3={theme.textColor}
        TextScaled={true}
        Font={Enum.Font.GothamBold}
        ZIndex={3}
      />
    </frame>
  );
}
