/**
 * Asset Image Pipeline Tool
 *
 * Combined generate → upload → verify pipeline for creating Roblox decal
 * assets from AI-generated images in a single MCP tool call.
 *
 * Flow: OpenAI image generation → Roblox asset upload → thumbnail verification
 */

import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { createAISessionFromEnv } from '@nicholasosto/ai-tools';
import { getRobloxCloudConfig } from '@nicholasosto/node-tools';
import { ROBLOX_CLOUD_BASE } from '../types.js';

/** Default Roblox user ID for asset uploads. */
const DEFAULT_CREATOR_ID = '3394700055';

/** Style guide prefix applied to all icon generation prompts. */
const STYLE_GUIDE =
  'A stylized RPG icon, dark fantasy art style, 2D game UI icon, ' +
  'centered composition, dark textured stone-like background, ' +
  'soft ambient lighting with mystical glow, moderate detail, ' +
  'symmetrical design, suitable for a Roblox game HUD. No text. ';

/**
 * Parse a Roblox asset ID from a creation/upload API response.
 *
 * The Open Cloud Assets v1 create endpoint returns a JSON operation object.
 * The asset ID can appear in several places depending on whether Roblox
 * returns the final result synchronously:
 *
 * 1. `response.assetId`  (direct field)
 * 2. `response.path`     (e.g. "assets/123456")
 * 3. `path`              (top-level operation path)
 */
function extractAssetId(body: string): string | undefined {
  try {
    const json = JSON.parse(body);

    // Case 1: direct assetId field (common in completed operations)
    if (json.assetId) return String(json.assetId);
    if (json.response?.assetId) return String(json.response.assetId);

    // Case 2: path field like "assets/123456"
    const pathStr: string | undefined = json.response?.path ?? json.path;
    if (pathStr) {
      const match = pathStr.match(/assets\/(\d+)/);
      if (match) return match[1];
    }

    // Case 3: look in done/response
    if (json.done && json.response) {
      return extractAssetId(JSON.stringify(json.response));
    }
  } catch {
    // Not JSON — try regex on raw text
    const match = body.match(/"assetId"\s*:\s*"?(\d+)"?/);
    if (match) return match[1];
  }
  return undefined;
}

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
    'Generate an AI image and upload it to Roblox as a Decal in one step. ' +
      'Returns the new asset ID. Use thumbnail_get_assets afterward to verify. ' +
      'A consistent dark-fantasy RPG style guide is automatically applied.',
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
      creatorId: z
        .string()
        .optional()
        .describe(`Roblox user ID for the creator (default: ${DEFAULT_CREATOR_ID})`),
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
    },
    async ({ name, description, imagePrompt, creatorId, size, quality, skipStyleGuide }) => {
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
      content.push({
        type: 'text' as const,
        text: `⏳ Uploading "${name}" to Roblox as Decal…`,
      });

      const { apiKey } = getRobloxCloudConfig();
      const uploadCreatorId = creatorId ?? DEFAULT_CREATOR_ID;

      const metadata = JSON.stringify({
        assetType: 'Decal',
        displayName: name,
        description: description ?? '',
        creationContext: {
          creator: {
            userId: uploadCreatorId,
          },
        },
      });

      const boundary = `----MCPBoundary${Date.now()}`;
      const binaryData = Buffer.from(img.b64Data, 'base64');

      // Build multipart body using Buffer to handle binary data correctly
      const preamble = Buffer.from(
        [
          `--${boundary}`,
          'Content-Disposition: form-data; name="request"',
          'Content-Type: application/json',
          '',
          metadata,
          `--${boundary}`,
          'Content-Disposition: form-data; name="fileContent"; filename="asset.png"',
          'Content-Type: image/png',
          '',
          '',
        ].join('\r\n'),
      );

      const epilogue = Buffer.from(`\r\n--${boundary}--\r\n`);
      const body = Buffer.concat([preamble, binaryData, epilogue]);

      const uploadUrl = `${ROBLOX_CLOUD_BASE}/assets/v1/assets`;
      const res = await fetch(uploadUrl, {
        method: 'POST',
        headers: {
          'x-api-key': apiKey,
          'Content-Type': `multipart/form-data; boundary=${boundary}`,
        },
        body,
      });
      const resBody = await res.text();

      if (!res.ok) {
        content.push({
          type: 'text' as const,
          text: `❌ Upload failed (${res.status}): ${resBody}`,
        });
        return { content };
      }

      // ── Step 3: Extract asset ID (poll if async) ──────────────────
      let assetId = extractAssetId(resBody);

      // The Roblox API often returns an async operation. Poll until done.
      if (!assetId) {
        try {
          const opJson = JSON.parse(resBody);
          const opId: string | undefined = opJson.operationId ?? opJson.path?.split('/').pop();
          if (opId && opJson.done === false) {
            content.push({
              type: 'text' as const,
              text: `⏳ Asset processing (operation ${opId}), polling…`,
            });

            const maxAttempts = 10;
            const delayMs = 3000;
            for (let i = 0; i < maxAttempts; i++) {
              await new Promise((r) => setTimeout(r, delayMs));
              const pollRes = await fetch(`${ROBLOX_CLOUD_BASE}/assets/v1/operations/${opId}`, {
                headers: { 'x-api-key': apiKey },
              });
              const pollBody = await pollRes.text();
              if (pollRes.ok) {
                const pollJson = JSON.parse(pollBody);
                if (pollJson.done) {
                  assetId = extractAssetId(pollBody);
                  break;
                }
              }
            }
          }
        } catch {
          // Polling failed — fall through with undefined assetId
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
          resBody,
        ].join('\n'),
      });

      return { content };
    },
  );
}
