/**
 * Asset Image Pipeline Tool
 *
 * Combined generate → upload → verify pipeline for creating Roblox decal
 * assets from AI-generated images in a single MCP tool call.
 *
 * Flow: OpenAI image generation → Roblox asset upload → thumbnail verification
 */

import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { createAISessionFromEnv } from '@nicholasosto/ai-tools';
import { z } from 'zod';
import { NumericId, getDefaultCreatorId } from '../config.js';
import { logger } from '../logger.js';
import {
  ROBLOX_CLOUD_BASE,
  robloxFetch,
  buildMultipartBody,
  extractAssetId,
  pollOperation,
} from '../roblox-helpers.js';

/** Style guide prefix applied to all icon generation prompts. */
const STYLE_GUIDE =
  'A stylized RPG icon, dark fantasy art style, 2D game UI icon, ' +
  'centered composition, dark textured stone-like background, ' +
  'soft ambient lighting with mystical glow, moderate detail, ' +
  'symmetrical design, suitable for a Roblox game HUD. No text. ';

/**
 * Register the `generate_and_upload_decal` tool on the given MCP server.
 *
 * This combines image generation (OpenAI) with Roblox asset upload into a
 * single tool call, solving the problem of needing to pass large base64
 * data between separate tool invocations in a chat conversation.
 */
export function registerAssetImagePipelineTool(server: McpServer): void {
  server.tool(
    'generate_and_upload_decal',
    'Generate an AI image and upload it to Roblox in one step. ' +
      'Returns the new asset ID. Use thumbnail_get_assets afterward to verify. ' +
      'A consistent dark-fantasy RPG style guide is automatically applied. ' +
      'Use assetType "Image" for ImageLabel usage, "Decal" for Decal instances.',
    {
      name: z.string().describe('Display name for the asset (e.g. "ScholarsInsight")'),
      description: z
        .string()
        .describe('Short description of the icon for the Roblox asset metadata'),
      imagePrompt: z
        .string()
        .describe(
          'Visual description of what the icon should depict. ' +
            'The RPG style guide is prepended automatically. ' +
            'Focus on subject, colors, and distinctive elements.',
        ),
      creatorId: NumericId.optional().describe(
        `Roblox user ID for the creator (default: env ROBLOX_CREATOR_ID)`,
      ),
      size: z
        .enum(['1024x1024', '1024x1536', '1536x1024', 'auto'])
        .optional()
        .describe('Image dimensions (default: 1024x1024)'),
      quality: z
        .enum(['low', 'medium', 'high', 'auto'])
        .optional()
        .describe('Image quality (default: high)'),
      skipStyleGuide: z
        .boolean()
        .optional()
        .describe('If true, do not prepend the default RPG style guide to the prompt'),
      assetType: z
        .enum(['Decal', 'Image'])
        .optional()
        .describe(
          'Roblox asset type: "Image" for ImageLabel usage, "Decal" for Decal instances (default: "Image")',
        ),
    },
    async ({
      name,
      description,
      imagePrompt,
      creatorId,
      size,
      quality,
      skipStyleGuide,
      assetType,
    }) => {
      logger.toolCall('generate_and_upload_decal', { name, assetType, size, quality });

      const content: Array<
        { type: 'text'; text: string } | { type: 'image'; data: string; mimeType: string }
      > = [];

      // ── Step 1: Generate the image ──────────────────────────────────
      const fullPrompt = skipStyleGuide ? imagePrompt : `${STYLE_GUIDE}${imagePrompt}`;

      content.push({
        type: 'text' as const,
        text: `⏳ Generating image for "${name}"…`,
      });

      const session = createAISessionFromEnv();
      const result = await session.generateImage(fullPrompt, {
        size: size ?? '1024x1024',
        quality: quality ?? 'high',
        outputFormat: 'png',
        n: 1,
      });

      const img = result.images[0];
      if (!img?.b64Data) {
        return {
          content: [
            {
              type: 'text' as const,
              text: '❌ Image generation failed — no base64 data returned.',
            },
          ],
        };
      }

      // Include the generated image in the response so the user can see it
      content.push({
        type: 'image' as const,
        data: img.b64Data,
        mimeType: 'image/png',
      });

      // ── Step 2: Upload to Roblox ────────────────────────────────────
      const resolvedAssetType = assetType ?? 'Image';
      content.push({
        type: 'text' as const,
        text: `⏳ Uploading "${name}" to Roblox as ${resolvedAssetType}…`,
      });

      const uploadCreatorId = creatorId ?? getDefaultCreatorId();

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

      const binaryData = Buffer.from(img.b64Data, 'base64');
      const { body: multipartBody, contentType } = buildMultipartBody([
        { name: 'request', contentType: 'application/json', data: metadata },
        { name: 'fileContent', contentType: 'image/png', data: binaryData, filename: 'asset.png' },
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

      // ── Step 3: Extract asset ID (poll if async) ──────────────────
      let assetId = extractAssetId(res.body);

      // The Roblox API often returns an async operation. Poll until done.
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
            'asset-pipeline',
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
          ``,
          `**Next steps:**`,
          `1. Verify with \`thumbnail_get_assets\` using asset ID: ${assetId}`,
          `2. Update the assets package TypeScript file with the new rbxassetid`,
          ``,
          `**Raw API response:**`,
          res.body,
        ].join('\n'),
      });

      return { content };
    },
  );
}
