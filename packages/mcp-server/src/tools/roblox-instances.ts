/**
 * Roblox Engine (Instance) Tools
 *
 * Exposes Roblox Open Cloud Engine API operations as MCP tools.
 * Lets you read, list, update, and create instances in a place's data model.
 *
 * Docs: https://create.roblox.com/docs/cloud/reference/Engine
 *
 * NOTE: The Engine API is eventually-consistent. Reads may not reflect the
 * very latest state if the place was just published.
 */

import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { getRobloxCloudConfig } from '@nicholasosto/node-tools';
import {
  ROBLOX_CLOUD_BASE,
  DEFAULT_UNIVERSE_ID,
  DEFAULT_PLACE_ID,
  robloxHeaders,
} from '../types.js';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyJson = Record<string, any>;

// ─── Helpers ───────────────────────────────────────────────────────────────────

/**
 * Build an Engine API URL for instances.
 * Format: /cloud/v2/universes/{uid}/places/{pid}/instances/{instanceId}
 */
function instanceUrl(universeId: string, placeId: string, path: string): string {
  return `${ROBLOX_CLOUD_BASE}/cloud/v2/universes/${universeId}/places/${placeId}${path}`;
}

/**
 * The Engine API returns long-running operations for reads.
 * We poll until the operation is done or timeout.
 */
async function pollOperation(
  operationPath: string,
  apiKey: string,
  maxAttempts = 10,
  delayMs = 1000,
): Promise<{ done: boolean; response?: unknown; error?: unknown }> {
  // The operation path from the API is like "universes/.../operations/..."
  // The polling endpoint is: https://apis.roblox.com/cloud/v2/{operationPath}
  const cleanPath = operationPath.replace(/^\//, '');
  const url = `${ROBLOX_CLOUD_BASE}/cloud/v2/${cleanPath}`;

  for (let i = 0; i < maxAttempts; i++) {
    const res = await fetch(url, { headers: robloxHeaders(apiKey) });
    const body = (await res.json()) as AnyJson;

    if (!res.ok) {
      return { done: true, error: `Error ${res.status}: ${JSON.stringify(body)}` };
    }

    if (body.done) {
      return { done: true, response: body.response };
    }

    // Wait before polling again
    await new Promise((resolve) => setTimeout(resolve, delayMs));
  }

  return { done: false, error: 'Operation timed out after polling' };
}

// ─── Tools ─────────────────────────────────────────────────────────────────────

export function registerInstanceTools(server: McpServer): void {
  const { apiKey } = getRobloxCloudConfig();

  // ── Get Instance ─────────────────────────────────────────────────────

  server.tool(
    'instance_get',
    'Get a specific instance from a Roblox place by its instance ID. Returns the instance properties and metadata. The root instance ID is typically obtained from instance_list_children.',
    {
      instanceId: z.string().describe('The instance ID to retrieve'),
      universeId: z
        .string()
        .optional()
        .describe(`Universe ID (defaults to ${DEFAULT_UNIVERSE_ID})`),
      placeId: z.string().optional().describe(`Place ID (defaults to ${DEFAULT_PLACE_ID})`),
    },
    async ({ instanceId, universeId, placeId }) => {
      const uid = universeId ?? DEFAULT_UNIVERSE_ID;
      const pid = placeId ?? DEFAULT_PLACE_ID;

      const url = instanceUrl(uid, pid, `/instances/${instanceId}`);
      const res = await fetch(url, { headers: robloxHeaders(apiKey) });
      const body = (await res.json()) as AnyJson;

      // Engine API returns an Operation for GET — poll it
      if (!res.ok) {
        return {
          content: [
            { type: 'text' as const, text: `Error ${res.status}: ${JSON.stringify(body)}` },
          ],
        };
      }

      // Engine API returns an Operation for GET — poll it
      if (body.path && !body.done) {
        const result = await pollOperation(body.path, apiKey);
        return {
          content: [
            {
              type: 'text' as const,
              text: JSON.stringify(result.response ?? result.error, null, 2),
            },
          ],
        };
      }

      // If it's a direct response or already done
      if (body.done && body.response) {
        return {
          content: [{ type: 'text' as const, text: JSON.stringify(body.response, null, 2) }],
        };
      }

      return {
        content: [{ type: 'text' as const, text: JSON.stringify(body, null, 2) }],
      };
    },
  );

  // ── List Children ────────────────────────────────────────────────────

  server.tool(
    'instance_list_children',
    'List child instances of a parent instance in a Roblox place. Use "root" as the instanceId to list top-level services (Workspace, ServerStorage, ReplicatedStorage, etc.).',
    {
      instanceId: z
        .string()
        .default('root')
        .describe('Parent instance ID ("root" for top-level DataModel children)'),
      universeId: z
        .string()
        .optional()
        .describe(`Universe ID (defaults to ${DEFAULT_UNIVERSE_ID})`),
      placeId: z.string().optional().describe(`Place ID (defaults to ${DEFAULT_PLACE_ID})`),
      pageToken: z.string().optional().describe('Pagination token from a previous response'),
    },
    async ({ instanceId, universeId, placeId, pageToken }) => {
      const uid = universeId ?? DEFAULT_UNIVERSE_ID;
      const pid = placeId ?? DEFAULT_PLACE_ID;

      // "root" is a valid pseudo-ID for the DataModel root per Roblox docs
      const basePath = `/instances/${instanceId}:listChildren`;

      const params = new URLSearchParams();
      if (pageToken) params.set('pageToken', pageToken);
      const qs = params.toString();
      const url = instanceUrl(uid, pid, `${basePath}${qs ? `?${qs}` : ''}`);

      const res = await fetch(url, { headers: robloxHeaders(apiKey) });
      const body = (await res.json()) as AnyJson;

      if (!res.ok) {
        return {
          content: [
            { type: 'text' as const, text: `Error ${res.status}: ${JSON.stringify(body)}` },
          ],
        };
      }

      // Engine API returns an Operation — poll it
      if (body.path && !body.done) {
        const result = await pollOperation(body.path, apiKey);
        if (result.response) {
          return {
            content: [{ type: 'text' as const, text: JSON.stringify(result.response, null, 2) }],
          };
        }
        return {
          content: [{ type: 'text' as const, text: JSON.stringify(result.error, null, 2) }],
        };
      }

      // Done immediately or direct response
      if (body.done && body.response) {
        return {
          content: [{ type: 'text' as const, text: JSON.stringify(body.response, null, 2) }],
        };
      }

      return {
        content: [{ type: 'text' as const, text: JSON.stringify(body, null, 2) }],
      };
    },
  );

  // ── Update Instance ──────────────────────────────────────────────────

  server.tool(
    'instance_update',
    'Update properties of an existing instance in a Roblox place. Provide the property changes as a JSON object mapping property names to their new values. Property values use the Engine API format (e.g., { "Name": { "stringValue": "NewName" } }).',
    {
      instanceId: z.string().describe('The instance ID to update'),
      propertyUpdates: z
        .string()
        .describe(
          'JSON string of property updates in Engine API format. Example: {"Name":{"stringValue":"MyPart"},"Anchored":{"boolValue":true}}',
        ),
      universeId: z
        .string()
        .optional()
        .describe(`Universe ID (defaults to ${DEFAULT_UNIVERSE_ID})`),
      placeId: z.string().optional().describe(`Place ID (defaults to ${DEFAULT_PLACE_ID})`),
    },
    async ({ instanceId, propertyUpdates, universeId, placeId }) => {
      const uid = universeId ?? DEFAULT_UNIVERSE_ID;
      const pid = placeId ?? DEFAULT_PLACE_ID;

      let parsedProperties: Record<string, unknown>;
      try {
        parsedProperties = JSON.parse(propertyUpdates);
      } catch {
        return {
          content: [{ type: 'text' as const, text: 'Error: propertyUpdates must be valid JSON' }],
        };
      }

      const propertyNames = Object.keys(parsedProperties);
      const updateMask = propertyNames.map((p) => `engineInstance.propertyData.${p}`).join(',');

      const url = instanceUrl(
        uid,
        pid,
        `/instances/${instanceId}?updateMask=${encodeURIComponent(updateMask)}`,
      );

      const body = {
        engineInstance: {
          propertyData: parsedProperties,
        },
      };

      const res = await fetch(url, {
        method: 'PATCH',
        headers: robloxHeaders(apiKey),
        body: JSON.stringify(body),
      });
      const responseBody = (await res.json()) as AnyJson;

      if (!res.ok) {
        return {
          content: [
            { type: 'text' as const, text: `Error ${res.status}: ${JSON.stringify(responseBody)}` },
          ],
        };
      }

      // Poll if operation
      if (responseBody.path && !responseBody.done) {
        const result = await pollOperation(responseBody.path, apiKey);
        return {
          content: [
            {
              type: 'text' as const,
              text: JSON.stringify(result.response ?? result.error, null, 2),
            },
          ],
        };
      }

      return {
        content: [
          {
            type: 'text' as const,
            text: responseBody.done
              ? JSON.stringify(responseBody.response, null, 2)
              : JSON.stringify(responseBody, null, 2),
          },
        ],
      };
    },
  );

  // ── Create Instance ──────────────────────────────────────────────────

  server.tool(
    'instance_create',
    'Create a new instance as a child of an existing instance in a Roblox place. Specify the class name and initial properties.',
    {
      parentInstanceId: z.string().describe('The instance ID of the parent to create under'),
      className: z
        .string()
        .describe('Roblox class name (e.g., "Part", "Model", "Folder", "StringValue")'),
      properties: z
        .string()
        .optional()
        .describe(
          'Optional JSON string of initial properties in Engine API format. Example: {"Name":{"stringValue":"MyPart"},"Anchored":{"boolValue":true}}',
        ),
      universeId: z
        .string()
        .optional()
        .describe(`Universe ID (defaults to ${DEFAULT_UNIVERSE_ID})`),
      placeId: z.string().optional().describe(`Place ID (defaults to ${DEFAULT_PLACE_ID})`),
    },
    async ({ parentInstanceId, className, properties, universeId, placeId }) => {
      const uid = universeId ?? DEFAULT_UNIVERSE_ID;
      const pid = placeId ?? DEFAULT_PLACE_ID;

      let parsedProperties: Record<string, unknown> = {};
      if (properties) {
        try {
          parsedProperties = JSON.parse(properties);
        } catch {
          return {
            content: [{ type: 'text' as const, text: 'Error: properties must be valid JSON' }],
          };
        }
      }

      const url = instanceUrl(uid, pid, `/instances/${parentInstanceId}:createInstance`);

      const body = {
        engineInstance: {
          details: { [className]: {} },
          propertyData: parsedProperties,
        },
      };

      const res = await fetch(url, {
        method: 'POST',
        headers: robloxHeaders(apiKey),
        body: JSON.stringify(body),
      });
      const responseBody = (await res.json()) as AnyJson;

      if (!res.ok) {
        return {
          content: [
            { type: 'text' as const, text: `Error ${res.status}: ${JSON.stringify(responseBody)}` },
          ],
        };
      }

      // Poll if operation
      if (responseBody.path && !responseBody.done) {
        const result = await pollOperation(responseBody.path, apiKey);
        return {
          content: [
            {
              type: 'text' as const,
              text: JSON.stringify(result.response ?? result.error, null, 2),
            },
          ],
        };
      }

      return {
        content: [
          {
            type: 'text' as const,
            text: responseBody.done
              ? JSON.stringify(responseBody.response, null, 2)
              : JSON.stringify(responseBody, null, 2),
          },
        ],
      };
    },
  );

  // ── Delete Instance ──────────────────────────────────────────────────

  server.tool(
    'instance_delete',
    'Delete an instance from a Roblox place. WARNING: This permanently removes the instance and all its descendants.',
    {
      instanceId: z.string().describe('The instance ID to delete'),
      universeId: z
        .string()
        .optional()
        .describe(`Universe ID (defaults to ${DEFAULT_UNIVERSE_ID})`),
      placeId: z.string().optional().describe(`Place ID (defaults to ${DEFAULT_PLACE_ID})`),
    },
    async ({ instanceId, universeId, placeId }) => {
      const uid = universeId ?? DEFAULT_UNIVERSE_ID;
      const pid = placeId ?? DEFAULT_PLACE_ID;

      const url = instanceUrl(uid, pid, `/instances/${instanceId}`);

      const res = await fetch(url, {
        method: 'DELETE',
        headers: robloxHeaders(apiKey),
      });

      if (res.status === 204 || res.ok) {
        return {
          content: [
            { type: 'text' as const, text: `Instance ${instanceId} deleted successfully.` },
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
