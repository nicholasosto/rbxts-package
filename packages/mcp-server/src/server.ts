/**
 * @nicholasosto/mcp-server — Server Setup
 *
 * Creates and configures the MCP server with all tools registered.
 */

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { loadEnv } from '@nicholasosto/node-tools';
import { resolve } from 'node:path';
import {
  registerTextGenerationTool,
  registerImageGenerationTool,
  registerDatastoreTools,
  registerMessagingTools,
  registerAssetTools,
  registerInstanceTools,
  registerPackageInfoTools,
} from './tools/index.js';

/**
 * Create a fully configured MCP server instance with all tools registered.
 */
export function createServer(): McpServer {
  // Load .env — try cwd first (VS Code sets cwd to workspace root),
  // then fall back to __dirname-based resolution.
  const cwdEnv = resolve(process.cwd(), '.env');
  loadEnv(cwdEnv);

  const server = new McpServer({
    name: 'rbxts-mcp',
    version: '0.1.0',
  });

  // ─── Register Tools ────────────────────────────────────────────────────

  // AI / OpenAI tools
  registerTextGenerationTool(server);
  registerImageGenerationTool(server);

  // Roblox Open Cloud tools
  registerDatastoreTools(server);
  registerMessagingTools(server);
  registerAssetTools(server);
  registerInstanceTools(server);

  // Monorepo introspection tools
  registerPackageInfoTools(server);

  return server;
}
