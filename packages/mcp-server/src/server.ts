/**
 * @nicholasosto/mcp-server — Server Setup
 *
 * Creates and configures the MCP server with all tools registered.
 */

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { loadEnv } from '@nicholasosto/node-tools';
import { resolve } from 'node:path';
import { validateEnvironment } from './config.js';
import { logger } from './logger.js';
import {
  registerAssetImagePipelineTool,
  registerAssetTools,
  registerDatastoreTools,
  registerGameDocsTools,
  registerImageAnalysisTool,
  registerImageGenerationTool,
  registerInstanceTools,
  registerInventoryTools,
  registerLocalImageGenerationTool,
  registerMessagingTools,
  registerPackageInfoTools,
  registerTextGenerationTool,
  registerThumbnailTools,
} from './tools/index.js';

/**
 * Create a fully configured MCP server instance with all tools registered.
 */
export function createServer(): McpServer {
  // Load .env — try cwd first (VS Code sets cwd to workspace root),
  // then fall back to __dirname-based resolution.
  const cwdEnv = resolve(process.cwd(), '.env');
  loadEnv(cwdEnv);

  // Validate environment and log warnings/errors
  const env = validateEnvironment();
  for (const warning of env.warnings) {
    logger.warn('config', warning);
  }
  for (const error of env.errors) {
    logger.error('config', error);
  }
  if (!env.valid) {
    logger.error(
      'config',
      'Server starting with missing required environment variables. Some tools will fail.',
    );
  }

  const server = new McpServer({
    name: 'rbxts-mcp',
    version: '0.1.0',
  });

  // ─── Register Tools ────────────────────────────────────────────────────

  // AI / OpenAI tools
  registerTextGenerationTool(server);
  registerImageGenerationTool(server);
  registerImageAnalysisTool(server);

  // Asset image pipeline (generate → upload combined)
  registerAssetImagePipelineTool(server);

  // Local image generation (generate → save to local assets folder)
  registerLocalImageGenerationTool(server);

  // Roblox Open Cloud tools
  registerDatastoreTools(server);
  registerMessagingTools(server);
  registerAssetTools(server);
  registerInstanceTools(server);
  registerInventoryTools(server);
  registerThumbnailTools(server);

  // Monorepo introspection tools
  registerPackageInfoTools(server);

  // Game documentation tools
  registerGameDocsTools(server);

  logger.info('server', `Registered tools on rbxts-mcp v0.1.0`);

  return server;
}
