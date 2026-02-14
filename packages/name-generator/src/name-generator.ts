/**
 * @nicholasosto/name-generator
 *
 * Core name generator with configurable pools of first names, last names, and monikers.
 */

import { GenerateNameOptions } from './types';
import { DEFAULT_FIRST_NAMES, DEFAULT_LAST_NAMES, DEFAULT_MONIKERS } from './defaults';

/** Pick a random element from an array using Roblox's math.random */
function pickRandom(pool: string[]): string {
  const index = math.random(0, pool.size() - 1);
  return pool[index];
}

/**
 * Name generator namespace.
 *
 * ```ts
 * Names.GenerateName();                          // "Kael Stormwind"
 * Names.GenerateName({ type: "FIRST" });         // "Lyra"
 * Names.GenerateName({ type: "FULL_MONIKER" });  // "Thane Ironforge the Bold"
 *
 * Names.LoadFirst(["Hero", "Villain"]);
 * Names.LoadLast(["Bright", "Dark"]);
 * Names.LoadMonikers(["the Great"]);
 * ```
 */
export namespace Names {
  /** Internal mutable pools */
  let firstNames = [...DEFAULT_FIRST_NAMES];
  let lastNames = [...DEFAULT_LAST_NAMES];
  let monikers = [...DEFAULT_MONIKERS];

  /**
   * Generate a random name.
   * @param options.type - "FIRST" | "FULL" (default) | "FULL_MONIKER"
   */
  export function GenerateName(options?: GenerateNameOptions): string {
    const nameType = options?.type ?? 'FULL';

    if (nameType === 'FIRST') {
      return pickRandom(firstNames);
    }

    const first = pickRandom(firstNames);
    const last = pickRandom(lastNames);

    if (nameType === 'FULL_MONIKER') {
      const moniker = pickRandom(monikers);
      return `${first} ${last} ${moniker}`;
    }

    // "FULL"
    return `${first} ${last}`;
  }

  /** Replace the first-name pool with new values. */
  export function LoadFirst(firstnames: string[]): void {
    firstNames = [...firstnames];
  }

  /** Replace the last-name pool with new values. */
  export function LoadLast(lastnames: string[]): void {
    lastNames = [...lastnames];
  }

  /** Replace the moniker pool with new values. */
  export function LoadMonikers(newMonikers: string[]): void {
    monikers = [...newMonikers];
  }
}
