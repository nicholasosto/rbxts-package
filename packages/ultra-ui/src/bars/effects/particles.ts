/**
 * particles — Manages sparkle / particle effects on resource bars.
 *
 * Creates a ParticleEmitter attached to the fill frame that
 * emits particles on value changes and bursts on special events.
 */

/**
 * Configuration for bar particle effects.
 */
export interface BarParticleConfig {
  /** Color of the particles (matched to fill color). */
  color: Color3;
  /** Number of particles to emit per value-change event. */
  emitCount: number;
  /** Number of particles for a burst event (e.g. level-up). */
  burstCount: number;
}

const DEFAULT_PARTICLE_CONFIG: BarParticleConfig = {
  color: Color3.fromRGB(255, 255, 200),
  emitCount: 3,
  burstCount: 20,
};

/**
 * Creates and attaches a ParticleEmitter to the given Frame's
 * underlying GuiObject. Returns control functions.
 *
 * @param parent  The fill Frame to attach particles to.
 * @param config  Optional particle configuration.
 */
export function createBarParticles(
  parent: Frame,
  config?: Partial<BarParticleConfig>,
): {
  emit: () => void;
  burst: () => void;
  destroy: () => void;
} {
  const cfg: BarParticleConfig = {
    color: config?.color ?? DEFAULT_PARTICLE_CONFIG.color,
    emitCount: config?.emitCount ?? DEFAULT_PARTICLE_CONFIG.emitCount,
    burstCount: config?.burstCount ?? DEFAULT_PARTICLE_CONFIG.burstCount,
  };

  const emitter = new Instance('ParticleEmitter');
  emitter.Name = 'BarParticles';
  emitter.Color = new ColorSequence(cfg.color);
  emitter.Size = new NumberSequence([
    new NumberSequenceKeypoint(0, 4),
    new NumberSequenceKeypoint(1, 0),
  ]);
  emitter.Lifetime = new NumberRange(0.3, 0.6);
  emitter.Speed = new NumberRange(20, 60);
  emitter.SpreadAngle = new Vector2(30, 30);
  emitter.Rate = 0; // manual emission only
  emitter.Transparency = new NumberSequence([
    new NumberSequenceKeypoint(0, 0),
    new NumberSequenceKeypoint(1, 1),
  ]);
  emitter.LightEmission = 0.8;
  emitter.Parent = parent;

  return {
    /** Emit a small puff of particles (on value change). */
    emit: () => {
      emitter.Emit(cfg.emitCount);
    },

    /** Emit a large burst of particles (on level-up or special event). */
    burst: () => {
      emitter.Emit(cfg.burstCount);
    },

    /** Remove the emitter entirely. */
    destroy: () => {
      emitter.Destroy();
    },
  };
}
