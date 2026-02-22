/**
 * Local Asset Search Tool
 *
 * Searches the local assets folder for existing images that may match
 * a given entity or slot, so we can reuse them instead of generating new ones.
 *
 * Searches by:
 *   1. Exact suggestedFilename path from asset-map YAML
 *   2. Fuzzy keyword match across all image filenames
 */

import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { existsSync, readdirSync, statSync } from 'node:fs';
import { extname, join, relative, resolve } from 'node:path';
import { z } from 'zod';
import { getLocalAssetsDir } from '../config.js';
import { logger } from '../logger.js';

/** Image extensions we care about */
const IMAGE_EXTENSIONS = new Set(['.png', '.jpg', '.jpeg', '.webp']);

/**
 * Recursively collect all image file paths under a directory.
 */
function walkImages(dir: string, root: string): string[] {
  const results: string[] = [];
  if (!existsSync(dir)) return results;

  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...walkImages(fullPath, root));
    } else if (IMAGE_EXTENSIONS.has(extname(entry.name).toLowerCase())) {
      results.push(relative(root, fullPath));
    }
  }

  return results;
}

/**
 * Register the `search_local_assets` tool on the given MCP server.
 */
export function registerLocalAssetSearchTool(server: McpServer): void {
  server.tool(
    'search_local_assets',
    'Search the local assets/images/ folder for existing images. ' +
      'Use this BEFORE generating new images to check if a suitable asset already exists. ' +
      'Provide either an exact path (from asset-map suggestedFilename) or keywords to fuzzy match.',
    {
      exactPath: z
        .string()
        .optional()
        .describe(
          'Exact relative path to check (e.g. "abilities/bone-strike/icon.png"). ' +
            'Typically the suggestedFilename from asset-map YAML.',
        ),
      keywords: z
        .array(z.string())
        .optional()
        .describe(
          'Keywords to search filenames for (e.g. ["bone", "strike", "icon"]). ' +
            'Case-insensitive. Files matching ANY keyword are returned.',
        ),
      subfolder: z
        .string()
        .optional()
        .describe(
          'Restrict search to a specific subfolder under images/ ' +
            '(e.g. "icons", "characters-portraits", "abilities").',
        ),
    },
    async ({ exactPath, keywords, subfolder }) => {
      logger.toolCall('search_local_assets', { exactPath, keywords, subfolder });

      const assetsDir = getLocalAssetsDir();
      const imagesRoot = resolve(assetsDir, 'images');

      if (!existsSync(imagesRoot)) {
        return {
          content: [
            {
              type: 'text' as const,
              text: `❌ Local images directory not found: ${imagesRoot}`,
            },
          ],
        };
      }

      const results: string[] = [];

      // ── Check exact path ──────────────────────────────────────────
      if (exactPath) {
        const fullPath = resolve(imagesRoot, exactPath);
        if (existsSync(fullPath)) {
          const stat = statSync(fullPath);
          results.push(`✅ EXACT MATCH: ${exactPath} (${(stat.size / 1024).toFixed(1)} KB)`);
        } else {
          results.push(`❌ Not found at exact path: ${exactPath}`);
        }
      }

      // ── Keyword search ─────────────────────────────────────────────
      if (keywords && keywords.length > 0) {
        const searchDir = subfolder ? resolve(imagesRoot, subfolder) : imagesRoot;

        const allImages = walkImages(searchDir, imagesRoot);
        const lowerKeywords = keywords.map((k) => k.toLowerCase());

        const matches = allImages.filter((filePath) => {
          const lower = filePath.toLowerCase();
          return lowerKeywords.some((kw) => lower.includes(kw));
        });

        if (matches.length === 0) {
          results.push(
            `🔍 No keyword matches for [${keywords.join(', ')}]` +
              (subfolder ? ` in ${subfolder}/` : ''),
          );
        } else {
          results.push(`🔍 Found ${matches.length} match(es) for [${keywords.join(', ')}]:`);
          // Cap at 25 to avoid flooding
          for (const match of matches.slice(0, 25)) {
            const fullPath = resolve(imagesRoot, match);
            const stat = statSync(fullPath);
            results.push(`  📄 ${match} (${(stat.size / 1024).toFixed(1)} KB)`);
          }
          if (matches.length > 25) {
            results.push(`  … and ${matches.length - 25} more`);
          }
        }
      }

      // ── Fallback: list subfolder contents ──────────────────────────
      if (!exactPath && (!keywords || keywords.length === 0)) {
        const searchDir = subfolder ? resolve(imagesRoot, subfolder) : imagesRoot;

        const allImages = walkImages(searchDir, imagesRoot);

        results.push(
          `📁 ${allImages.length} image(s) in ${subfolder ? subfolder + '/' : 'images/'}:`,
        );
        for (const img of allImages.slice(0, 30)) {
          results.push(`  📄 ${img}`);
        }
        if (allImages.length > 30) {
          results.push(`  … and ${allImages.length - 30} more`);
        }
      }

      return {
        content: [
          {
            type: 'text' as const,
            text: results.join('\n'),
          },
        ],
      };
    },
  );
}
