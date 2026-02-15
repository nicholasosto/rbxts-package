/**
 * Roblox Assets Tools
 *
 * Exposes Roblox Open Cloud Assets API operations as MCP tools.
 * Docs: https://create.roblox.com/docs/cloud/reference/features/assets
 *
 * Supported endpoints (API Key auth):
 *   GET    /assets/v1/assets/{assetId}                        – get info
 *   PATCH  /assets/v1/assets/{assetId}                        – update metadata
 *   POST   /assets/v1/assets                                  – create / upload
 *   GET    /assets/v1/assets/{assetId}/versions                – list versions
 *   GET    /assets/v1/assets/{assetId}/versions/{versionNumber} – get version
 *   POST   /assets/v1/assets/{assetId}/versions:rollback       – rollback
 *   POST   /assets/v1/assets/{assetId}:archive                 – archive
 *   POST   /assets/v1/assets/{assetId}:restore                 – restore
 *   GET    /toolbox-service/v2/assets:search                   – search Creator Store
 */

import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { getRobloxCloudConfig } from '@nicholasosto/node-tools';
import { ROBLOX_CLOUD_BASE, robloxHeaders } from '../types.js';

type AnyJson = Record<string, unknown>;

export function registerAssetTools(server: McpServer): void {
  const { apiKey } = getRobloxCloudConfig();

  // ── Get Asset Info ───────────────────────────────────────────────────

  server.tool(
    'asset_get_info',
    'Get information about a Roblox asset by its ID. Include readMask for additional metadata.',
    {
      assetId: z.string().describe('The asset ID to look up'),
      readMask: z
        .string()
        .optional()
        .describe('Comma-separated fields to include (e.g. "description,displayName,path")'),
    },
    async ({ assetId, readMask }) => {
      const params = readMask ? `?readMask=${encodeURIComponent(readMask)}` : '';
      const url = `${ROBLOX_CLOUD_BASE}/assets/v1/assets/${assetId}${params}`;
      const res = await fetch(url, { headers: robloxHeaders(apiKey) });
      const body = await res.text();

      return {
        content: [{ type: 'text' as const, text: res.ok ? body : `Error ${res.status}: ${body}` }],
      };
    },
  );

  // ── Update Asset Metadata ────────────────────────────────────────────

  server.tool(
    'asset_update',
    "Update an existing asset's metadata (display name, description). Use PATCH.",
    {
      assetId: z.string().describe('The asset ID to update'),
      displayName: z.string().optional().describe('New display name'),
      description: z.string().optional().describe('New description'),
    },
    async ({ assetId, displayName, description }) => {
      const updateMask: string[] = [];
      const body: AnyJson = {};
      if (displayName !== undefined) {
        updateMask.push('displayName');
        body.displayName = displayName;
      }
      if (description !== undefined) {
        updateMask.push('description');
        body.description = description;
      }
      const url = `${ROBLOX_CLOUD_BASE}/assets/v1/assets/${assetId}?updateMask=${updateMask.join(',')}`;
      const res = await fetch(url, {
        method: 'PATCH',
        headers: robloxHeaders(apiKey),
        body: JSON.stringify(body),
      });
      const resBody = await res.text();

      return {
        content: [
          { type: 'text' as const, text: res.ok ? resBody : `Error ${res.status}: ${resBody}` },
        ],
      };
    },
  );

  // ── List Asset Versions ──────────────────────────────────────────────

  server.tool(
    'asset_list_versions',
    'List all versions of a Roblox asset.',
    {
      assetId: z.string().describe('The asset ID'),
      pageToken: z.string().optional().describe('Pagination token from a previous response'),
    },
    async ({ assetId, pageToken }) => {
      const params = pageToken ? `?pageToken=${encodeURIComponent(pageToken)}` : '';
      const url = `${ROBLOX_CLOUD_BASE}/assets/v1/assets/${assetId}/versions${params}`;
      const res = await fetch(url, { headers: robloxHeaders(apiKey) });
      const body = await res.text();

      return {
        content: [{ type: 'text' as const, text: res.ok ? body : `Error ${res.status}: ${body}` }],
      };
    },
  );

  // ── Get Asset Version ────────────────────────────────────────────────

  server.tool(
    'asset_get_version',
    'Get details about a specific version of an asset.',
    {
      assetId: z.string().describe('The asset ID'),
      versionNumber: z.string().describe('The version number to retrieve'),
    },
    async ({ assetId, versionNumber }) => {
      const url = `${ROBLOX_CLOUD_BASE}/assets/v1/assets/${assetId}/versions/${versionNumber}`;
      const res = await fetch(url, { headers: robloxHeaders(apiKey) });
      const body = await res.text();

      return {
        content: [{ type: 'text' as const, text: res.ok ? body : `Error ${res.status}: ${body}` }],
      };
    },
  );

  // ── Rollback Asset Version ───────────────────────────────────────────

  server.tool(
    'asset_rollback_version',
    'Rollback an asset to a previous version.',
    {
      assetId: z.string().describe('The asset ID'),
      versionNumber: z.string().describe('The version number to rollback to'),
    },
    async ({ assetId, versionNumber }) => {
      const url = `${ROBLOX_CLOUD_BASE}/assets/v1/assets/${assetId}/versions:rollback`;
      const res = await fetch(url, {
        method: 'POST',
        headers: robloxHeaders(apiKey),
        body: JSON.stringify({ assetVersion: `assets/${assetId}/versions/${versionNumber}` }),
      });
      const body = await res.text();

      return {
        content: [{ type: 'text' as const, text: res.ok ? body : `Error ${res.status}: ${body}` }],
      };
    },
  );

  // ── Archive Asset ────────────────────────────────────────────────────

  server.tool(
    'asset_archive',
    'Archive a Roblox asset, making it inaccessible.',
    {
      assetId: z.string().describe('The asset ID to archive'),
    },
    async ({ assetId }) => {
      const url = `${ROBLOX_CLOUD_BASE}/assets/v1/assets/${assetId}:archive`;
      const res = await fetch(url, { method: 'POST', headers: robloxHeaders(apiKey) });
      const body = await res.text();

      return {
        content: [
          {
            type: 'text' as const,
            text: res.ok ? `Asset ${assetId} archived.` : `Error ${res.status}: ${body}`,
          },
        ],
      };
    },
  );

  // ── Restore Archived Asset ───────────────────────────────────────────

  server.tool(
    'asset_restore',
    'Restore a previously archived Roblox asset.',
    {
      assetId: z.string().describe('The asset ID to restore'),
    },
    async ({ assetId }) => {
      const url = `${ROBLOX_CLOUD_BASE}/assets/v1/assets/${assetId}:restore`;
      const res = await fetch(url, { method: 'POST', headers: robloxHeaders(apiKey) });
      const body = await res.text();

      return {
        content: [
          {
            type: 'text' as const,
            text: res.ok ? `Asset ${assetId} restored.` : `Error ${res.status}: ${body}`,
          },
        ],
      };
    },
  );

  // ── Search Creator Store ─────────────────────────────────────────────

  server.tool(
    'asset_search_creator_store',
    'Search the Roblox Creator Store for assets (models, meshes, audio, images, etc.).',
    {
      keyword: z.string().optional().describe('Search keyword'),
      assetType: z
        .string()
        .optional()
        .describe('Filter by asset type (e.g. "Model", "Decal", "Audio", "Mesh")'),
      pageSize: z.number().min(1).max(50).optional().describe('Results per page (default 10)'),
      pageToken: z.string().optional().describe('Pagination token from a previous response'),
    },
    async ({ keyword, assetType, pageSize, pageToken }) => {
      const params = new URLSearchParams();
      if (keyword) params.set('keyword', keyword);
      if (assetType) params.set('assetType', assetType);
      if (pageSize) params.set('pageSize', String(pageSize));
      if (pageToken) params.set('pageToken', pageToken);

      const url = `${ROBLOX_CLOUD_BASE}/toolbox-service/v2/assets:search?${params.toString()}`;
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
