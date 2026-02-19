import { defineWorkspace } from 'vitest/config';

export default defineWorkspace([
  // Only Node.js packages are testable with Vitest
  // Roblox-TS packages compile to Lua and need Roblox-specific testing
  'packages/node-tools',
  'packages/ai-tools',
  'packages/mcp-server',
]);
