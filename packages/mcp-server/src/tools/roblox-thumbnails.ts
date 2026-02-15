/**
 * Roblox Thumbnails Tool
 *
 * Public API — no auth required.
 * Docs: https://create.roblox.com/docs/cloud/reference/features/thumbnails
 *
 * Endpoint: GET https://thumbnails.roblox.com/v1/assets?assetIds=CSV&size=...&format=...
 */

import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

/* ── helpers ─────────────────────────────────────────────────────────────── */

const THUMBNAILS_BASE = 'https://thumbnails.roblox.com';

/** Small delay helper for retry logic. */
function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/* ── registration ────────────────────────────────────────────────────────── */

export function registerThumbnailTools(server: McpServer): void {
  /* ── thumbnail_get_assets ───────────────────────────────────────────── */
  server.tool(
    'thumbnail_get_assets',
    'Get thumbnail image URLs for Roblox assets (decals, models, etc.). ' +
      'Returns CDN URLs for up to 100 assets at once. No auth required. ' +
      'Thumbnails may be "Pending" on first request — the tool auto-retries once.',
    {
      assetIds: z
        .string()
        .describe('Comma-separated asset IDs (e.g. "13498955922,14900289550"). Max ~100.'),
      size: z
        .enum([
          '30x30',
          '42x42',
          '50x50',
          '60x62',
          '75x75',
          '110x110',
          '150x150',
          '180x180',
          '250x250',
          '352x352',
          '420x420',
          '512x512',
          '720x720',
        ])
        .default('420x420')
        .describe('Thumbnail size'),
      format: z.enum(['Png', 'Jpeg', 'Webp']).default('Png').describe('Image format'),
      isCircular: z.boolean().default(false).describe('Whether to render as a circular thumbnail'),
    },
    async ({ assetIds, size, format, isCircular }) => {
      const params = new URLSearchParams({
        assetIds,
        size,
        format,
        isCircular: String(isCircular),
      });

      const url = `${THUMBNAILS_BASE}/v1/assets?${params.toString()}`;

      // First request
      let res = await fetch(url);
      let body = (await res.json()) as {
        data?: { targetId: number; state: string; imageUrl: string }[];
      };

      if (!res.ok) {
        return {
          content: [
            { type: 'text' as const, text: `Error ${res.status}: ${JSON.stringify(body)}` },
          ],
        };
      }

      // Check if all results are Pending — if so, wait 2s and retry once
      const allPending = (body.data ?? []).every((item) => item.state === 'Pending');

      if (allPending && (body.data ?? []).length > 0) {
        await delay(2000);
        res = await fetch(url);
        body = (await res.json()) as {
          data?: { targetId: number; state: string; imageUrl: string }[];
        };
      }

      return {
        content: [
          {
            type: 'text' as const,
            text: JSON.stringify(body, null, 2),
          },
        ],
      };
    },
  );
}
