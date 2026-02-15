/**
 * Roblox DataStores Tool
 *
 * Exposes Roblox Open Cloud DataStore API operations as MCP tools.
 * Docs: https://create.roblox.com/docs/cloud/reference/DataStore
 */

import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { getRobloxCloudConfig } from '@nicholasosto/node-tools';
import { ROBLOX_CLOUD_BASE, DEFAULT_UNIVERSE_ID, robloxHeaders } from '../types.js';

// ─── Helpers ───────────────────────────────────────────────────────────────────

function datastoreUrl(universeId: string, path: string): string {
  return `${ROBLOX_CLOUD_BASE}/datastores/v1/universes/${universeId}${path}`;
}

// ─── Tools ─────────────────────────────────────────────────────────────────────

export function registerDatastoreTools(server: McpServer): void {
  const { apiKey } = getRobloxCloudConfig();

  // ── List DataStores ──────────────────────────────────────────────────

  server.tool(
    'datastore_list_stores',
    'List all DataStores in a Roblox universe.',
    {
      universeId: z
        .string()
        .optional()
        .describe(`Universe ID (defaults to ${DEFAULT_UNIVERSE_ID})`),
      prefix: z.string().optional().describe('Filter stores by name prefix'),
      limit: z.number().min(1).max(100).optional().describe('Max results to return'),
      cursor: z.string().optional().describe('Pagination cursor from a previous response'),
    },
    async ({ universeId, prefix, limit, cursor }) => {
      const uid = universeId ?? DEFAULT_UNIVERSE_ID;
      const params = new URLSearchParams();
      if (prefix) params.set('prefix', prefix);
      if (limit) params.set('limit', String(limit));
      if (cursor) params.set('cursor', cursor);

      const url = datastoreUrl(uid, `/standard-datastores?${params.toString()}`);
      const res = await fetch(url, { headers: robloxHeaders(apiKey) });
      const body = await res.text();

      return {
        content: [{ type: 'text' as const, text: res.ok ? body : `Error ${res.status}: ${body}` }],
      };
    },
  );

  // ── List Keys ────────────────────────────────────────────────────────

  server.tool(
    'datastore_list_keys',
    'List keys in a specific DataStore.',
    {
      datastoreName: z.string().describe('Name of the DataStore'),
      universeId: z
        .string()
        .optional()
        .describe(`Universe ID (defaults to ${DEFAULT_UNIVERSE_ID})`),
      prefix: z.string().optional().describe('Filter keys by prefix'),
      limit: z.number().min(1).max(100).optional().describe('Max results to return'),
      cursor: z.string().optional().describe('Pagination cursor'),
      scope: z.string().optional().describe('DataStore scope (default: "global")'),
    },
    async ({ datastoreName, universeId, prefix, limit, cursor, scope }) => {
      const uid = universeId ?? DEFAULT_UNIVERSE_ID;
      const params = new URLSearchParams({ datastoreName });
      if (prefix) params.set('prefix', prefix);
      if (limit) params.set('limit', String(limit));
      if (cursor) params.set('cursor', cursor);
      if (scope) params.set('scope', scope);

      const url = datastoreUrl(uid, `/standard-datastores/datastore/entries?${params.toString()}`);
      const res = await fetch(url, { headers: robloxHeaders(apiKey) });
      const body = await res.text();

      return {
        content: [{ type: 'text' as const, text: res.ok ? body : `Error ${res.status}: ${body}` }],
      };
    },
  );

  // ── Get Entry ────────────────────────────────────────────────────────

  server.tool(
    'datastore_get_entry',
    'Get a single entry from a DataStore by key.',
    {
      datastoreName: z.string().describe('Name of the DataStore'),
      entryKey: z.string().describe('The key to retrieve'),
      universeId: z
        .string()
        .optional()
        .describe(`Universe ID (defaults to ${DEFAULT_UNIVERSE_ID})`),
      scope: z.string().optional().describe('DataStore scope (default: "global")'),
    },
    async ({ datastoreName, entryKey, universeId, scope }) => {
      const uid = universeId ?? DEFAULT_UNIVERSE_ID;
      const params = new URLSearchParams({ datastoreName, entryKey });
      if (scope) params.set('scope', scope);

      const url = datastoreUrl(
        uid,
        `/standard-datastores/datastore/entries/entry?${params.toString()}`,
      );
      const res = await fetch(url, { headers: robloxHeaders(apiKey) });
      const body = await res.text();

      return {
        content: [{ type: 'text' as const, text: res.ok ? body : `Error ${res.status}: ${body}` }],
      };
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
      universeId: z
        .string()
        .optional()
        .describe(`Universe ID (defaults to ${DEFAULT_UNIVERSE_ID})`),
      scope: z.string().optional().describe('DataStore scope (default: "global")'),
    },
    async ({ datastoreName, entryKey, value, universeId, scope }) => {
      const uid = universeId ?? DEFAULT_UNIVERSE_ID;
      const params = new URLSearchParams({ datastoreName, entryKey });
      if (scope) params.set('scope', scope);

      const url = datastoreUrl(
        uid,
        `/standard-datastores/datastore/entries/entry?${params.toString()}`,
      );
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          ...robloxHeaders(apiKey),
          'Content-Type': 'application/json',
        },
        body: value,
      });
      const body = await res.text();

      return {
        content: [
          {
            type: 'text' as const,
            text: res.ok ? `Entry set successfully.\n${body}` : `Error ${res.status}: ${body}`,
          },
        ],
      };
    },
  );
}
