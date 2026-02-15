/**
 * Roblox Assets Tool
 *
 * Exposes Roblox Open Cloud Assets API operations as MCP tools.
 * Docs: https://create.roblox.com/docs/cloud/reference/Asset
 */

import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { getRobloxCloudConfig } from '@nicholasosto/node-tools';
import { ROBLOX_CLOUD_BASE, robloxHeaders } from '../types.js';

export function registerAssetTools(server: McpServer): void {
  const { apiKey } = getRobloxCloudConfig();

  // ── Get Asset Info ───────────────────────────────────────────────────

  server.tool(
    'asset_get_info',
    'Get information about a Roblox asset by its ID.',
    {
      assetId: z.string().describe('The asset ID to look up'),
    },
    async ({ assetId }) => {
      const url = `${ROBLOX_CLOUD_BASE}/assets/v1/assets/${assetId}`;
      const res = await fetch(url, { headers: robloxHeaders(apiKey) });
      const body = await res.text();

      return {
        content: [{ type: 'text' as const, text: res.ok ? body : `Error ${res.status}: ${body}` }],
      };
    },
  );

  // ── List Assets (by creator) ─────────────────────────────────────────

  server.tool(
    'asset_list',
    'List assets owned by a user or group.',
    {
      creatorType: z.enum(['User', 'Group']).describe('Type of creator'),
      creatorId: z.string().describe('The user or group ID'),
      assetType: z
        .string()
        .optional()
        .describe('Filter by asset type (e.g. "Decal", "Audio", "Model")'),
      pageSize: z.number().min(1).max(50).optional().describe('Results per page'),
      pageToken: z.string().optional().describe('Pagination token from a previous response'),
    },
    async ({ creatorType, creatorId, assetType, pageSize, pageToken }) => {
      const params = new URLSearchParams();
      params.set('creatorType', creatorType);
      params.set('creatorTargetId', creatorId);
      if (assetType) params.set('assetType', assetType);
      if (pageSize) params.set('pageSize', String(pageSize));
      if (pageToken) params.set('pageToken', pageToken);

      const url = `${ROBLOX_CLOUD_BASE}/assets/v1/assets?${params.toString()}`;
      const res = await fetch(url, { headers: robloxHeaders(apiKey) });
      const body = await res.text();

      return {
        content: [{ type: 'text' as const, text: res.ok ? body : `Error ${res.status}: ${body}` }],
      };
    },
  );

  // ── Upload Asset ─────────────────────────────────────────────────────

  server.tool(
    'asset_upload',
    'Upload a new asset to Roblox (creates via the Open Cloud Assets API). Provide the asset as base64-encoded file data.',
    {
      name: z.string().describe('Display name for the asset'),
      description: z.string().optional().describe('Asset description'),
      assetType: z.string().describe('Asset type (e.g. "Decal", "Audio", "Model")'),
      creatorType: z.enum(['User', 'Group']).describe('Creator type'),
      creatorId: z.string().describe('Creator user or group ID'),
      fileContent: z.string().describe('Base64-encoded file content'),
      contentType: z.string().describe('MIME type of the file (e.g. "image/png", "audio/ogg")'),
    },
    async ({ name, description, assetType, creatorType, creatorId, fileContent, contentType }) => {
      const url = `${ROBLOX_CLOUD_BASE}/assets/v1/assets`;

      // Build multipart form
      const metadata = JSON.stringify({
        assetType,
        displayName: name,
        description: description ?? '',
        creationContext: {
          creator: {
            [creatorType.toLowerCase() + 'Id']: creatorId,
          },
        },
      });

      const boundary = `----MCPBoundary${Date.now()}`;
      const body = [
        `--${boundary}`,
        'Content-Disposition: form-data; name="request"',
        'Content-Type: application/json',
        '',
        metadata,
        `--${boundary}`,
        `Content-Disposition: form-data; name="fileContent"; filename="asset"`,
        `Content-Type: ${contentType}`,
        '',
        Buffer.from(fileContent, 'base64').toString('binary'),
        `--${boundary}--`,
      ].join('\r\n');

      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'x-api-key': apiKey,
          'Content-Type': `multipart/form-data; boundary=${boundary}`,
        },
        body,
      });
      const resBody = await res.text();

      return {
        content: [
          {
            type: 'text' as const,
            text: res.ok
              ? `Asset uploaded successfully.\n${resBody}`
              : `Error ${res.status}: ${resBody}`,
          },
        ],
      };
    },
  );
}
