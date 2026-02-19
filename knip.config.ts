import type { KnipConfig } from 'knip';

const config: KnipConfig = {
  workspaces: {
    // ── Node.js packages (fully analyzable) ────────────────
    'packages/node-tools': {
      entry: ['src/index.ts'],
      project: ['src/**/*.ts'],
    },
    'packages/ai-tools': {
      entry: ['src/index.ts'],
      project: ['src/**/*.ts'],
    },
    'packages/mcp-server': {
      entry: ['src/index.ts'],
      project: ['src/**/*.ts'],
    },

    // ── Roblox-TS packages (limited analysis — compiled to Lua) ──
    // These use rbxtsc and Roblox-specific imports that knip can't resolve,
    // so we only check for unused exports and files within each package.
    'packages/assets': {
      entry: ['src/index.ts'],
      project: ['src/**/*.ts'],
      ignoreDependencies: [
        '@rbxts/*',
        '@flamework/*',
        'roblox-ts',
        '@rbxts-js/*',
        'rbxts-transformer-flamework',
      ],
    },
    'packages/combat-stats': {
      entry: ['src/index.ts'],
      project: ['src/**/*.ts'],
      ignoreDependencies: [
        '@rbxts/*',
        '@flamework/*',
        'roblox-ts',
        '@rbxts-js/*',
        'rbxts-transformer-flamework',
      ],
    },
    'packages/timer': {
      entry: ['src/index.ts'],
      project: ['src/**/*.ts'],
      ignoreDependencies: [
        '@rbxts/*',
        '@flamework/*',
        'roblox-ts',
        '@rbxts-js/*',
        'rbxts-transformer-flamework',
      ],
    },
    'packages/name-generator': {
      entry: ['src/index.ts'],
      project: ['src/**/*.ts'],
      ignoreDependencies: [
        '@rbxts/*',
        '@flamework/*',
        'roblox-ts',
        '@rbxts-js/*',
        'rbxts-transformer-flamework',
      ],
    },
    'packages/rpg-ui-bars': {
      entry: ['src/index.ts'],
      project: ['src/**/*.{ts,tsx}'],
      ignoreDependencies: [
        '@rbxts/*',
        '@flamework/*',
        'roblox-ts',
        '@rbxts-js/*',
        'rbxts-transformer-flamework',
      ],
    },

    // ── Game test (app — consumed but not published) ───────
    'packages/game-test': {
      entry: ['src/client/main.client.ts', 'src/server/main.server.ts'],
      project: ['src/**/*.{ts,tsx}'],
      ignoreDependencies: [
        '@rbxts/*',
        '@flamework/*',
        'roblox-ts',
        '@rbxts-js/*',
        'rbxts-transformer-flamework',
      ],
    },
  },

  // ── Global ignores ───────────────────────────────────────
  ignore: ['**/out/**', '**/dist/**', '**/include/**'],
  ignoreDependencies: ['@nx/*', 'simple-git-hooks', 'lint-staged'],
};

export default config;
