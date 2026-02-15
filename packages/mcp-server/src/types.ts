/**
 * @nicholasosto/mcp-server — Type Definitions
 *
 * Shared constants and type helpers for the MCP server tools.
 */

// ─── Roblox Open Cloud ─────────────────────────────────────────────────────────

/** Base URL for Roblox Open Cloud APIs. */
export const ROBLOX_CLOUD_BASE = 'https://apis.roblox.com';

/** Roblox Universe ID — set this to your game's universe ID. */
export const DEFAULT_UNIVERSE_ID = '9730686096';

/** Roblox Place ID — set this to your game's place ID. */
export const DEFAULT_PLACE_ID = '87666753607582';

// ─── Helpers ───────────────────────────────────────────────────────────────────

/** Standard JSON headers for Roblox Cloud API calls. */
export function robloxHeaders(apiKey: string): Record<string, string> {
  return {
    'x-api-key': apiKey,
    'Content-Type': 'application/json',
  };
}
