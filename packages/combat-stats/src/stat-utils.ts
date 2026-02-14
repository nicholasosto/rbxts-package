/**
 * @nicholasosto/combat-stats
 *
 * Utility functions for manipulating attributes and stat values.
 */

import { AttributeDefinition, AttributeSet } from './types';
import { AttributeRegistry } from './attribute-registry';

/**
 * Clamp a value to the min/max range of an attribute definition.
 */
export function clampAttribute(value: number, def: AttributeDefinition): number {
  return math.clamp(value, def.min, def.max);
}

/**
 * Modify a single attribute in a set by a delta amount.
 * The result is clamped to the attribute's defined min/max range.
 * Returns a **new** `AttributeSet` (immutable style).
 *
 * ```ts
 * const updated = modifyAttribute(attrs, "strength", 5, registry);
 * ```
 */
export function modifyAttribute(
  attributeSet: AttributeSet,
  id: string,
  delta: number,
  registry: AttributeRegistry,
): AttributeSet {
  const def = registry.getAttributeDefinition(id);
  if (!def) {
    return attributeSet;
  }
  const current = attributeSet.get(id) ?? def.defaultValue;
  const clamped = clampAttribute(current + delta, def);

  const updated = new Map<string, number>();
  attributeSet.forEach((v, k) => updated.set(k, v));
  updated.set(id, clamped);
  return updated;
}

/**
 * Set a single attribute to an exact value (clamped).
 * Returns a **new** `AttributeSet`.
 */
export function setAttribute(
  attributeSet: AttributeSet,
  id: string,
  value: number,
  registry: AttributeRegistry,
): AttributeSet {
  const def = registry.getAttributeDefinition(id);
  if (!def) {
    return attributeSet;
  }
  const clamped = clampAttribute(value, def);

  const updated = new Map<string, number>();
  attributeSet.forEach((v, k) => updated.set(k, v));
  updated.set(id, clamped);
  return updated;
}

/**
 * Simple linear scaling helper.
 * `result = base + scalingFactor * level`
 *
 * Useful for level-based stat growth if needed later.
 */
export function scaleAttribute(base: number, scalingFactor: number, level: number): number {
  return base + scalingFactor * level;
}
