import nxPlugin from '@nx/eslint-plugin';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsparser from '@typescript-eslint/parser';

export default [
  // ── Global ignores ───────────────────────────────────────
  {
    ignores: [
      '**/node_modules/**',
      '**/out/**',
      '**/dist/**',
      '**/include/**',
      '**/.nx/**',
      '**/sourcemap.json',
    ],
  },

  // ── Base TypeScript rules (all packages) ─────────────────
  {
    files: ['packages/*/src/**/*.ts', 'packages/*/src/**/*.tsx'],
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
      '@nx': nxPlugin,
    },
    rules: {
      // ── Dead code detection ──────────────────────────────
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],

      // ── Type safety ──────────────────────────────────────
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports', fixStyle: 'inline-type-imports' },
      ],

      // ── Code quality ─────────────────────────────────────
      '@typescript-eslint/no-empty-function': 'warn',
      'no-empty': ['warn', { allowEmptyCatch: false }],
      'no-console': 'warn',
      'no-debugger': 'error',
      'prefer-const': 'error',
      eqeqeq: ['error', 'always'],
      'no-duplicate-imports': 'error',

      // ── Nx module boundaries ─────────────────────────────
      '@nx/enforce-module-boundaries': [
        'error',
        {
          enforceBuildableLibDependency: true,
          allow: [],
          depConstraints: [
            // Roblox packages cannot import Node packages
            {
              sourceTag: 'scope:roblox',
              onlyDependOnLibsWithTags: ['scope:roblox'],
            },
            // Node packages cannot import Roblox packages
            {
              sourceTag: 'scope:node',
              onlyDependOnLibsWithTags: ['scope:node'],
            },
            // Libraries cannot depend on applications
            {
              sourceTag: 'type:lib',
              onlyDependOnLibsWithTags: ['type:lib'],
            },
            // Applications can depend on libraries
            {
              sourceTag: 'type:app',
              onlyDependOnLibsWithTags: ['type:lib', 'type:app'],
            },
          ],
        },
      ],
    },
  },

  // ── Node.js packages override (allow console) ───────────
  {
    files: [
      'packages/mcp-server/src/**/*.ts',
      'packages/node-tools/src/**/*.ts',
      'packages/ai-tools/src/**/*.ts',
    ],
    rules: {
      'no-console': 'off',
    },
  },

  // ── Roblox-TS packages override ─────────────────────────
  {
    files: [
      'packages/assets/src/**/*.ts',
      'packages/combat-stats/src/**/*.ts',
      'packages/timer/src/**/*.ts',
      'packages/name-generator/src/**/*.ts',
      'packages/ultra-ui/src/**/*.ts',
      'packages/ultra-ui/src/**/*.tsx',
      'packages/game-test/src/**/*.ts',
      'packages/game-test/src/**/*.tsx',
    ],
    rules: {
      // Roblox-TS uses print() not console.log()
      'no-console': 'error',
      // Roblox APIs sometimes require any
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },

  // ── Test files override ─────────────────────────────────
  {
    files: ['**/*.test.ts', '**/*.spec.ts', '**/__tests__/**/*.ts'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      'no-console': 'off',
      '@typescript-eslint/no-empty-function': 'off',
    },
  },
];
