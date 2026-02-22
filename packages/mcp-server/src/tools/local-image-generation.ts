/**
 * Local Image Generation Tool
 *
 * Generates images via OpenAI and saves them to the local assets folder,
 * following the existing naming convention:
 *   {Category Prefix} - {Descriptive Name}.png
 *
 * Images are saved to LOCAL_ASSETS_DIR/images/{subfolder}/{fileName}.png
 */

import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { createAISessionFromEnv } from '@nicholasosto/ai-tools';
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { z } from 'zod';
import { getLocalAssetsDir } from '../config.js';
import { logger } from '../logger.js';

/** Style guide prefix — matches asset-image-pipeline.ts for visual consistency. */
const STYLE_GUIDE =
  'A stylized RPG icon, dark fantasy art style, 2D game UI icon, ' +
  'centered composition, dark textured stone-like background, ' +
  'soft ambient lighting with mystical glow, moderate detail, ' +
  'symmetrical design, suitable for a Roblox game HUD. No text. ';

/** Known subfolders in the local images directory. */
const IMAGE_SUBFOLDERS = [
  'characters-portraits',
  'design-images-prototypes',
  'icons',
  'part-textures',
  'particle-emitter-textures',
  'raw',
  'skybox-sets',
  'slice-frames',
  'ui-instance-background',
] as const;

/**
 * Register the `generate_and_save_local` tool on the given MCP server.
 *
 * Generates an AI image and writes it directly to the local assets folder
 * as a PNG file, following the project's naming convention.
 */
export function registerLocalImageGenerationTool(server: McpServer): void {
  server.tool(
    'generate_and_save_local',
    'Generate an AI image and save it locally to the assets folder. ' +
      'Provide a fileName following the naming convention (e.g. "Icon - Frozen Shield"). ' +
      'The .png extension is added automatically. ' +
      'A dark-fantasy RPG style guide is prepended unless skipStyleGuide is true.',
    {
      prompt: z
        .string()
        .describe(
          'Visual description of what the image should depict. ' +
            'The RPG style guide is prepended automatically. ' +
            'Focus on subject, colors, and distinctive elements.',
        ),
      fileName: z
        .string()
        .describe(
          'File name without extension, following the naming convention: ' +
            '"Icon - Frozen Shield", "Portrait - Penitent Knight", ' +
            '"Panel Texture - Cyber Domain", etc.',
        ),
      subfolder: z.enum(IMAGE_SUBFOLDERS).describe('Target subfolder within the images directory'),
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
    async ({ prompt, fileName, subfolder, size, quality, skipStyleGuide }) => {
      logger.toolCall('generate_and_save_local', { fileName, subfolder, size, quality });

      const content: Array<
        { type: 'text'; text: string } | { type: 'image'; data: string; mimeType: string }
      > = [];

      // ── Resolve output path ────────────────────────────────────────
      const assetsDir = getLocalAssetsDir();
      const targetDir = resolve(assetsDir, 'images', subfolder);
      const targetPath = join(targetDir, `${fileName}.png`);

      // Check if file already exists
      if (existsSync(targetPath)) {
        return {
          content: [
            {
              type: 'text' as const,
              text: `⚠️ File already exists: ${targetPath}\nUse a different fileName to avoid overwriting.`,
            },
          ],
        };
      }

      // Ensure the target directory exists
      if (!existsSync(targetDir)) {
        mkdirSync(targetDir, { recursive: true });
        logger.info('local-image', `Created directory: ${targetDir}`);
      }

      // ── Generate the image ─────────────────────────────────────────
      const fullPrompt = skipStyleGuide ? prompt : `${STYLE_GUIDE}${prompt}`;

      content.push({
        type: 'text' as const,
        text: `⏳ Generating image for "${fileName}"…`,
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

      // ── Write to disk ──────────────────────────────────────────────
      const buffer = Buffer.from(img.b64Data, 'base64');
      writeFileSync(targetPath, buffer);
      logger.info('local-image', `Saved ${buffer.length} bytes → ${targetPath}`);

      // Return the generated image as a preview + confirmation
      content.push({
        type: 'image' as const,
        data: img.b64Data,
        mimeType: 'image/png',
      });

      content.push({
        type: 'text' as const,
        text: [
          `✅ Image saved successfully!`,
          `📁 Path: ${targetPath}`,
          `📐 Size: ${size ?? '1024x1024'}`,
          `📊 File size: ${(buffer.length / 1024).toFixed(1)} KB`,
          `🎨 Model: ${result.model}`,
        ].join('\n'),
      });

      return { content };
    },
  );
}
