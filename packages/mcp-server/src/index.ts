#!/usr/bin/env node
/**
 * @nicholasosto/mcp-server — stdio Entry Point
 *
 * Starts the MCP server using stdio transport for VS Code integration.
 *
 * Usage:
 *   npx tsx packages/mcp-server/src/index.ts   (dev)
 *   node dist/index.js                          (after build)
 */

import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { createServer } from './server.js';

async function main(): Promise<void> {
  const server = createServer();
  const transport = new StdioServerTransport();
  await server.connect(transport);

  // Log to stderr so we don't pollute the JSON-RPC channel on stdout
  console.error('[mcp-server] Started on stdio transport');
}

main().catch((err) => {
  console.error('[mcp-server] Fatal error:', err);
  process.exit(1);
});
