/**
 * Image Generation Tool
 *
 * Wraps @nicholasosto/ai-tools image generation as an MCP tool.
 */

import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { createAISessionFromEnv } from '@nicholasosto/ai-tools';

/** Zod schema for the generate_image tool input. */
const GenerateImageInput = {
  prompt: z.string().describe('Description of the image to generate'),
  size: z
    .enum(['1024x1024', '1024x1536', '1536x1024', 'auto'])
    .optional()
    .describe('Image dimensions'),
  quality: z.enum(['low', 'medium', 'high', 'auto']).optional().describe('Quality level'),
  outputFormat: z.enum(['png', 'jpeg', 'webp']).optional().describe('Output image format'),
  n: z.number().min(1).max(4).optional().describe('Number of images to generate (1-4)'),
};

/**
 * Register the `generate_image` tool on the given MCP server.
 */
export function registerImageGenerationTool(server: McpServer): void {
  server.tool(
    'generate_image',
    'Generate images using OpenAI. Provide a prompt and optional size/quality/format settings.',
    GenerateImageInput,
    async ({ prompt, size, quality, outputFormat, n }) => {
      const session = createAISessionFromEnv();
      const result = await session.generateImage(prompt, {
        size,
        quality,
        outputFormat,
        n,
      });

      // Return image data as content blocks
      const content: Array<
        { type: 'text'; text: string } | { type: 'image'; data: string; mimeType: string }
      > = [];

      for (const img of result.images) {
        if (img.b64Data) {
          content.push({
            type: 'image' as const,
            data: img.b64Data,
            mimeType: `image/${outputFormat ?? 'png'}`,
          });
        } else if (img.url) {
          content.push({
            type: 'text' as const,
            text: `Image URL: ${img.url}`,
          });
        }
      }

      // Always include metadata
      content.push({
        type: 'text' as const,
        text: JSON.stringify(
          {
            model: result.model,
            imageCount: result.images.length,
          },
          null,
          2,
        ),
      });

      return { content };
    },
  );
}
