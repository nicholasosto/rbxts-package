/**
 * Package Info Tool
 *
 * Introspect the monorepo packages — list them, read their exports, types, etc.
 */

import { z } from 'zod';
import { readdir, readFile } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
/** Path to the monorepo packages/ directory. */
const PACKAGES_DIR = resolve(__dirname, '..', '..', '..');

/**
 * Safely read a file, returning null if it doesn't exist.
 */
async function safeReadFile(path: string): Promise<string | null> {
  try {
    return await readFile(path, 'utf-8');
  } catch {
    return null;
  }
}

export function registerPackageInfoTools(server: McpServer): void {
  // ── List Packages ────────────────────────────────────────────────────

  server.tool(
    'list_packages',
    'List all packages in the monorepo with their names, descriptions, and dependencies.',
    {},
    async () => {
      const entries = await readdir(PACKAGES_DIR, { withFileTypes: true });
      const packages: Array<Record<string, unknown>> = [];

      for (const entry of entries) {
        if (!entry.isDirectory()) continue;

        const pkgJsonPath = resolve(PACKAGES_DIR, entry.name, 'package.json');
        const raw = await safeReadFile(pkgJsonPath);
        if (!raw) continue;

        try {
          const pkg = JSON.parse(raw);
          packages.push({
            folder: entry.name,
            name: pkg.name,
            version: pkg.version,
            description: pkg.description ?? '',
            dependencies: Object.keys(pkg.dependencies ?? {}),
            devDependencies: Object.keys(pkg.devDependencies ?? {}),
            type: pkg.type ?? 'commonjs',
          });
        } catch {
          // skip invalid package.json
        }
      }

      return {
        content: [
          {
            type: 'text' as const,
            text: JSON.stringify(packages, null, 2),
          },
        ],
      };
    },
  );

  // ── Get Package Exports ──────────────────────────────────────────────

  server.tool(
    'get_package_exports',
    'Read the barrel index.ts file of a package to see what it exports.',
    {
      packageName: z
        .string()
        .describe('Folder name of the package (e.g. "ai-tools", "combat-stats")'),
    },
    async ({ packageName }) => {
      const indexPath = resolve(PACKAGES_DIR, packageName, 'src', 'index.ts');
      const content = await safeReadFile(indexPath);

      if (!content) {
        return {
          content: [
            { type: 'text' as const, text: `No index.ts found for package "${packageName}".` },
          ],
        };
      }

      return {
        content: [{ type: 'text' as const, text: content }],
      };
    },
  );

  // ── Get Package Types ────────────────────────────────────────────────

  server.tool(
    'get_package_types',
    'Read the types.ts file of a package to see its type definitions.',
    {
      packageName: z
        .string()
        .describe('Folder name of the package (e.g. "ai-tools", "combat-stats")'),
    },
    async ({ packageName }) => {
      const typesPath = resolve(PACKAGES_DIR, packageName, 'src', 'types.ts');
      const content = await safeReadFile(typesPath);

      if (!content) {
        return {
          content: [
            { type: 'text' as const, text: `No types.ts found for package "${packageName}".` },
          ],
        };
      }

      return {
        content: [{ type: 'text' as const, text: content }],
      };
    },
  );

  // ── Get Package File ─────────────────────────────────────────────────

  server.tool(
    'get_package_file',
    'Read any source file from a package by relative path.',
    {
      packageName: z.string().describe('Folder name of the package (e.g. "ai-tools")'),
      filePath: z.string().describe('Relative path within the package (e.g. "src/defaults.ts")'),
    },
    async ({ packageName, filePath }) => {
      // Prevent directory traversal
      if (filePath.includes('..')) {
        return {
          content: [{ type: 'text' as const, text: 'Error: path traversal is not allowed.' }],
        };
      }

      const fullPath = resolve(PACKAGES_DIR, packageName, filePath);
      const content = await safeReadFile(fullPath);

      if (!content) {
        return {
          content: [{ type: 'text' as const, text: `File not found: ${packageName}/${filePath}` }],
        };
      }

      return {
        content: [{ type: 'text' as const, text: content }],
      };
    },
  );
}
