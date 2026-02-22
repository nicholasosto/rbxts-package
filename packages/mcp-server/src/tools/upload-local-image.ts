/**
 * Upload Local Image Tool
 *
 * Reads an existing local image file and uploads it to Roblox as a Decal
 * or Image asset.  This is the "step 2" counterpart to generate_and_save_local:
 *
 *   1. generate_and_save_local  → review the image
 *   2. upload_local_image       → push it to Roblox
 */

import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { z } from 'zod';
import { NumericId, getDefaultCreatorId, getLocalAssetsDir } from '../config.js';
import { logger } from '../logger.js';
import {
  ROBLOX_CLOUD_BASE,
  buildMultipartBody,
  extractAssetId,
  pollOperation,
  robloxFetch,
} from '../roblox-helpers.js';

/**
 * Register the `upload_local_image` tool on the given MCP server.
 */
export function registerUploadLocalImageTool(server: McpServer): void {
  server.tool(
    'upload_local_image',
    'Upload an existing local image file to Roblox as a Decal or Image asset. ' +
      'Use after generate_and_save_local to complete the two-step workflow. ' +
      'Accepts a path relative to LOCAL_ASSETS_DIR/images/ or an absolute path.',
    {
      name: z.string().describe('Display name for the Roblox asset'),
      description: z.string().describe('Short description for the Roblox asset metadata'),
      localPath: z
        .string()
        .describe(
          'Path to the image file. If relative, resolved under LOCAL_ASSETS_DIR/images/ ' +
            '(e.g. "icons/Faction Banner - Crimson Order.png"). Absolute paths also accepted.',
        ),
      creatorId: NumericId.optional().describe(
        'Roblox user ID for the creator (default: env ROBLOX_CREATOR_ID)',
      ),
      assetType: z
        .enum(['Decal', 'Image'])
        .optional()
        .describe(
          'Roblox asset type: "Image" for ImageLabel usage, "Decal" for Decal instances (default: "Image")',
        ),
    },
    async ({ name, description, localPath, creatorId, assetType }) => {
      logger.toolCall('upload_local_image', { name, localPath, assetType });

      // ── Resolve the file path ──────────────────────────────────────
      const assetsDir = getLocalAssetsDir();
      const filePath = localPath.startsWith('/')
        ? localPath
        : resolve(assetsDir, 'images', localPath);

      if (!existsSync(filePath)) {
        return {
          content: [
            {
              type: 'text' as const,
              text: `❌ File not found: ${filePath}`,
            },
          ],
        };
      }

      // ── Read the file ──────────────────────────────────────────────
      const binaryData = readFileSync(filePath);
      const fileSizeKB = (binaryData.length / 1024).toFixed(1);

      const content: Array<{ type: 'text'; text: string }> = [];
      content.push({
        type: 'text' as const,
        text: `📂 Read ${fileSizeKB} KB from ${filePath}`,
      });

      // ── Upload to Roblox ───────────────────────────────────────────
      const resolvedAssetType = assetType ?? 'Image';
      const uploadCreatorId = creatorId ?? getDefaultCreatorId();

      content.push({
        type: 'text' as const,
        text: `⏳ Uploading "${name}" to Roblox as ${resolvedAssetType}…`,
      });

      const metadata = JSON.stringify({
        assetType: resolvedAssetType,
        displayName: name,
        description: description ?? '',
        creationContext: {
          creator: {
            userId: uploadCreatorId,
          },
        },
      });

      const { body: multipartBody, contentType } = buildMultipartBody([
        { name: 'request', contentType: 'application/json', data: metadata },
        {
          name: 'fileContent',
          contentType: 'image/png',
          data: binaryData,
          filename: 'asset.png',
        },
      ]);

      const uploadUrl = `${ROBLOX_CLOUD_BASE}/assets/v1/assets`;
      const res = await robloxFetch(uploadUrl, {
        method: 'POST',
        headers: { 'Content-Type': contentType },
        body: multipartBody,
      });

      if (!res.ok) {
        content.push({
          type: 'text' as const,
          text: `❌ Upload failed (${res.status}): ${res.body}`,
        });
        return { content };
      }

      // ── Extract asset ID (poll if async) ───────────────────────────
      let assetId = extractAssetId(res.body);

      if (!assetId) {
        try {
          const opJson = res.json as Record<string, unknown> | undefined;
          const opId = opJson?.operationId ?? (opJson?.path as string)?.split('/').pop();
          if (opId && opJson?.done === false) {
            content.push({
              type: 'text' as const,
              text: `⏳ Asset processing (operation ${opId}), polling…`,
            });

            const pollResult = await pollOperation(`assets/v1/operations/${opId}`, 10, 3000);
            if (pollResult.done && pollResult.response) {
              assetId = extractAssetId(JSON.stringify(pollResult.response));
            }
          }
        } catch (err) {
          logger.error(
            'upload-local-image',
            'Polling failed',
            err instanceof Error ? err.message : err,
          );
        }
      }

      content.push({
        type: 'text' as const,
        text: [
          `✅ Asset uploaded successfully!`,
          ``,
          `**Asset ID:** ${assetId ?? '(pending — check operation)'}`,
          `**rbxassetid:** \`rbxassetid://${assetId ?? '???'}\``,
          `**Display Name:** ${name}`,
          `**Source:** ${filePath}`,
          ``,
          `**Next steps:**`,
          `1. Verify with \`thumbnail_get_assets\` using asset ID: ${assetId}`,
          `2. Update the assets package TypeScript file with the new rbxassetid`,
          `3. Update the asset-map YAML to \`assigned\` status`,
          ``,
          `**Raw API response:**`,
          res.body,
        ].join('\n'),
      });

      return { content };
    },
  );
}
