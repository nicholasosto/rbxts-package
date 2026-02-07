/**
 * Math utility functions for roblox-ts game development.
 */
export namespace MathUtils {
  /** Clamp a value between min and max */
  export function clamp(value: number, min: number, max: number): number {
    return math.max(min, math.min(max, value));
  }

  /** Linear interpolation between a and b */
  export function lerp(a: number, b: number, t: number): number {
    return a + (b - a) * clamp(t, 0, 1);
  }

  /** Map a value from one range to another */
  export function remap(
    value: number,
    inMin: number,
    inMax: number,
    outMin: number,
    outMax: number,
  ): number {
    const t = (value - inMin) / (inMax - inMin);
    return lerp(outMin, outMax, t);
  }

  /** Round to a specific number of decimal places */
  export function roundTo(value: number, decimals: number): number {
    const factor = 10 ** decimals;
    return math.round(value * factor) / factor;
  }

  /** Random integer between min and max (inclusive) */
  export function randomInt(min: number, max: number): number {
    return math.random(min, max);
  }

  /** Random float between min and max */
  export function randomFloat(min: number, max: number): number {
    return min + math.random() * (max - min);
  }

  /** Check if a number is approximately equal within epsilon */
  export function approxEqual(a: number, b: number, epsilon = 0.001): boolean {
    return math.abs(a - b) <= epsilon;
  }
}
