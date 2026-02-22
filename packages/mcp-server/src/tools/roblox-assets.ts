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
import { NumericId } from '../config.js';
import { logger } from '../logger.js';
import {
  ROBLOX_CLOUD_BASE,
  robloxFetch,
  robloxHeaders,
  buildMultipartBody,
  textContent,
  errorResponse,
  successResponse,
} from '../roblox-helpers.js';

type AnyJson = Record<string, unknown>;

export function registerAssetTools(server: McpServer): void {
  // ── Get Asset Info ───────────────────────────────────────────────────

  server.tool(
    'asset_get_info',
    'Get information about a Roblox asset by its ID. Include readMask for additional metadata.',
    {
      assetId: NumericId.describe('The asset ID to look up'),
      readMask: z
        .string()
        .optional()
        .describe('Comma-separated fields to include (e.g. "description,displayName,path")'),
    },
    async ({ assetId, readMask }) => {
      logger.toolCall('asset_get_info', { assetId, readMask });
      const params = readMask ? `?readMask=${encodeURIComponent(readMask)}` : '';
      const url = `${ROBLOX_CLOUD_BASE}/assets/v1/assets/${assetId}${params}`;
      const res = await robloxFetch(url);

      return res.ok ? successResponse(res.body) : errorResponse(res.status, res.body, url);
    },
  );

  // ── Update Asset Metadata ────────────────────────────────────────────

  server.tool(
    'asset_update',
    "Update an existing asset's metadata (display name, description). Use PATCH.",
    {
      assetId: NumericId.describe('The asset ID to update'),
      displayName: z.string().optional().describe('New display name'),
      description: z.string().optional().describe('New description'),
    },
    async ({ assetId, displayName, description }) => {
      logger.toolCall('asset_update', { assetId, displayName });
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
      const res = await robloxFetch(url, {
        method: 'PATCH',
        headers: robloxHeaders(),
        body: JSON.stringify(body),
      });

      return res.ok ? successResponse(res.body) : errorResponse(res.status, res.body, url);
    },
  );

  // ── List Asset Versions ──────────────────────────────────────────────

  server.tool(
    'asset_list_versions',
    'List all versions of a Roblox asset.',
    {
      assetId: NumericId.describe('The asset ID'),
      pageToken: z.string().optional().describe('Pagination token from a previous response'),
    },
    async ({ assetId, pageToken }) => {
      logger.toolCall('asset_list_versions', { assetId });
      const params = pageToken ? `?pageToken=${encodeURIComponent(pageToken)}` : '';
      const url = `${ROBLOX_CLOUD_BASE}/assets/v1/assets/${assetId}/versions${params}`;
      const res = await robloxFetch(url);

      return res.ok ? successResponse(res.body) : errorResponse(res.status, res.body, url);
    },
  );

  // ── Get Asset Version ────────────────────────────────────────────────

  server.tool(
    'asset_get_version',
    'Get details about a specific version of an asset.',
    {
      assetId: NumericId.describe('The asset ID'),
      versionNumber: z
        .string()
        .regex(/^\d+$/, 'Must be a numeric version number')
        .describe('The version number to retrieve'),
    },
    async ({ assetId, versionNumber }) => {
      logger.toolCall('asset_get_version', { assetId, versionNumber });
      const url = `${ROBLOX_CLOUD_BASE}/assets/v1/assets/${assetId}/versions/${versionNumber}`;
      const res = await robloxFetch(url);

      return res.ok ? successResponse(res.body) : errorResponse(res.status, res.body, url);
    },
  );

  // ── Rollback Asset Version ───────────────────────────────────────────

  server.tool(
    'asset_rollback_version',
    'Rollback an asset to a previous version.',
    {
      assetId: NumericId.describe('The asset ID'),
      versionNumber: z
        .string()
        .regex(/^\d+$/, 'Must be a numeric version number')
        .describe('The version number to rollback to'),
    },
    async ({ assetId, versionNumber }) => {
      logger.toolCall('asset_rollback_version', { assetId, versionNumber });
      const url = `${ROBLOX_CLOUD_BASE}/assets/v1/assets/${assetId}/versions:rollback`;
      const res = await robloxFetch(url, {
        method: 'POST',
        headers: robloxHeaders(),
        body: JSON.stringify({ assetVersion: `assets/${assetId}/versions/${versionNumber}` }),
      });

      return res.ok ? successResponse(res.body) : errorResponse(res.status, res.body, url);
    },
  );

  // ── Archive Asset ────────────────────────────────────────────────────

  server.tool(
    'asset_archive',
    'Archive a Roblox asset, making it inaccessible.',
    {
      assetId: NumericId.describe('The asset ID to archive'),
    },
    async ({ assetId }) => {
      logger.toolCall('asset_archive', { assetId });
      const url = `${ROBLOX_CLOUD_BASE}/assets/v1/assets/${assetId}:archive`;
      const res = await robloxFetch(url, { method: 'POST' });

      if (res.ok) {
        return { content: [textContent(`Asset ${assetId} archived.`)] };
      }
      return errorResponse(res.status, res.body, url);
    },
  );

  // ── Restore Archived Asset ───────────────────────────────────────────

  server.tool(
    'asset_restore',
    'Restore a previously archived Roblox asset.',
    {
      assetId: NumericId.describe('The asset ID to restore'),
    },
    async ({ assetId }) => {
      logger.toolCall('asset_restore', { assetId });
      const url = `${ROBLOX_CLOUD_BASE}/assets/v1/assets/${assetId}:restore`;
      const res = await robloxFetch(url, { method: 'POST' });

      if (res.ok) {
        return { content: [textContent(`Asset ${assetId} restored.`)] };
      }
      return errorResponse(res.status, res.body, url);
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
      logger.toolCall('asset_search_creator_store', { keyword, assetType });
      const params = new URLSearchParams();
      if (keyword) params.set('keyword', keyword);
      if (assetType) params.set('assetType', assetType);
      if (pageSize) params.set('pageSize', String(pageSize));
      if (pageToken) params.set('pageToken', pageToken);

      const url = `${ROBLOX_CLOUD_BASE}/toolbox-service/v2/assets:search?${params.toString()}`;
      const res = await robloxFetch(url);

      return res.ok ? successResponse(res.body) : errorResponse(res.status, res.body, url);
    },
  );

  // ── Upload Asset (binary-safe) ─────────────────────────────────────

  server.tool(
    'asset_upload',
    'Upload a new asset to Roblox (creates via the Open Cloud Assets API). Provide the asset as base64-encoded file data.',
    {
      name: z.string().describe('Display name for the asset'),
      description: z.string().optional().describe('Asset description'),
      assetType: z.string().describe('Asset type (e.g. "Decal", "Audio", "Model")'),
      creatorType: z.enum(['User', 'Group']).describe('Creator type'),
      creatorId: NumericId.describe('Creator user or group ID'),
      fileContent: z.string().describe('Base64-encoded file content'),
      contentType: z.string().describe('MIME type of the file (e.g. "image/png", "audio/ogg")'),
    },
    async ({ name, description, assetType, creatorType, creatorId, fileContent, contentType }) => {
      logger.toolCall('asset_upload', { name, assetType, creatorType, creatorId });

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

      // Binary-safe multipart construction using Buffer.concat
      const binaryData = Buffer.from(fileContent, 'base64');
      const { body: multipartBody, contentType: mpContentType } = buildMultipartBody([
        { name: 'request', contentType: 'application/json', data: metadata },
        { name: 'fileContent', contentType, data: binaryData, filename: 'asset' },
      ]);

      const url = `${ROBLOX_CLOUD_BASE}/assets/v1/assets`;
      const res = await robloxFetch(url, {
        method: 'POST',
        headers: { 'Content-Type': mpContentType },
        body: multipartBody,
      });

      if (res.ok) {
        return { content: [textContent(`Asset uploaded successfully.\n${res.body}`)] };
      }
      return errorResponse(res.status, res.body, url);
    },
  );
}
