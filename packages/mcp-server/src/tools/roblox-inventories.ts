/**
 * Roblox Open Cloud — Inventory Tools
 *
 * Docs: https://create.roblox.com/docs/cloud/reference/features/inventories
 * Guide: https://create.roblox.com/docs/cloud/guides/inventory
 *
 * Endpoint: GET /cloud/v2/users/{userId}/inventory-items
 * Auth: API Key (x-api-key header)
 * Status: Beta
 */

import { z } from 'zod';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { getRobloxCloudConfig } from '@nicholasosto/node-tools';
import { ROBLOX_CLOUD_BASE, robloxHeaders } from '../types.js';

/* ── helpers ─────────────────────────────────────────────────────────────── */

const DEFAULT_USER_ID = '3394700055';

function inventoryUrl(userId: string): string {
  return `${ROBLOX_CLOUD_BASE}/cloud/v2/users/${userId}/inventory-items`;
}

/* ── registration ────────────────────────────────────────────────────────── */

export function registerInventoryTools(server: McpServer): void {
  /* ── inventory_list_items ────────────────────────────────────────────── */
  server.tool(
    'inventory_list_items',
    'List inventory items for a Roblox user. Supports filtering by asset IDs, ' +
      'badge IDs, game pass IDs, private server IDs, collectibles, and asset types. ' +
      'Filters are semicolon-separated (e.g. "onlyCollectibles=true;inventoryItemAssetTypes=HAT").',
    {
      userId: z.string().default(DEFAULT_USER_ID).describe('Roblox user ID to list inventory for'),
      filter: z
        .string()
        .optional()
        .describe(
          'Semicolon-separated filter string. Examples: ' +
            '"assetIds=62724852,1028595" | ' +
            '"onlyCollectibles=true;inventoryItemAssetTypes=HAT,CLASSIC_PANTS" | ' +
            '"badgeIds=111,222;gamePassIds=777" | ' +
            '"gamePasses=true;badges=true"',
        ),
      maxPageSize: z
        .number()
        .int()
        .min(1)
        .max(100)
        .default(25)
        .describe('Max items per page (1-100, default 25)'),
      pageToken: z
        .string()
        .optional()
        .describe('Page token from a previous response for pagination'),
    },
    async ({ userId, filter, maxPageSize, pageToken }) => {
      const { apiKey } = getRobloxCloudConfig();
      const params = new URLSearchParams();
      params.set('maxPageSize', String(maxPageSize));
      if (filter) params.set('filter', filter);
      if (pageToken) params.set('pageToken', pageToken);

      const url = `${inventoryUrl(userId)}?${params.toString()}`;
      const res = await fetch(url, { headers: robloxHeaders(apiKey) });
      const body = await res.text();

      return {
        content: [
          {
            type: 'text' as const,
            text: res.ok ? body : `Error ${res.status}: ${body}`,
          },
        ],
      };
    },
  );

  /* ── inventory_check_ownership ──────────────────────────────────────── */
  server.tool(
    'inventory_check_ownership',
    'Check whether a Roblox user owns specific assets by their IDs. ' +
      'Returns only the assets from the list that the user actually owns.',
    {
      userId: z.string().default(DEFAULT_USER_ID).describe('Roblox user ID to check ownership for'),
      assetIds: z
        .string()
        .describe('Comma-separated asset IDs to check (e.g. "62724852,1028595,4773588762")'),
    },
    async ({ userId, assetIds }) => {
      const { apiKey } = getRobloxCloudConfig();
      const params = new URLSearchParams({
        filter: `assetIds=${assetIds}`,
      });

      const url = `${inventoryUrl(userId)}?${params.toString()}`;
      const res = await fetch(url, { headers: robloxHeaders(apiKey) });
      const body = await res.text();

      if (!res.ok) {
        return {
          content: [{ type: 'text' as const, text: `Error ${res.status}: ${body}` }],
        };
      }

      const data = JSON.parse(body);
      const owned = (data.inventoryItems ?? []).map(
        (item: { assetDetails?: { assetId?: string; inventoryItemAssetType?: string } }) =>
          item.assetDetails,
      );

      return {
        content: [
          {
            type: 'text' as const,
            text:
              owned.length > 0
                ? `User owns ${owned.length} of the requested assets:\n${JSON.stringify(owned, null, 2)}`
                : 'User does not own any of the requested assets.',
          },
        ],
      };
    },
  );

  /* ── inventory_list_collectibles ────────────────────────────────────── */
  server.tool(
    'inventory_list_collectibles',
    'List all collectible/limited items owned by a Roblox user.',
    {
      userId: z.string().default(DEFAULT_USER_ID).describe('Roblox user ID'),
      assetTypes: z
        .string()
        .optional()
        .describe(
          'Comma-separated asset types to filter (e.g. "HAT,CLASSIC_PANTS"). ' +
            'Use "*" for all types. Defaults to all.',
        ),
      maxPageSize: z
        .number()
        .int()
        .min(1)
        .max(100)
        .default(25)
        .describe('Max items per page (1-100)'),
      pageToken: z.string().optional().describe('Page token for pagination'),
    },
    async ({ userId, assetTypes, maxPageSize, pageToken }) => {
      const { apiKey } = getRobloxCloudConfig();
      const types = assetTypes ?? '*';
      const filterStr = `onlyCollectibles=true;inventoryItemAssetTypes=${types}`;

      const params = new URLSearchParams({
        filter: filterStr,
        maxPageSize: String(maxPageSize),
      });
      if (pageToken) params.set('pageToken', pageToken);

      const url = `${inventoryUrl(userId)}?${params.toString()}`;
      const res = await fetch(url, { headers: robloxHeaders(apiKey) });
      const body = await res.text();

      return {
        content: [
          {
            type: 'text' as const,
            text: res.ok ? body : `Error ${res.status}: ${body}`,
          },
        ],
      };
    },
  );
}
