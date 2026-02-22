/**
 * Game Docs Tools
 *
 * MCP tools for reading, writing, validating, and searching game documentation
 * stored in the game-docs/soul-steel/ directory as YAML + Markdown pairs.
 */

import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { existsSync } from 'node:fs';
import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import { basename, resolve } from 'node:path';
import { z } from 'zod';
import { getGameDocsRoot } from '../config.js';
import { logger } from '../logger.js';
import { jsonResponse, textContent } from '../roblox-helpers.js';

// ─── Path Resolution ────────────────────────────────────────────────────────

/**
 * Resolve the game-docs root directory via centralized config.
 */
function resolveGameDocsRoot(): string {
  return getGameDocsRoot();
}

const VALID_CATEGORIES = [
  'bestiary',
  'abilities',
  'classes',
  'factions',
  'items',
  'world-lore/domains',
] as const;
type Category = (typeof VALID_CATEGORIES)[number];

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

/**
 * List all YAML entity files in a category (excludes _template.yaml, _index.yaml, and asset-map.yaml).
 */
async function listEntityFiles(category: Category): Promise<string[]> {
  const dir = resolve(resolveGameDocsRoot(), category);
  if (!existsSync(dir)) return [];

  try {
    const files = await readdir(dir);
    return files.filter((f) => f.endsWith('.yaml') && !f.startsWith('_') && f !== 'asset-map.yaml');
  } catch {
    return [];
  }
}

// ─── Tool Registration ───────────────────────────────────────────────────────

export function registerGameDocsTools(server: McpServer): void {
  // ── List Entities ─────────────────────────────────────────────────────

  server.tool(
    'game_docs_list',
    'List all game entities of a given type (bestiary, abilities, classes, factions, items, domains). Optionally filter by domain or tags.',
    {
      category: z
        .enum(['bestiary', 'abilities', 'classes', 'factions', 'items', 'domains'])
        .describe('Entity category to list.'),
      domain: z
        .string()
        .optional()
        .describe('Filter by domain (blood, decay, spirit, robot, fateless).'),
      tag: z.string().optional().describe('Filter by tag.'),
    },
    async ({ category, domain, tag }) => {
      const cat: Category = category === 'domains' ? 'world-lore/domains' : (category as Category);
      const files = await listEntityFiles(cat);

      const entities: Array<{
        id: string;
        displayName?: string;
        domain?: string;
        level?: number;
        rarity?: string;
      }> = [];

      for (const file of files) {
        const content = await safeReadFile(resolve(resolveGameDocsRoot(), cat, file));
        if (!content) continue;

        // Simple YAML field extraction (avoids needing a YAML parser dependency)
        const id = extractYamlField(content, 'id') ?? basename(file, '.yaml');
        const displayName = extractYamlField(content, 'displayName');
        const entityDomain = extractYamlField(content, 'domain');
        const level = extractYamlField(content, 'level');
        const rarity = extractYamlField(content, 'rarity');
        const tags = extractYamlArray(content, 'tags');

        // Apply filters
        if (domain && entityDomain !== domain) continue;
        if (tag && !tags.includes(tag)) continue;

        entities.push({
          id,
          displayName: displayName ?? undefined,
          domain: entityDomain ?? undefined,
          level: level ? Number(level) : undefined,
          rarity: rarity ?? undefined,
        });
      }

      return jsonResponse({
        category,
        count: entities.length,
        entities,
      });
    },
  );

  // ── Read Entity ───────────────────────────────────────────────────────

  server.tool(
    'game_docs_read',
    'Read a specific game entity by ID. Returns both the YAML data and the Markdown lore (if it exists).',
    {
      category: z
        .enum(['bestiary', 'abilities', 'classes', 'factions', 'items', 'domains'])
        .describe('Entity category.'),
      id: z.string().describe('Entity ID (kebab-case, e.g. skeleton-warrior).'),
    },
    async ({ category, id }) => {
      const cat: Category = category === 'domains' ? 'world-lore/domains' : (category as Category);
      const yamlPath = resolve(resolveGameDocsRoot(), cat, `${id}.yaml`);
      const mdPath = resolve(resolveGameDocsRoot(), cat, `${id}.md`);

      const yamlContent = await safeReadFile(yamlPath);
      const mdContent = await safeReadFile(mdPath);

      if (!yamlContent && !mdContent) {
        return {
          content: [textContent(`Entity '${id}' not found in ${category}.`)],
          isError: true,
        };
      }

      const result: Record<string, string | null> = {
        id,
        category,
        yaml: yamlContent,
        markdown: mdContent,
      };

      return jsonResponse(result);
    },
  );

  // ── Write Entity ──────────────────────────────────────────────────────

  server.tool(
    'game_docs_write',
    'Create or update a game entity. Writes the YAML data file and optionally the Markdown lore file.',
    {
      category: z
        .enum(['bestiary', 'abilities', 'classes', 'factions', 'items', 'domains'])
        .describe('Entity category.'),
      id: z.string().describe('Entity ID (kebab-case).'),
      yaml: z.string().describe('Full YAML content for the entity data file.'),
      markdown: z.string().optional().describe('Markdown lore content (optional).'),
    },
    async ({ category, id, yaml, markdown }) => {
      const cat: Category = category === 'domains' ? 'world-lore/domains' : (category as Category);
      const dir = resolve(resolveGameDocsRoot(), cat);

      // Ensure directory exists
      await mkdir(dir, { recursive: true });

      const yamlPath = resolve(dir, `${id}.yaml`);
      await writeFile(yamlPath, yaml, 'utf-8');
      logger.info('game-docs', `Wrote ${yamlPath}`);

      const written: string[] = [`${id}.yaml`];

      if (markdown) {
        const mdPath = resolve(dir, `${id}.md`);
        await writeFile(mdPath, markdown, 'utf-8');
        logger.info('game-docs', `Wrote ${mdPath}`);
        written.push(`${id}.md`);
      }

      return jsonResponse({
        success: true,
        category,
        id,
        filesWritten: written,
      });
    },
  );

  // ── Validate Entity ───────────────────────────────────────────────────

  server.tool(
    'game_docs_validate',
    'Validate a game entity YAML file against its JSON Schema. Returns validation errors if any.',
    {
      category: z
        .enum(['bestiary', 'abilities', 'classes', 'factions', 'items', 'domains'])
        .describe('Entity category (determines which schema to use).'),
      id: z.string().describe('Entity ID to validate.'),
    },
    async ({ category, id }) => {
      const cat: Category = category === 'domains' ? 'world-lore/domains' : (category as Category);
      const yamlPath = resolve(resolveGameDocsRoot(), cat, `${id}.yaml`);
      const yamlContent = await safeReadFile(yamlPath);

      if (!yamlContent) {
        return {
          content: [textContent(`Entity '${id}' not found in ${category}.`)],
          isError: true,
        };
      }

      // Map category to schema file
      const schemaMap: Record<string, string> = {
        bestiary: 'monster.schema.json',
        abilities: 'ability.schema.json',
        classes: 'class.schema.json',
        factions: 'faction.schema.json',
        items: 'item.schema.json',
        domains: 'domain.schema.json',
      };

      const schemaFile = schemaMap[category] ?? `${category}.schema.json`;
      const schemaDir = resolve(resolveGameDocsRoot(), '..', '.schemas');
      const schemaPath = resolve(schemaDir, schemaFile);

      if (!existsSync(schemaPath)) {
        return {
          content: [textContent(`Schema file not found: ${schemaFile}`)],
          isError: true,
        };
      }

      // Basic structural validation (check required fields from schema)
      const schemaContent = await safeReadFile(schemaPath);
      if (!schemaContent) {
        return {
          content: [textContent(`Could not read schema: ${schemaFile}`)],
          isError: true,
        };
      }

      const schema = JSON.parse(schemaContent);
      const requiredFields: string[] = schema.required ?? [];
      const errors: string[] = [];

      for (const field of requiredFields) {
        if (!extractYamlField(yamlContent, field) && !yamlContent.includes(`${field}:`)) {
          errors.push(`Missing required field: ${field}`);
        }
      }

      return jsonResponse({
        id,
        category,
        schemaFile,
        valid: errors.length === 0,
        errors,
        note:
          errors.length === 0
            ? 'Basic structural validation passed. For full JSON Schema validation, use ajv CLI.'
            : 'Validation errors found. Check required fields.',
      });
    },
  );

  // ── Search Entities ───────────────────────────────────────────────────

  server.tool(
    'game_docs_search',
    'Search across all game entity YAML and Markdown files for a text pattern.',
    {
      query: z.string().describe('Text to search for (case-insensitive).'),
      category: z
        .enum(['bestiary', 'abilities', 'classes', 'factions', 'items', 'domains', 'all'])
        .optional()
        .describe('Limit search to a specific category, or "all".'),
    },
    async ({ query, category }) => {
      const categories: Category[] =
        !category || category === 'all'
          ? [...VALID_CATEGORIES]
          : [category === 'domains' ? 'world-lore/domains' : (category as Category)];

      const matches: Array<{ category: string; file: string; line: number; text: string }> = [];
      const queryLower = query.toLowerCase();

      for (const cat of categories) {
        const dir = resolve(resolveGameDocsRoot(), cat);
        if (!existsSync(dir)) continue;

        const files = await readdir(dir);
        for (const file of files) {
          if (file.startsWith('_')) continue;
          if (!file.endsWith('.yaml') && !file.endsWith('.md')) continue;

          const content = await safeReadFile(resolve(dir, file));
          if (!content) continue;

          const lines = content.split('\n');
          for (let i = 0; i < lines.length; i++) {
            if (lines[i].toLowerCase().includes(queryLower)) {
              matches.push({
                category: cat,
                file,
                line: i + 1,
                text: lines[i].trim(),
              });
            }
          }
        }
      }

      return jsonResponse({
        query,
        totalMatches: matches.length,
        matches: matches.slice(0, 50), // Cap at 50 results
      });
    },
  );

  // ── Stats Summary ─────────────────────────────────────────────────────

  server.tool(
    'game_docs_stats_summary',
    'Aggregate statistics across game entities for balance review. Shows stat distributions by domain, level, and rarity.',
    {
      category: z.enum(['bestiary', 'abilities', 'classes']).describe('Category to analyze.'),
    },
    async ({ category }) => {
      const cat: Category = category as Category;
      const files = await listEntityFiles(cat);

      const entries: Array<Record<string, string | null>> = [];

      for (const file of files) {
        const content = await safeReadFile(resolve(resolveGameDocsRoot(), cat, file));
        if (!content) continue;

        const entry: Record<string, string | null> = {
          id: extractYamlField(content, 'id') ?? basename(file, '.yaml'),
          displayName: extractYamlField(content, 'displayName'),
          domain: extractYamlField(content, 'domain'),
          level: extractYamlField(content, 'level'),
          rarity: extractYamlField(content, 'rarity'),
        };

        // Extract base attributes if present
        for (const attr of ['strength', 'vitality', 'agility', 'intelligence', 'spirit', 'luck']) {
          entry[attr] = extractYamlField(content, attr);
        }

        entries.push(entry);
      }

      // Calculate summary stats
      const byDomain: Record<string, number> = {};
      const byRarity: Record<string, number> = {};
      let totalLevel = 0;
      let levelCount = 0;

      for (const e of entries) {
        if (e.domain) byDomain[e.domain] = (byDomain[e.domain] ?? 0) + 1;
        if (e.rarity) byRarity[e.rarity] = (byRarity[e.rarity] ?? 0) + 1;
        if (e.level) {
          totalLevel += Number(e.level);
          levelCount++;
        }
      }

      return jsonResponse({
        category,
        totalEntities: entries.length,
        averageLevel: levelCount > 0 ? Math.round(totalLevel / levelCount) : null,
        byDomain,
        byRarity,
        entities: entries,
      });
    },
  );

  // ── Asset Status ──────────────────────────────────────────────────────

  server.tool(
    'game_docs_asset_status',
    'Get asset pipeline status for entities in a category. Reads asset-map.yaml and reports slot statuses. Filter by entity ID or status.',
    {
      category: z
        .enum(['bestiary', 'abilities', 'classes', 'factions', 'items'])
        .describe('Entity category.'),
      entityId: z.string().optional().describe('Filter to a single entity ID.'),
      status: z
        .enum(['missing', 'prompted', 'generated', 'reviewed', 'uploaded', 'assigned'])
        .optional()
        .describe('Filter slots by lifecycle status.'),
    },
    async ({ category, entityId, status }) => {
      const assetMapPath = resolve(resolveGameDocsRoot(), category, 'asset-map.yaml');
      const content = await safeReadFile(assetMapPath);

      if (!content) {
        return jsonResponse({
          category,
          exists: false,
          message: `No asset-map.yaml found in ${category}/. Create one from _template.asset-map.yaml.`,
        });
      }

      // Parse the asset map using lightweight line-based approach
      const entries = parseAssetMap(content);

      // Apply filters
      let filtered = entries;
      if (entityId) {
        filtered = filtered.filter((e) => e.entityId === entityId);
      }
      if (status) {
        filtered = filtered
          .map((e) => ({
            ...e,
            slots: e.slots.filter((s) => s.status === status),
          }))
          .filter((e) => e.slots.length > 0);
      }

      // Compute summary
      const statusCounts: Record<string, number> = {};
      for (const entry of filtered) {
        for (const slot of entry.slots) {
          statusCounts[slot.status] = (statusCounts[slot.status] ?? 0) + 1;
        }
      }

      return jsonResponse({
        category,
        totalEntities: filtered.length,
        totalSlots: Object.values(statusCounts).reduce((a, b) => a + b, 0),
        statusCounts,
        entities: filtered,
      });
    },
  );

  // ── Asset Assign ──────────────────────────────────────────────────────

  server.tool(
    'game_docs_asset_assign',
    'Update an asset slot in asset-map.yaml. Set status, assetRef, or modelRef for a specific entity + slot.',
    {
      category: z
        .enum(['bestiary', 'abilities', 'classes', 'factions', 'items'])
        .describe('Entity category.'),
      entityId: z.string().describe('Entity ID (kebab-case).'),
      slot: z.string().describe('Slot name (e.g. icon, rig, hit-sfx).'),
      status: z
        .enum(['missing', 'prompted', 'generated', 'reviewed', 'uploaded', 'assigned'])
        .describe('New lifecycle status.'),
      assetRef: z.string().optional().describe('Roblox asset URI (rbxassetid://<number>).'),
      modelRef: z.string().optional().describe('ReplicatedStorage model name.'),
    },
    async ({ category, entityId, slot, status: newStatus, assetRef, modelRef }) => {
      const assetMapPath = resolve(resolveGameDocsRoot(), category, 'asset-map.yaml');
      const content = await safeReadFile(assetMapPath);

      if (!content) {
        return {
          content: [textContent(`No asset-map.yaml found in ${category}/. Create one first.`)],
          isError: true,
        };
      }

      // Find and update the specific slot using line-based editing
      const lines = content.split('\n');
      let inEntity = false;
      let inSlot = false;
      let _entityIndent = -1;
      let _slotIndent = -1;
      let slotStartLine = -1;
      let slotEndLine = -1;
      let found = false;

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const trimmed = line.trimStart();
        const indent = line.length - trimmed.length;

        // Skip comments and blank lines
        if (trimmed.startsWith('#') || trimmed === '') continue;

        // Detect entity-level key (zero indent, ends with :)
        if (indent === 0 && trimmed.endsWith(':') && !trimmed.startsWith(' ')) {
          const key = trimmed.slice(0, -1);
          inEntity = key === entityId;
          _entityIndent = 0;
          inSlot = false;
          continue;
        }

        if (!inEntity) continue;

        // Detect slot-level key (indent = 2, ends with :)
        if (indent === 2 && trimmed.endsWith(':')) {
          // Close previous slot if we were tracking one
          if (inSlot && found) {
            slotEndLine = i;
            break;
          }
          const key = trimmed.slice(0, -1);
          if (key === slot) {
            inSlot = true;
            found = true;
            slotStartLine = i;
            _slotIndent = 2;
          } else {
            inSlot = false;
          }
          continue;
        }

        // If we hit a new entity (indent 0), close slot
        if (indent === 0 && inSlot && found) {
          slotEndLine = i;
          break;
        }
      }

      if (!found) {
        return {
          content: [
            textContent(
              `Slot '${slot}' not found for entity '${entityId}' in ${category}/asset-map.yaml.`,
            ),
          ],
          isError: true,
        };
      }

      // If slotEndLine wasn't set, it extends to end of file
      if (slotEndLine === -1) {
        slotEndLine = lines.length;
      }

      // Build replacement lines for the slot
      const newLines: string[] = [`  ${slot}:`];
      newLines.push(`    status: ${newStatus}`);
      if (assetRef) {
        newLines.push(`    assetRef: ${assetRef}`);
      }
      if (modelRef) {
        newLines.push(`    modelRef: ${modelRef}`);
      }

      // Preserve suggestedFilename and prompt from original if they exist
      for (let i = slotStartLine + 1; i < slotEndLine; i++) {
        const trimmed = lines[i].trimStart();
        if (trimmed.startsWith('suggestedFilename:')) {
          newLines.push(`    ${trimmed}`);
        }
        if (trimmed.startsWith('prompt:')) {
          // Include the prompt and any continuation lines
          newLines.push(`    ${trimmed}`);
          for (let j = i + 1; j < slotEndLine; j++) {
            const contLine = lines[j];
            const contTrimmed = contLine.trimStart();
            const contIndent = contLine.length - contTrimmed.length;
            if (
              contIndent >= 6 &&
              !contTrimmed.startsWith('status:') &&
              !contTrimmed.startsWith('assetRef:') &&
              !contTrimmed.startsWith('modelRef:') &&
              !contTrimmed.startsWith('suggestedFilename:')
            ) {
              newLines.push(contLine);
            } else {
              break;
            }
          }
        }
      }

      // Replace the slot lines
      lines.splice(slotStartLine, slotEndLine - slotStartLine, ...newLines);
      await writeFile(assetMapPath, lines.join('\n'), 'utf-8');

      logger.info('game-docs', `Updated ${category}/${entityId}/${slot} → ${newStatus}`);

      return jsonResponse({
        success: true,
        category,
        entityId,
        slot,
        status: newStatus,
        assetRef: assetRef ?? null,
        modelRef: modelRef ?? null,
      });
    },
  );

  logger.info('game-docs', 'Registered game docs tools');
}

// ─── YAML Helpers (lightweight, no external dependency) ──────────────────────

/**
 * Lightweight parser for asset-map.yaml files.
 * Returns structured entries with entity IDs and their slot statuses.
 */
interface AssetSlotInfo {
  slot: string;
  status: string;
  assetRef?: string;
  modelRef?: string;
  suggestedFilename?: string;
  hasPrompt: boolean;
}

interface AssetMapEntry {
  entityId: string;
  slots: AssetSlotInfo[];
}

function parseAssetMap(content: string): AssetMapEntry[] {
  const lines = content.split('\n');
  const entries: AssetMapEntry[] = [];
  let currentEntity: AssetMapEntry | null = null;
  let currentSlot: AssetSlotInfo | null = null;

  for (const line of lines) {
    const trimmed = line.trimStart();
    const indent = line.length - trimmed.length;

    // Skip comments and blank lines
    if (trimmed.startsWith('#') || trimmed === '') continue;

    // Entity-level key (indent 0)
    if (indent === 0 && trimmed.endsWith(':')) {
      if (currentEntity && currentSlot) {
        currentEntity.slots.push(currentSlot);
        currentSlot = null;
      }
      if (currentEntity) entries.push(currentEntity);
      currentEntity = { entityId: trimmed.slice(0, -1), slots: [] };
      continue;
    }

    if (!currentEntity) continue;

    // Slot-level key (indent 2)
    if (indent === 2 && trimmed.endsWith(':')) {
      if (currentSlot) currentEntity.slots.push(currentSlot);
      currentSlot = { slot: trimmed.slice(0, -1), status: 'missing', hasPrompt: false };
      continue;
    }

    if (!currentSlot) continue;

    // Slot properties (indent 4+)
    if (indent >= 4) {
      const statusMatch = trimmed.match(/^status:\s*(.+)/);
      if (statusMatch) {
        currentSlot.status = statusMatch[1].trim();
        continue;
      }

      const assetRefMatch = trimmed.match(/^assetRef:\s*(.+)/);
      if (assetRefMatch) {
        currentSlot.assetRef = assetRefMatch[1].trim();
        continue;
      }

      const modelRefMatch = trimmed.match(/^modelRef:\s*(.+)/);
      if (modelRefMatch) {
        currentSlot.modelRef = modelRefMatch[1].trim();
        continue;
      }

      const filenameMatch = trimmed.match(/^suggestedFilename:\s*(.+)/);
      if (filenameMatch) {
        currentSlot.suggestedFilename = filenameMatch[1].trim();
        continue;
      }

      if (trimmed.startsWith('prompt:')) {
        currentSlot.hasPrompt = true;
        continue;
      }
    }
  }

  // Flush last slot and entity
  if (currentEntity) {
    if (currentSlot) currentEntity.slots.push(currentSlot);
    entries.push(currentEntity);
  }

  return entries;
}

/**
 * Extract a simple top-level YAML field value (handles quoted and unquoted strings).
 * This is intentionally naive — works for flat YAML fields, not nested objects.
 */
function extractYamlField(yaml: string, field: string): string | null {
  // Match `field: value` or `field: "value"` at the start of a line (no indentation = top-level)
  const regex = new RegExp(`^${field}:\\s*(?:"([^"]*)"|(\\S.*))$`, 'm');
  const match = yaml.match(regex);
  if (!match) return null;
  return (match[1] ?? match[2] ?? '').trim() || null;
}

/**
 * Extract a YAML inline array like `tags: [foo, bar, baz]`.
 */
function extractYamlArray(yaml: string, field: string): string[] {
  const regex = new RegExp(`^${field}:\\s*\\[([^\\]]*)]`, 'm');
  const match = yaml.match(regex);
  if (!match?.[1]) return [];
  return match[1]
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}
