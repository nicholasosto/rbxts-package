/**
 * Image Analysis (Vision) Tool
 *
 * Wraps @nicholasosto/ai-tools image analysis as an MCP tool.
 * Uses a vision-capable model (default gpt-4o) to describe or classify images.
 */

import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { createAISessionFromEnv } from '@nicholasosto/ai-tools';
import { logger } from '../logger.js';

/** Zod schema for the analyze_image tool input. */
const AnalyzeImageInput = {
  imageUrl: z.string().url().describe('Public URL of the image to analyze'),
  prompt: z
    .string()
    .describe('What to analyze or classify about the image (e.g. "Categorize this Roblox decal")'),
  model: z
    .string()
    .optional()
    .describe('Override the model (default: gpt-4o). Must be vision-capable.'),
  instructions: z.string().optional().describe('System-level instructions for the model'),
  temperature: z.number().min(0).max(2).optional().describe('Sampling temperature (0-2)'),
  maxOutputTokens: z.number().optional().describe('Maximum tokens to generate'),
};

/**
 * Register the `analyze_image` tool on the given MCP server.
 */
export function registerImageAnalysisTool(server: McpServer): void {
  server.tool(
    'analyze_image',
    'Analyze an image using a vision-capable AI model (GPT-4o by default). ' +
      'Provide an image URL and a prompt describing what to analyze. ' +
      'Useful for categorizing decals, describing textures, reading text in images, etc.',
    AnalyzeImageInput,
    async ({ imageUrl, prompt, model, instructions, temperature, maxOutputTokens }) => {
      logger.toolCall('analyze_image', { model, temperature });

      const session = createAISessionFromEnv();
      const result = await session.analyzeImage(imageUrl, prompt, {
        model,
        instructions,
        temperature,
        maxOutputTokens,
      });

      return {
        content: [
          {
            type: 'text' as const,
            text: JSON.stringify(
              {
                analysis: result.text,
                model: result.model,
                usage: result.usage,
              },
              null,
              2,
            ),
          },
        ],
      };
    },
  );
}
