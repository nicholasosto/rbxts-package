/**
 * ResourceBar — Core RPG resource bar component with full effects.
 *
 * Renders a themed, animated resource bar with:
 * - Smooth tweened fill
 * - Trailing ghost bar on decrease
 * - Pulse/glow at low resource threshold
 * - Damage flash + shake on decrease
 * - Particle sparkles on change
 *
 * @example
 * ```tsx
 * <ResourceBar current={hp} max={maxHp} style={ResourceBarStyle.Health} />
 * <ResourceBar current={mp} max={maxMp} style={ResourceBarStyle.Mana} showText={false} />
 * <ResourceBar current={50} max={100} theme={{ fillColor: Color3.fromRGB(255,0,255) }} />
 * ```
 */

import React from '@rbxts/react';
import { ResourceBarProps, ResourceBarStyle, ResourceBarTheme, BarEffectConfig } from '../types';
import { getThemeForStyle, mergeTheme, mergeEffects } from '../presets';
import { tweenFill } from '../effects/tween-fill';
import { triggerGhostBar } from '../effects/ghost-bar';
import { startPulseGlow } from '../effects/pulse-glow';
import { triggerDamageFlash } from '../effects/damage-flash';
import { createBarParticles } from '../effects/particles';

// ─── Defaults ──────────────────────────────────────────────────────────────

const DEFAULT_SIZE = UDim2.fromScale(0.3, 0.04);
const CORNER_RADIUS = new UDim(0.5, 0);

// ─── Component ─────────────────────────────────────────────────────────────

export function ResourceBar(props: ResourceBarProps): React.Element {
  const {
    current,
    max,
    style = ResourceBarStyle.Health,
    showText = true,
    label,
    size = DEFAULT_SIZE,
  } = props;

  // Resolve theme and effects
  const theme: ResourceBarTheme = mergeTheme(getThemeForStyle(style), props.theme);
  const fx: BarEffectConfig = mergeEffects(props.effects);

  const fraction = math.clamp(max > 0 ? current / max : 0, 0, 1);
  const isLow = fraction < theme.lowThreshold && fraction > 0;
  const activeFillColor = isLow ? theme.lowFillColor : theme.fillColor;

  // ── Refs for imperative effects ────────────────────────────────────
  const containerRef = React.useRef<Frame>(undefined);
  const fillRef = React.useRef<Frame>(undefined);
  const ghostRef = React.useRef<Frame>(undefined);
  const glowRef = React.useRef<Frame>(undefined);
  const flashRef = React.useRef<Frame>(undefined);

  const prevFractionRef = React.useRef(fraction);
  const cleanupRef = React.useRef<{
    ghost?: () => void;
    pulse?: () => void;
    flash?: () => void;
    particles?: { emit: () => void; burst: () => void; destroy: () => void };
  }>({});

  // ── Initialize particles on mount ──────────────────────────────────
  React.useEffect(() => {
    const fill = fillRef.current;
    if (!fill) return;

    if (fx.particlesEnabled) {
      const particles = createBarParticles(fill, { color: theme.fillColor });
      cleanupRef.current.particles = particles;
      return () => {
        particles.destroy();
        cleanupRef.current.particles = undefined;
      };
    }
    return undefined;
  }, [fx.particlesEnabled]);

  // ── React to fraction changes → drive effects ──────────────────────
  React.useEffect(() => {
    const fill = fillRef.current;
    const ghost = ghostRef.current;
    const container = containerRef.current;
    const flash = flashRef.current;
    if (!fill || !ghost || !container || !flash) return;

    const prevFraction = prevFractionRef.current;
    const decreased = fraction < prevFraction;
    const changed = fraction !== prevFraction;

    // 1. Tween fill to new fraction
    const fillTween = tweenFill(fill, fraction, fx.tweenDuration);

    // 2. Ghost bar on decrease
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

    // 3. Damage flash on decrease
    if (decreased) {
      cleanupRef.current.flash?.();
      cleanupRef.current.flash = triggerDamageFlash(container, flash, fx.shakeIntensity);
    }

    // 4. Particles on any change
    if (changed && fx.particlesEnabled) {
      cleanupRef.current.particles?.emit();
    }

    prevFractionRef.current = fraction;

    return () => {
      fillTween.Cancel();
    };
  }, [fraction]);

  // ── Pulse glow when low ────────────────────────────────────────────
  React.useEffect(() => {
    const glow = glowRef.current;
    if (!glow) return;

    if (isLow) {
      const stopPulse = startPulseGlow(glow, fx.pulseSpeed);
      cleanupRef.current.pulse = stopPulse;
      return () => {
        stopPulse();
        cleanupRef.current.pulse = undefined;
      };
    } else {
      cleanupRef.current.pulse?.();
      cleanupRef.current.pulse = undefined;
      glow.BackgroundTransparency = 1;
    }
    return undefined;
  }, [isLow, fx.pulseSpeed]);

  // ── Build label text ───────────────────────────────────────────────
  const labelText = (() => {
    if (!showText) return '';
    const prefix = label !== undefined ? `${label}: ` : '';
    return `${prefix}${math.floor(current)} / ${math.floor(max)}`;
  })();

  // ── Render ─────────────────────────────────────────────────────────
  return (
    <frame
      key="ResourceBar"
      ref={containerRef}
      Size={size}
      BackgroundColor3={theme.backgroundColor}
      BorderSizePixel={0}
    >
      <uicorner CornerRadius={CORNER_RADIUS} />

      {/* Ghost fill — sits behind the main fill */}
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
        BackgroundColor3={activeFillColor}
        BorderSizePixel={0}
        ZIndex={2}
      >
        <uicorner CornerRadius={CORNER_RADIUS} />
      </frame>

      {/* Glow overlay — pulsing when low */}
      <frame
        key="Glow"
        ref={glowRef}
        Size={UDim2.fromScale(1, 1)}
        BackgroundColor3={theme.glowColor}
        BackgroundTransparency={1}
        BorderSizePixel={0}
        ZIndex={3}
      >
        <uicorner CornerRadius={CORNER_RADIUS} />
      </frame>

      {/* Damage flash overlay */}
      <frame
        key="Flash"
        ref={flashRef}
        Size={UDim2.fromScale(1, 1)}
        BackgroundColor3={Color3.fromRGB(255, 0, 0)}
        BackgroundTransparency={1}
        BorderSizePixel={0}
        ZIndex={4}
      >
        <uicorner CornerRadius={CORNER_RADIUS} />
      </frame>

      {/* Text label */}
      {showText && (
        <textlabel
          key="Label"
          Size={UDim2.fromScale(1, 1)}
          BackgroundTransparency={1}
          Text={labelText}
          TextColor3={theme.textColor}
          TextScaled={true}
          Font={Enum.Font.GothamBold}
          ZIndex={5}
        />
      )}
    </frame>
  );
}
