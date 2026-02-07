import { StatusEffects, EnvironmentEffects, HitEffects, CastTrails } from './effects';

/**
 * PARTICLE_CATALOG
 *
 * All particle effect names organized by type.
 * These reference effect template names, not asset IDs.
 * Usage: PARTICLE_CATALOG.Status.Burning
 */
export const PARTICLE_CATALOG = {
  Status: StatusEffects,
  Environment: EnvironmentEffects,
  Hit: HitEffects,
  CastTrail: CastTrails,
} as const;

export type ParticleEffectName = {
  [C in keyof typeof PARTICLE_CATALOG]: (typeof PARTICLE_CATALOG)[C][keyof (typeof PARTICLE_CATALOG)[C]];
}[keyof typeof PARTICLE_CATALOG];
