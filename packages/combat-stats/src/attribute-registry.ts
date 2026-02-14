/**
 * @nicholasosto/combat-stats
 *
 * Configurable registry for base attributes and derived stats.
 * Consumers register their own attribute definitions and derivation formulas,
 * then use the registry to create attribute sets and compute derived stats.
 */

import {
  AttributeDefinition,
  AttributeSet,
  DerivedStatDefinition,
  DerivedStatSet,
  StatProfile,
} from './types';

/**
 * Central registry that holds attribute and derived-stat definitions.
 *
 * ```ts
 * const registry = new AttributeRegistry();
 * registry.registerAttribute({ id: "str", displayName: "Strength", min: 1, max: 100, defaultValue: 10 });
 * registry.registerDerivedStat({
 *   id: "physDmg",
 *   displayName: "Physical Damage",
 *   calculate: (attrs) => (attrs.get("str") ?? 0) * 2.5,
 * });
 *
 * const attrs = registry.createDefaultAttributeSet();
 * const derived = registry.computeDerivedStats(attrs);
 * ```
 */
export class AttributeRegistry {
  private attributes: AttributeDefinition[] = [];
  private derivedStats: DerivedStatDefinition[] = [];

  // ── Attribute registration ───────────────────────────────────────────────

  /** Register a new base attribute definition. */
  registerAttribute(def: AttributeDefinition): void {
    // Replace existing definition with the same id
    this.attributes = this.attributes.filter((a) => a.id !== def.id);
    this.attributes.push(def);
  }

  /** Register multiple attribute definitions at once. */
  registerAttributes(defs: AttributeDefinition[]): void {
    for (const def of defs) {
      this.registerAttribute(def);
    }
  }

  /** Get a registered attribute definition by id. */
  getAttributeDefinition(id: string): AttributeDefinition | undefined {
    return this.attributes.find((a) => a.id === id);
  }

  /** Get all registered attribute definitions. */
  getAttributeDefinitions(): ReadonlyArray<AttributeDefinition> {
    return this.attributes;
  }

  // ── Derived stat registration ────────────────────────────────────────────

  /** Register a new derived stat definition. */
  registerDerivedStat(def: DerivedStatDefinition): void {
    this.derivedStats = this.derivedStats.filter((d) => d.id !== def.id);
    this.derivedStats.push(def);
  }

  /** Register multiple derived stat definitions at once. */
  registerDerivedStats(defs: DerivedStatDefinition[]): void {
    for (const def of defs) {
      this.registerDerivedStat(def);
    }
  }

  /** Get a registered derived stat definition by id. */
  getDerivedStatDefinition(id: string): DerivedStatDefinition | undefined {
    return this.derivedStats.find((d) => d.id === id);
  }

  /** Get all registered derived stat definitions. */
  getDerivedStatDefinitions(): ReadonlyArray<DerivedStatDefinition> {
    return this.derivedStats;
  }

  // ── Factories ────────────────────────────────────────────────────────────

  /**
   * Create a new `AttributeSet` populated with each registered attribute's
   * `defaultValue`.
   */
  createDefaultAttributeSet(): AttributeSet {
    const attrs: AttributeSet = new Map<string, number>();
    for (const def of this.attributes) {
      attrs.set(def.id, def.defaultValue);
    }
    return attrs;
  }

  /**
   * Run every registered derived-stat formula against the provided attributes
   * and return the results.
   */
  computeDerivedStats(attributes: AttributeSet): DerivedStatSet {
    const derived: DerivedStatSet = new Map<string, number>();
    for (const def of this.derivedStats) {
      derived.set(def.id, def.calculate(attributes));
    }
    return derived;
  }

  /**
   * Build a complete `StatProfile` from base attributes.
   * Creates default attributes if none are provided.
   */
  createStatProfile(attributes?: AttributeSet, level?: number): StatProfile {
    const baseAttributes = attributes ?? this.createDefaultAttributeSet();
    const derivedStats = this.computeDerivedStats(baseAttributes);
    return { baseAttributes, derivedStats, level };
  }
}
