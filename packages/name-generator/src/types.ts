/**
 * @nicholasosto/name-generator
 *
 * Types for the name generator API.
 */

/** The type of name to generate */
export type NameType = 'FIRST' | 'FULL' | 'FULL_MONIKER';

/** Options for name generation */
export interface GenerateNameOptions {
  /** The format of the generated name. Defaults to "FULL". */
  type?: NameType;
}
