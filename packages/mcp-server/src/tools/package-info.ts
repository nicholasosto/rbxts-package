/**
 * Package Info Tool
 *
 * Introspect the monorepo packages — list them, read their exports, types, etc.
 */

import { z } from 'zod';
import { readdir, readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { existsSync } from 'node:fs';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { logger } from '../logger.js';
import { textContent } from '../roblox-helpers.js';

/**
 * Resolve the monorepo packages directory.
 *
 * Checks (in order):
 * 1. MONOREPO_PACKAGES_DIR env var (explicit override)
 * 2. <cwd>/packages/ (typical for VS Code workspace root)
 * 3. Three levels up from __dirname (compiled dist/tools/ location)
 *
 * Falls back to cwd/packages if nothing matches.
 */
function resolvePackagesDir(): string {
  // 1. Explicit env var
  if (process.env.MONOREPO_PACKAGES_DIR) {
    return process.env.MONOREPO_PACKAGES_DIR;
  }

  // 2. cwd-based (VS Code sets cwd to workspace root)
  const cwdPackages = resolve(process.cwd(), 'packages');
  if (existsSync(cwdPackages)) {
    return cwdPackages;
  }

  // 3. __dirname-based (compiled location fallback)
  // import.meta.url not available at function call time, so use cwd fallback
  const fallback = cwdPackages;
  logger.warn(
    'package-info',
    `Could not locate packages dir at ${cwdPackages}, using fallback: ${fallback}`,
  );
  return fallback;
}

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
      logger.toolCall('list_packages');
      const packagesDir = resolvePackagesDir();
      const entries = await readdir(packagesDir, { withFileTypes: true });
      const packages: Array<Record<string, unknown>> = [];

      for (const entry of entries) {
        if (!entry.isDirectory()) continue;

        const pkgJsonPath = resolve(packagesDir, entry.name, 'package.json');
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
        content: [textContent(JSON.stringify(packages, null, 2))],
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
      logger.toolCall('get_package_exports', { packageName });
      const packagesDir = resolvePackagesDir();
      const indexPath = resolve(packagesDir, packageName, 'src', 'index.ts');
      const content = await safeReadFile(indexPath);

      if (!content) {
        return {
          content: [textContent(`No index.ts found for package "${packageName}".`)],
        };
      }

      return { content: [textContent(content)] };
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
      logger.toolCall('get_package_types', { packageName });
      const packagesDir = resolvePackagesDir();
      const typesPath = resolve(packagesDir, packageName, 'src', 'types.ts');
      const content = await safeReadFile(typesPath);

      if (!content) {
        return {
          content: [textContent(`No types.ts found for package "${packageName}".`)],
        };
      }

      return { content: [textContent(content)] };
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
      logger.toolCall('get_package_file', { packageName, filePath });

      // Prevent directory traversal
      if (filePath.includes('..')) {
        return {
          content: [textContent('Error: path traversal is not allowed.')],
        };
      }

      const packagesDir = resolvePackagesDir();
      const fullPath = resolve(packagesDir, packageName, filePath);
      const content = await safeReadFile(fullPath);

      if (!content) {
        return {
          content: [textContent(`File not found: ${packageName}/${filePath}`)],
        };
      }

      return { content: [textContent(content)] };
    },
  );
}
