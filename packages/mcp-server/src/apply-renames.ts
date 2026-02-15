#!/usr/bin/env npx tsx
/**
 * Apply Decal Renames
 *
 * Reads categorization-results.json and applies the proposed renames
 * to each asset via the Roblox Open Cloud Assets API (PATCH).
 *
 * Usage:  npx tsx packages/mcp-server/src/apply-renames.ts
 */

// ─── Constants ────────────────────────────────────────────────────────────────

const ROBLOX_API_KEY = process.env.ROBLOX_CLOUD_API_KEY ?? '';
const ROBLOX_CLOUD_BASE = 'https://apis.roblox.com';

if (!ROBLOX_API_KEY) {
  console.error('ROBLOX_CLOUD_API_KEY not set');
  process.exit(1);
}

// ─── Types ────────────────────────────────────────────────────────────────────

interface CategorizedRecord {
  assetId: string;
  currentName: string;
  currentDescription: string;
  category: string | null;
  aiDescription: string | null;
  proposedName: string | null;
  thumbnailUrl: string | null;
  error: string | null;
}

interface CategorizedResults {
  timestamp: string;
  totalDecals: number;
  accessible: number;
  analyzed: number;
  records: CategorizedRecord[];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Roblox user ID (asset creator) */
const ROBLOX_USER_ID = '3394700055';

/**
 * Update an asset's displayName and description via the Assets v1 API.
 *
 * The PATCH endpoint requires:
 *   - multipart/form-data with a `request` field (JSON string)
 *   - updateMask query parameter
 *   - body must include assetId, assetType, creationContext
 */
async function updateAsset(
  assetId: string,
  displayName: string,
  description: string,
): Promise<{ ok: boolean; status: number; body: string; operationId?: string }> {
  const updateMask = 'displayName,description';
  const url = `${ROBLOX_CLOUD_BASE}/assets/v1/assets/${assetId}?updateMask=${encodeURIComponent(updateMask)}`;

  const requestPayload = JSON.stringify({
    assetType: 'Decal',
    assetId,
    displayName,
    description,
    creationContext: { creator: { userId: ROBLOX_USER_ID } },
  });

  // Build multipart/form-data manually
  const boundary = `----FormBoundary${Date.now()}`;
  const body = [
    `--${boundary}`,
    `Content-Disposition: form-data; name="request"`,
    '',
    requestPayload,
    `--${boundary}--`,
  ].join('\r\n');

  const res = await fetch(url, {
    method: 'PATCH',
    headers: {
      'x-api-key': ROBLOX_API_KEY,
      'Content-Type': `multipart/form-data; boundary=${boundary}`,
    },
    body,
  });

  const resBody = await res.text();
  let operationId: string | undefined;
  try {
    const parsed = JSON.parse(resBody);
    operationId = parsed.operationId;
  } catch {}

  return { ok: res.ok, status: res.status, body: resBody, operationId };
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log('╔══════════════════════════════════════════════╗');
  console.log('║   Apply Decal Renames                        ║');
  console.log('╚══════════════════════════════════════════════╝\n');

  // Load results
  const fs = await import('fs');
  const resultsPath = 'categorization-results.json';

  if (!fs.existsSync(resultsPath)) {
    console.error(`File not found: ${resultsPath}`);
    console.error('Run categorize-decals.ts first.');
    process.exit(1);
  }

  const data: CategorizedResults = JSON.parse(fs.readFileSync(resultsPath, 'utf-8'));

  // Filter to records with a proposed rename
  const toRename = data.records.filter((r) => r.proposedName && !r.error);

  // Skip already-renamed assets
  const alreadyDone = new Set(['13498955922']); // test rename done earlier
  const pending = toRename.filter((r) => !alreadyDone.has(r.assetId));
  console.log(`Found ${toRename.length} total, ${pending.length} pending.\n`);

  if (pending.length === 0) {
    console.log('Nothing to do.');
    return;
  }

  let success = 0;
  let failed = 0;
  const failures: { assetId: string; name: string; status: number; body: string }[] = [];

  for (let i = 0; i < pending.length; i++) {
    const rec = pending[i];
    const newDescription = rec.aiDescription ?? rec.currentDescription;

    try {
      const result = await updateAsset(rec.assetId, rec.proposedName!, newDescription);

      if (result.ok) {
        success++;
      } else {
        failed++;
        failures.push({
          assetId: rec.assetId,
          name: rec.proposedName!,
          status: result.status,
          body: result.body.slice(0, 200),
        });
      }
    } catch (err) {
      failed++;
      failures.push({
        assetId: rec.assetId,
        name: rec.proposedName!,
        status: 0,
        body: err instanceof Error ? err.message : String(err),
      });
    }

    // Progress every 10
    if ((i + 1) % 10 === 0 || i === pending.length - 1) {
      console.log(`  Progress: ${i + 1}/${pending.length} (${success} ok, ${failed} failed)`);
    }

    // Rate limit: 500ms between every call to avoid throttling
    await sleep(500);
  }

  console.log(`\n═══ Results ═══`);
  console.log(`  Renamed: ${success + alreadyDone.size}`);
  console.log(`  Failed:  ${failed}`);
  console.log(`  Skipped: ${alreadyDone.size} (already done)`);

  if (failures.length > 0) {
    console.log('\n── Failed Assets ──');
    for (const f of failures) {
      console.log(`  ${f.assetId}  ${f.name}  → ${f.status} ${f.body}`);
    }
  }

  // Write updated results
  const outputPath = 'rename-results.json';
  fs.writeFileSync(
    outputPath,
    JSON.stringify(
      {
        timestamp: new Date().toISOString(),
        total: toRename.length,
        pending: pending.length,
        success,
        failed,
        alreadyDone: [...alreadyDone],
        failures,
      },
      null,
      2,
    ),
  );
  console.log(`\nResults written to ${outputPath}`);
  console.log('Done!');
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
