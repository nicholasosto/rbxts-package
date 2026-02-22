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
import { NumericId, getDefaultUniverseId, getDefaultPlaceId } from '../config.js';
import { logger } from '../logger.js';
import {
  ROBLOX_CLOUD_BASE,
  robloxFetch,
  robloxHeaders,
  pollOperation,
  textContent,
  errorResponse,
  jsonResponse,
} from '../roblox-helpers.js';

// ─── Helpers ───────────────────────────────────────────────────────────────────

/**
 * Build an Engine API URL for instances.
 * Format: /cloud/v2/universes/{uid}/places/{pid}/instances/{instanceId}
 */
function instanceUrl(universeId: string, placeId: string, path: string): string {
  return `${ROBLOX_CLOUD_BASE}/cloud/v2/universes/${universeId}/places/${placeId}${path}`;
}

/**
 * Handle an Engine API response that may be an async operation.
 * Returns the final resolved data as a JSON content block.
 */
async function handleEngineResponse(res: {
  ok: boolean;
  status: number;
  body: string;
  json?: unknown;
}): Promise<{ content: Array<{ type: 'text'; text: string }> }> {
  if (!res.ok) {
    return errorResponse(res.status, res.body);
  }

  const body = res.json as Record<string, unknown> | undefined;

  // Engine API returns an Operation for many calls — poll it
  if (body?.path && !body.done) {
    const result = await pollOperation(body.path as string);
    if (result.response) {
      return jsonResponse(result.response);
    }
    return { content: [textContent(result.error ?? 'Operation failed')] };
  }

  // Already done
  if (body?.done && body.response) {
    return jsonResponse(body.response);
  }

  return jsonResponse(body);
}

// ─── Common Schemas ────────────────────────────────────────────────────────────

const universeIdSchema = NumericId.optional().describe(
  `Universe ID (defaults to env ROBLOX_UNIVERSE_ID)`,
);
const placeIdSchema = NumericId.optional().describe(`Place ID (defaults to env ROBLOX_PLACE_ID)`);

// ─── Tools ─────────────────────────────────────────────────────────────────────

export function registerInstanceTools(server: McpServer): void {
  // ── Get Instance ─────────────────────────────────────────────────────

  server.tool(
    'instance_get',
    'Get a specific instance from a Roblox place by its instance ID. Returns the instance properties and metadata. The root instance ID is typically obtained from instance_list_children.',
    {
      instanceId: z.string().describe('The instance ID to retrieve'),
      universeId: universeIdSchema,
      placeId: placeIdSchema,
    },
    async ({ instanceId, universeId, placeId }) => {
      logger.toolCall('instance_get', { instanceId, universeId });
      const uid = universeId ?? getDefaultUniverseId();
      const pid = placeId ?? getDefaultPlaceId();

      const url = instanceUrl(uid, pid, `/instances/${instanceId}`);
      const res = await robloxFetch(url);

      return handleEngineResponse(res);
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
      universeId: universeIdSchema,
      placeId: placeIdSchema,
      pageToken: z.string().optional().describe('Pagination token from a previous response'),
    },
    async ({ instanceId, universeId, placeId, pageToken }) => {
      logger.toolCall('instance_list_children', { instanceId, universeId });
      const uid = universeId ?? getDefaultUniverseId();
      const pid = placeId ?? getDefaultPlaceId();

      const basePath = `/instances/${instanceId}:listChildren`;
      const params = new URLSearchParams();
      if (pageToken) params.set('pageToken', pageToken);
      const qs = params.toString();
      const url = instanceUrl(uid, pid, `${basePath}${qs ? `?${qs}` : ''}`);

      const res = await robloxFetch(url);

      return handleEngineResponse(res);
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
      universeId: universeIdSchema,
      placeId: placeIdSchema,
    },
    async ({ instanceId, propertyUpdates, universeId, placeId }) => {
      logger.toolCall('instance_update', { instanceId, universeId });
      const uid = universeId ?? getDefaultUniverseId();
      const pid = placeId ?? getDefaultPlaceId();

      let parsedProperties: Record<string, unknown>;
      try {
        parsedProperties = JSON.parse(propertyUpdates);
      } catch {
        return { content: [textContent('Error: propertyUpdates must be valid JSON')] };
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

      const res = await robloxFetch(url, {
        method: 'PATCH',
        headers: robloxHeaders(),
        body: JSON.stringify(body),
      });

      return handleEngineResponse(res);
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
      universeId: universeIdSchema,
      placeId: placeIdSchema,
    },
    async ({ parentInstanceId, className, properties, universeId, placeId }) => {
      logger.toolCall('instance_create', { parentInstanceId, className, universeId });
      const uid = universeId ?? getDefaultUniverseId();
      const pid = placeId ?? getDefaultPlaceId();

      let parsedProperties: Record<string, unknown> = {};
      if (properties) {
        try {
          parsedProperties = JSON.parse(properties);
        } catch {
          return { content: [textContent('Error: properties must be valid JSON')] };
        }
      }

      const url = instanceUrl(uid, pid, `/instances/${parentInstanceId}:createInstance`);

      const body = {
        engineInstance: {
          details: { [className]: {} },
          propertyData: parsedProperties,
        },
      };

      const res = await robloxFetch(url, {
        method: 'POST',
        headers: robloxHeaders(),
        body: JSON.stringify(body),
      });

      return handleEngineResponse(res);
    },
  );

  // ── Delete Instance ──────────────────────────────────────────────────

  server.tool(
    'instance_delete',
    'Delete an instance from a Roblox place. WARNING: This permanently removes the instance and all its descendants.',
    {
      instanceId: z.string().describe('The instance ID to delete'),
      universeId: universeIdSchema,
      placeId: placeIdSchema,
    },
    async ({ instanceId, universeId, placeId }) => {
      logger.toolCall('instance_delete', { instanceId, universeId });
      const uid = universeId ?? getDefaultUniverseId();
      const pid = placeId ?? getDefaultPlaceId();

      const url = instanceUrl(uid, pid, `/instances/${instanceId}`);
      const res = await robloxFetch(url, { method: 'DELETE' });

      if (res.status === 204 || res.ok) {
        return { content: [textContent(`Instance ${instanceId} deleted successfully.`)] };
      }
      return errorResponse(res.status, res.body, url);
    },
  );
}
