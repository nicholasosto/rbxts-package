/**
 * Roblox MessagingService Tool
 *
 * Exposes Roblox Open Cloud MessagingService API as an MCP tool.
 * Docs: https://create.roblox.com/docs/cloud/reference/MessagingService
 */

import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { NumericId, getDefaultUniverseId } from '../config.js';
import { logger } from '../logger.js';
import {
  ROBLOX_CLOUD_BASE,
  robloxFetch,
  robloxHeaders,
  textContent,
  errorResponse,
} from '../roblox-helpers.js';

export function registerMessagingTools(server: McpServer): void {
  server.tool(
    'messaging_publish',
    'Publish a message to a Roblox MessagingService topic. All active game servers subscribed to the topic will receive it.',
    {
      topic: z.string().describe('The topic name to publish to'),
      message: z.string().describe('The message payload (string, max 1KB)'),
      universeId: NumericId.optional().describe(`Universe ID (defaults to env ROBLOX_UNIVERSE_ID)`),
    },
    async ({ topic, message, universeId }) => {
      logger.toolCall('messaging_publish', { topic, universeId });
      const uid = universeId ?? getDefaultUniverseId();
      const url = `${ROBLOX_CLOUD_BASE}/messaging-service/v1/universes/${uid}/topics/${encodeURIComponent(topic)}`;

      const res = await robloxFetch(url, {
        method: 'POST',
        headers: robloxHeaders(),
        body: JSON.stringify({ message }),
      });

      if (res.ok) {
        return {
          content: [textContent(`Message published to topic "${topic}" (universe ${uid}).`)],
        };
      }
      return errorResponse(res.status, res.body, url);
    },
  );
}
