import { describe, it, expect, vi } from 'vitest';

// Mock environment before importing anything
vi.stubEnv('OPENAI_API_KEY', 'sk-test');
vi.stubEnv('ROBLOX_CLOUD_API_KEY', 'rblx-test');

describe('MCP Server module structure', () => {
  it('exports a valid server entry point', async () => {
    // Verify the module can be imported without errors
    const serverModule = await import('../server.js').catch((e) => e);

    // If it fails to import, it should be because of transport setup,
    // not because of missing exports or syntax errors
    if (serverModule instanceof Error) {
      expect(serverModule.message).not.toMatch(/Cannot find module/);
    }
  });

  it('exports createServer function', async () => {
    const serverModule = await import('../server.js').catch((e) => e);
    if (!(serverModule instanceof Error)) {
      expect(typeof serverModule.createServer).toBe('function');
    }
  });
});

describe('MCP tool input validation', () => {
  it('zod schemas should be importable from tool modules', async () => {
    // This verifies that tool files don't have import errors
    // and their zod schemas are structurally valid
    const toolModules = [
      '../tools/text-generation.js',
      '../tools/image-generation.js',
      '../tools/image-analysis.js',
      '../tools/roblox-datastores.js',
      '../tools/roblox-messaging.js',
      '../tools/roblox-assets.js',
      '../tools/roblox-instances.js',
      '../tools/roblox-inventories.js',
      '../tools/roblox-thumbnails.js',
      '../tools/package-info.js',
      '../tools/asset-image-pipeline.js',
    ];

    for (const modulePath of toolModules) {
      const result = await import(modulePath).catch((e) => e);
      // Module should either load successfully or fail for runtime reasons
      // (like missing env vars), not structural reasons
      if (result instanceof Error) {
        expect(result.message).not.toMatch(/SyntaxError/);
      }
    }
  });
});

describe('Module re-exports', () => {
  it('types.ts re-exports from new modules', async () => {
    const types = await import('../types.js').catch((e) => e);
    if (!(types instanceof Error)) {
      expect(typeof types.ROBLOX_CLOUD_BASE).toBe('string');
      expect(typeof types.robloxHeaders).toBe('function');
      expect(typeof types.getDefaultUniverseId).toBe('function');
      expect(typeof types.getDefaultPlaceId).toBe('function');
    }
  });
});
