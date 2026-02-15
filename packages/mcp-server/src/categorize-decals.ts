#!/usr/bin/env npx tsx
/**
 * Batch Decal Categorization Script
 *
 * Fetches all decal assets, gets thumbnails, analyzes with GPT-4o vision,
 * and outputs a JSON file of proposed renames.
 *
 * Usage:  npx tsx packages/mcp-server/src/categorize-decals.ts
 */

import { createAISession } from '@nicholasosto/ai-tools';

// ─── Constants ────────────────────────────────────────────────────────────────

const ROBLOX_API_KEY = process.env.ROBLOX_CLOUD_API_KEY ?? '';
const OPENAI_API_KEY = process.env.OPENAI_API_KEY ?? '';
if (!ROBLOX_API_KEY) {
  console.error('ROBLOX_CLOUD_API_KEY not set');
  process.exit(1);
}
if (!OPENAI_API_KEY) {
  console.error('OPENAI_API_KEY not set');
  process.exit(1);
}
const ROBLOX_CLOUD_BASE = 'https://apis.roblox.com';
const THUMBNAILS_BASE = 'https://thumbnails.roblox.com/v1/assets';
const USER_ID = '3394700055';
const THUMB_SIZE = '420x420';

const CATEGORIZATION_PROMPT = `You are categorizing Roblox game decal images. Look at the image and assign it to exactly ONE category from this list:

- UI (buttons, frames, borders, panels, HUD elements)
- Effects (particles, glows, auras, energy blasts, explosions)
- Characters (character portraits, sprites, full-body images)
- Items (weapons, armor, potions, collectibles, items)
- Icons (small symbolic icons, stat icons, ability icons)
- Environment (landscapes, skyboxes, terrain textures, scenery)
- Textures (repeating patterns, material textures, surface textures)
- Backgrounds (full backgrounds, wallpapers, scene backdrops)

Respond with EXACTLY this format (no extra text):
Category: <category>
Description: <brief 5-10 word description>`;

// ─── Types ────────────────────────────────────────────────────────────────────

interface DecalRecord {
  assetId: string;
  currentName: string;
  currentDescription: string;
  thumbnailUrl: string | null;
  thumbnailState: string;
  category: string | null;
  aiDescription: string | null;
  proposedName: string | null;
  error: string | null;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function robloxHeaders(): Record<string, string> {
  return {
    'x-api-key': ROBLOX_API_KEY,
    'Content-Type': 'application/json',
  };
}

async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Fetch all decal asset IDs from inventory (paginated). */
async function fetchAllDecalAssetIds(): Promise<string[]> {
  const ids: string[] = [];
  let pageToken = '';
  let page = 1;

  while (true) {
    const url = new URL(`${ROBLOX_CLOUD_BASE}/cloud/v2/users/${USER_ID}/inventory-items`);
    url.searchParams.set('filter', 'inventoryItemAssetTypes=DECAL');
    url.searchParams.set('maxPageSize', '100');
    if (pageToken) url.searchParams.set('pageToken', pageToken);

    console.log(`  Fetching inventory page ${page}...`);
    const res = await fetch(url.toString(), { headers: robloxHeaders() });
    if (!res.ok) {
      throw new Error(`Inventory API failed: ${res.status} ${await res.text()}`);
    }

    const body = (await res.json()) as {
      inventoryItems?: { assetDetails?: { assetId?: string } }[];
      nextPageToken?: string;
    };

    for (const item of body.inventoryItems ?? []) {
      if (item.assetDetails?.assetId) {
        ids.push(item.assetDetails.assetId);
      }
    }

    pageToken = body.nextPageToken ?? '';
    if (!pageToken) break;
    page++;
  }

  return ids;
}

/** Fetch asset info (displayName, description) from Open Cloud. */
async function fetchAssetInfo(
  assetId: string,
): Promise<{ displayName: string; description: string } | null> {
  // Use v1 Assets API (not v2) — matches the working MCP tool
  const url = `${ROBLOX_CLOUD_BASE}/assets/v1/assets/${assetId}`;
  const res = await fetch(url, { headers: robloxHeaders() });
  if (!res.ok) {
    return null;
  }

  const body = (await res.json()) as { displayName?: string; description?: string };
  return {
    displayName: body.displayName ?? '',
    description: body.description ?? '',
  };
}

/** Fetch thumbnails for a batch of asset IDs (max 100). */
async function fetchThumbnails(
  assetIds: string[],
): Promise<Map<string, { state: string; imageUrl: string }>> {
  const result = new Map<string, { state: string; imageUrl: string }>();

  const url = `${THUMBNAILS_BASE}?assetIds=${assetIds.join(',')}&size=${THUMB_SIZE}&format=Png`;
  const res = await fetch(url);
  if (!res.ok) {
    console.warn(`  Thumbnails API failed: ${res.status}`);
    return result;
  }

  const body = (await res.json()) as {
    data?: { targetId: number; state: string; imageUrl: string }[];
  };

  for (const item of body.data ?? []) {
    result.set(String(item.targetId), { state: item.state, imageUrl: item.imageUrl });
  }

  return result;
}

/** Clean a name for use as a display name: strip old prefix, clean up. */
function cleanBaseName(name: string): string {
  // Remove "Images/" prefix if present
  let clean = name.replace(/^Images\//, '');
  // Replace spaces with underscores
  clean = clean.replace(/\s+/g, '_');
  // Remove parentheses and their contents like "(1)"
  clean = clean.replace(/\s*\(\d+\)\s*/g, '');
  clean = clean.replace(/_+/g, '_').replace(/_$/, '');
  return clean;
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log('╔══════════════════════════════════════════════╗');
  console.log('║   Decal Categorization Pipeline              ║');
  console.log('╚══════════════════════════════════════════════╝\n');

  // 1. Get all decal asset IDs
  console.log('Step 1: Fetching all decal asset IDs from inventory...');
  const allAssetIds = await fetchAllDecalAssetIds();
  console.log(`  Found ${allAssetIds.length} decals.\n`);

  // 2. Get asset info for each (with rate limiting)
  console.log('Step 2: Fetching asset info (names + descriptions)...');
  const records: DecalRecord[] = [];
  let infoSuccess = 0;
  let infoFail = 0;

  for (let i = 0; i < allAssetIds.length; i++) {
    const assetId = allAssetIds[i];
    const info = await fetchAssetInfo(assetId);

    if (info) {
      records.push({
        assetId,
        currentName: info.displayName,
        currentDescription: info.description,
        thumbnailUrl: null,
        thumbnailState: 'unknown',
        category: null,
        aiDescription: null,
        proposedName: null,
        error: null,
      });
      infoSuccess++;
    } else {
      // Asset not accessible (maybe not owned/created by user)
      records.push({
        assetId,
        currentName: '(inaccessible)',
        currentDescription: '',
        thumbnailUrl: null,
        thumbnailState: 'unknown',
        category: null,
        aiDescription: null,
        proposedName: null,
        error: 'asset_get_info failed - may not be owned by you',
      });
      infoFail++;
    }

    // Progress log every 25
    if ((i + 1) % 25 === 0 || i === allAssetIds.length - 1) {
      console.log(
        `  Progress: ${i + 1}/${allAssetIds.length} (${infoSuccess} ok, ${infoFail} inaccessible)`,
      );
    }

    // Tiny delay to avoid rate limiting
    if ((i + 1) % 10 === 0) await sleep(200);
  }
  console.log(`  Asset info: ${infoSuccess} accessible, ${infoFail} inaccessible.\n`);

  // 3. Get thumbnails in batches of 100
  console.log('Step 3: Fetching thumbnail URLs...');
  const accessibleRecords = records.filter((r) => !r.error);
  const accessibleIds = accessibleRecords.map((r) => r.assetId);

  for (let i = 0; i < accessibleIds.length; i += 100) {
    const batch = accessibleIds.slice(i, i + 100);
    console.log(`  Thumbnail batch ${Math.floor(i / 100) + 1}: ${batch.length} assets...`);
    const thumbs = await fetchThumbnails(batch);

    for (const [id, thumb] of thumbs) {
      const rec = records.find((r) => r.assetId === id);
      if (rec) {
        rec.thumbnailUrl = thumb.imageUrl || null;
        rec.thumbnailState = thumb.state;
      }
    }

    // Retry Pending thumbnails after a delay
    const pendingIds = batch.filter((id) => {
      const rec = records.find((r) => r.assetId === id);
      return rec && rec.thumbnailState === 'Pending';
    });

    if (pendingIds.length > 0) {
      console.log(`  Retrying ${pendingIds.length} Pending thumbnails after 3s...`);
      await sleep(3000);
      const retryThumbs = await fetchThumbnails(pendingIds);
      for (const [id, thumb] of retryThumbs) {
        const rec = records.find((r) => r.assetId === id);
        if (rec) {
          rec.thumbnailUrl = thumb.imageUrl || null;
          rec.thumbnailState = thumb.state;
        }
      }
    }
  }

  const withThumbnails = records.filter((r) => r.thumbnailUrl && r.thumbnailState === 'Completed');
  console.log(`  ${withThumbnails.length} thumbnails ready for analysis.\n`);

  // 4. Analyze images with GPT-4o vision
  console.log('Step 4: Analyzing images with GPT-4o vision...');
  const session = createAISession({ apiKey: OPENAI_API_KEY });
  let analyzed = 0;
  let analysisFails = 0;

  for (let i = 0; i < withThumbnails.length; i++) {
    const rec = withThumbnails[i];
    try {
      const result = await session.analyzeImage(rec.thumbnailUrl!, CATEGORIZATION_PROMPT, {
        temperature: 0,
        maxOutputTokens: 100,
      });

      // Parse "Category: X\nDescription: Y"
      const categoryMatch = result.text.match(/Category:\s*(.+)/i);
      const descriptionMatch = result.text.match(/Description:\s*(.+)/i);

      rec.category = categoryMatch?.[1]?.trim() ?? 'Unknown';
      rec.aiDescription = descriptionMatch?.[1]?.trim() ?? result.text;

      // Build proposed name: Category/CleanBaseName
      const baseName = cleanBaseName(rec.currentName);
      rec.proposedName = `${rec.category}/${baseName}`;
      analyzed++;
    } catch (err) {
      rec.error = `Vision analysis failed: ${err instanceof Error ? err.message : String(err)}`;
      analysisFails++;
    }

    // Progress log every 10
    if ((i + 1) % 10 === 0 || i === withThumbnails.length - 1) {
      console.log(
        `  Analyzed: ${i + 1}/${withThumbnails.length} (${analyzed} ok, ${analysisFails} failed)`,
      );
    }

    // Small delay between vision calls to be polite to the API
    await sleep(300);
  }
  console.log(`  Analysis complete: ${analyzed} categorized, ${analysisFails} failed.\n`);

  // 5. Output results
  console.log('Step 5: Writing results to categorization-results.json...');

  const output = {
    timestamp: new Date().toISOString(),
    totalDecals: allAssetIds.length,
    accessible: infoSuccess,
    inaccessible: infoFail,
    thumbnailsReady: withThumbnails.length,
    analyzed,
    analysisFails,
    records: records.map((r) => ({
      assetId: r.assetId,
      currentName: r.currentName,
      currentDescription: r.currentDescription,
      category: r.category,
      aiDescription: r.aiDescription,
      proposedName: r.proposedName,
      thumbnailUrl: r.thumbnailUrl,
      error: r.error,
    })),
  };

  const fs = await import('fs');
  const outputPath = 'categorization-results.json';
  fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));
  console.log(`  Results written to ${outputPath}`);

  // 6. Print summary table
  console.log('\n╔══════════════════════════════════════════════╗');
  console.log('║   Category Summary                            ║');
  console.log('╚══════════════════════════════════════════════╝');

  const categoryCounts: Record<string, number> = {};
  for (const r of records) {
    if (r.category) {
      categoryCounts[r.category] = (categoryCounts[r.category] ?? 0) + 1;
    }
  }

  for (const [cat, count] of Object.entries(categoryCounts).sort((a, b) => b[1] - a[1])) {
    console.log(`  ${cat.padEnd(15)} ${count}`);
  }

  // Print sample renames
  console.log('\n── Sample Proposed Renames ──');
  const samples = records.filter((r) => r.proposedName).slice(0, 15);
  for (const r of samples) {
    console.log(`  ${r.currentName} → ${r.proposedName}`);
  }

  if (records.filter((r) => r.proposedName).length > 15) {
    console.log(`  ... and ${records.filter((r) => r.proposedName).length - 15} more`);
  }

  console.log('\nDone! Review categorization-results.json and then run the rename script.');
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
