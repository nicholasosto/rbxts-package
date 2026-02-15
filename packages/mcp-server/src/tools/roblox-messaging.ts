/**
 * Roblox MessagingService Tool
 *
 * Exposes Roblox Open Cloud MessagingService API as an MCP tool.
 * Docs: https://create.roblox.com/docs/cloud/reference/MessagingService
 */

import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { getRobloxCloudConfig } from '@nicholasosto/node-tools';
import { ROBLOX_CLOUD_BASE, DEFAULT_UNIVERSE_ID, robloxHeaders } from '../types.js';

export function registerMessagingTools(server: McpServer): void {
  const { apiKey } = getRobloxCloudConfig();

  server.tool(
    'messaging_publish',
    'Publish a message to a Roblox MessagingService topic. All active game servers subscribed to the topic will receive it.',
    {
      topic: z.string().describe('The topic name to publish to'),
      message: z.string().describe('The message payload (string, max 1KB)'),
      universeId: z
        .string()
        .optional()
        .describe(`Universe ID (defaults to ${DEFAULT_UNIVERSE_ID})`),
    },
    async ({ topic, message, universeId }) => {
      const uid = universeId ?? DEFAULT_UNIVERSE_ID;
      const url = `${ROBLOX_CLOUD_BASE}/messaging-service/v1/universes/${uid}/topics/${encodeURIComponent(topic)}`;

      const res = await fetch(url, {
        method: 'POST',
        headers: robloxHeaders(apiKey),
        body: JSON.stringify({ message }),
      });

      if (res.ok) {
        return {
          content: [
            {
              type: 'text' as const,
              text: `Message published to topic "${topic}" (universe ${uid}).`,
            },
          ],
        };
      }

      const body = await res.text();
      return {
        content: [{ type: 'text' as const, text: `Error ${res.status}: ${body}` }],
      };
    },
  );
}
