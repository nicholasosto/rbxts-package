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
import { type McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { NumericId, getDefaultUserId } from '../config.js';
import { logger } from '../logger.js';
import {
  ROBLOX_CLOUD_BASE,
  robloxFetch,
  textContent,
  errorResponse,
  successResponse,
} from '../roblox-helpers.js';

/* ── helpers ─────────────────────────────────────────────────────────────── */

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
      userId: NumericId.default(getDefaultUserId()).describe(
        'Roblox user ID to list inventory for',
      ),
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
      logger.toolCall('inventory_list_items', { userId, filter });
      const params = new URLSearchParams();
      params.set('maxPageSize', String(maxPageSize));
      if (filter) params.set('filter', filter);
      if (pageToken) params.set('pageToken', pageToken);

      const url = `${inventoryUrl(userId)}?${params.toString()}`;
      const res = await robloxFetch(url);

      return res.ok ? successResponse(res.body) : errorResponse(res.status, res.body, url);
    },
  );

  /* ── inventory_check_ownership ──────────────────────────────────────── */
  server.tool(
    'inventory_check_ownership',
    'Check whether a Roblox user owns specific assets by their IDs. ' +
      'Returns only the assets from the list that the user actually owns.',
    {
      userId: NumericId.default(getDefaultUserId()).describe(
        'Roblox user ID to check ownership for',
      ),
      assetIds: z
        .string()
        .describe('Comma-separated asset IDs to check (e.g. "62724852,1028595,4773588762")'),
    },
    async ({ userId, assetIds }) => {
      logger.toolCall('inventory_check_ownership', { userId, assetIds });
      const params = new URLSearchParams({
        filter: `assetIds=${assetIds}`,
      });

      const url = `${inventoryUrl(userId)}?${params.toString()}`;
      const res = await robloxFetch(url);

      if (!res.ok) {
        return errorResponse(res.status, res.body, url);
      }

      try {
        const data = res.json as Record<string, unknown> | undefined;
        const items = (data?.inventoryItems ?? []) as Array<{
          assetDetails?: { assetId?: string; inventoryItemAssetType?: string };
        }>;
        const owned = items.map((item) => item.assetDetails);

        return {
          content: [
            textContent(
              owned.length > 0
                ? `User owns ${owned.length} of the requested assets:\n${JSON.stringify(owned, null, 2)}`
                : 'User does not own any of the requested assets.',
            ),
          ],
        };
      } catch (err) {
        logger.error('inventory', 'Failed to parse ownership response', err);
        return errorResponse(res.status, `Response parse error: ${res.body}`, url);
      }
    },
  );

  /* ── inventory_list_collectibles ────────────────────────────────────── */
  server.tool(
    'inventory_list_collectibles',
    'List all collectible/limited items owned by a Roblox user.',
    {
      userId: NumericId.default(getDefaultUserId()).describe('Roblox user ID'),
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
      logger.toolCall('inventory_list_collectibles', { userId, assetTypes });
      const types = assetTypes ?? '*';
      const filterStr = `onlyCollectibles=true;inventoryItemAssetTypes=${types}`;

      const params = new URLSearchParams({
        filter: filterStr,
        maxPageSize: String(maxPageSize),
      });
      if (pageToken) params.set('pageToken', pageToken);

      const url = `${inventoryUrl(userId)}?${params.toString()}`;
      const res = await robloxFetch(url);

      return res.ok ? successResponse(res.body) : errorResponse(res.status, res.body, url);
    },
  );
}
