/**
 * @nicholasosto/mcp-server — Type Definitions
 *
 * Re-exports from the new modular helpers for backward compatibility.
 * New code should import directly from config.ts and roblox-helpers.ts.
 */

export { ROBLOX_CLOUD_BASE, robloxHeaders } from './roblox-helpers.js';
export {
  getDefaultUniverseId,
  getDefaultPlaceId,
  getDefaultCreatorId,
  getDefaultUserId,
} from './config.js';
