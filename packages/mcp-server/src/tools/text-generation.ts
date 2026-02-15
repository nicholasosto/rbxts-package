/**
 * Text Generation Tool
 *
 * Wraps @nicholasosto/ai-tools text generation as an MCP tool.
 */

import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { createAISessionFromEnv } from '@nicholasosto/ai-tools';

/** Zod schema for the generate_text tool input. */
const GenerateTextInput = {
  prompt: z.string().describe('The text prompt to send to the model'),
  model: z.string().optional().describe('Override the model (e.g. "gpt-5-mini")'),
  instructions: z.string().optional().describe('System-level instructions for the model'),
  temperature: z.number().min(0).max(2).optional().describe('Sampling temperature (0-2)'),
  maxOutputTokens: z.number().optional().describe('Maximum tokens to generate'),
};

/**
 * Register the `generate_text` tool on the given MCP server.
 */
export function registerTextGenerationTool(server: McpServer): void {
  server.tool(
    'generate_text',
    'Generate text using OpenAI. Provide a prompt and optional model/temperature overrides.',
    GenerateTextInput,
    async ({ prompt, model, instructions, temperature, maxOutputTokens }) => {
      const session = createAISessionFromEnv();
      const result = await session.generateText(prompt, {
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
                text: result.text,
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
