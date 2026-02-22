/**
 * Roblox DataStores Tool
 *
 * Exposes Roblox Open Cloud DataStore API operations as MCP tools.
 * Docs: https://create.roblox.com/docs/cloud/reference/DataStore
 */

import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { NumericId, getDefaultUniverseId } from '../config.js';
import { logger } from '../logger.js';
import {
  ROBLOX_CLOUD_BASE,
  robloxFetch,
  robloxHeaders,
  textContent,
  errorResponse,
  successResponse,
} from '../roblox-helpers.js';

// ─── Helpers ───────────────────────────────────────────────────────────────────

function datastoreUrl(universeId: string, path: string): string {
  return `${ROBLOX_CLOUD_BASE}/datastores/v1/universes/${universeId}${path}`;
}

// ─── Tools ─────────────────────────────────────────────────────────────────────

export function registerDatastoreTools(server: McpServer): void {
  // ── List DataStores ──────────────────────────────────────────────────

  server.tool(
    'datastore_list_stores',
    'List all DataStores in a Roblox universe.',
    {
      universeId: NumericId.optional().describe(`Universe ID (defaults to env ROBLOX_UNIVERSE_ID)`),
      prefix: z.string().optional().describe('Filter stores by name prefix'),
      limit: z.number().min(1).max(100).optional().describe('Max results to return'),
      cursor: z.string().optional().describe('Pagination cursor from a previous response'),
    },
    async ({ universeId, prefix, limit, cursor }) => {
      logger.toolCall('datastore_list_stores', { universeId, prefix, limit });
      const uid = universeId ?? getDefaultUniverseId();
      const params = new URLSearchParams();
      if (prefix) params.set('prefix', prefix);
      if (limit) params.set('limit', String(limit));
      if (cursor) params.set('cursor', cursor);

      const url = datastoreUrl(uid, `/standard-datastores?${params.toString()}`);
      const res = await robloxFetch(url);

      return res.ok ? successResponse(res.body) : errorResponse(res.status, res.body, url);
    },
  );

  // ── List Keys ────────────────────────────────────────────────────────

  server.tool(
    'datastore_list_keys',
    'List keys in a specific DataStore.',
    {
      datastoreName: z.string().describe('Name of the DataStore'),
      universeId: NumericId.optional().describe(`Universe ID (defaults to env ROBLOX_UNIVERSE_ID)`),
      prefix: z.string().optional().describe('Filter keys by prefix'),
      limit: z.number().min(1).max(100).optional().describe('Max results to return'),
      cursor: z.string().optional().describe('Pagination cursor'),
      scope: z.string().optional().describe('DataStore scope (default: "global")'),
    },
    async ({ datastoreName, universeId, prefix, limit, cursor, scope }) => {
      logger.toolCall('datastore_list_keys', { datastoreName, universeId });
      const uid = universeId ?? getDefaultUniverseId();
      const params = new URLSearchParams({ datastoreName });
      if (prefix) params.set('prefix', prefix);
      if (limit) params.set('limit', String(limit));
      if (cursor) params.set('cursor', cursor);
      if (scope) params.set('scope', scope);

      const url = datastoreUrl(uid, `/standard-datastores/datastore/entries?${params.toString()}`);
      const res = await robloxFetch(url);

      return res.ok ? successResponse(res.body) : errorResponse(res.status, res.body, url);
    },
  );

  // ── Get Entry ────────────────────────────────────────────────────────

  server.tool(
    'datastore_get_entry',
    'Get a single entry from a DataStore by key.',
    {
      datastoreName: z.string().describe('Name of the DataStore'),
      entryKey: z.string().describe('The key to retrieve'),
      universeId: NumericId.optional().describe(`Universe ID (defaults to env ROBLOX_UNIVERSE_ID)`),
      scope: z.string().optional().describe('DataStore scope (default: "global")'),
    },
    async ({ datastoreName, entryKey, universeId, scope }) => {
      logger.toolCall('datastore_get_entry', { datastoreName, entryKey });
      const uid = universeId ?? getDefaultUniverseId();
      const params = new URLSearchParams({ datastoreName, entryKey });
      if (scope) params.set('scope', scope);

      const url = datastoreUrl(
        uid,
        `/standard-datastores/datastore/entries/entry?${params.toString()}`,
      );
      const res = await robloxFetch(url);

      return res.ok ? successResponse(res.body) : errorResponse(res.status, res.body, url);
    },
  );

  // ── Set Entry ────────────────────────────────────────────────────────

  server.tool(
    'datastore_set_entry',
    'Set (create or update) an entry in a DataStore.',
    {
      datastoreName: z.string().describe('Name of the DataStore'),
      entryKey: z.string().describe('The key to set'),
      value: z.string().describe('JSON string value to store'),
      universeId: NumericId.optional().describe(`Universe ID (defaults to env ROBLOX_UNIVERSE_ID)`),
      scope: z.string().optional().describe('DataStore scope (default: "global")'),
    },
    async ({ datastoreName, entryKey, value, universeId, scope }) => {
      logger.toolCall('datastore_set_entry', { datastoreName, entryKey });
      const uid = universeId ?? getDefaultUniverseId();
      const params = new URLSearchParams({ datastoreName, entryKey });
      if (scope) params.set('scope', scope);

      const url = datastoreUrl(
        uid,
        `/standard-datastores/datastore/entries/entry?${params.toString()}`,
      );
      const res = await robloxFetch(url, {
        method: 'POST',
        headers: {
          ...robloxHeaders(),
          'Content-Type': 'application/json',
        },
        body: value,
      });

      if (res.ok) {
        return { content: [textContent(`Entry set successfully.\n${res.body}`)] };
      }
      return errorResponse(res.status, res.body, url);
    },
  );
}
