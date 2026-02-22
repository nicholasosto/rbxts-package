/**
 * @nicholasosto/mcp-server — Roblox API Helpers
 *
 * Shared utilities for Roblox Open Cloud API calls:
 *   - Authenticated fetch with retry & logging
 *   - Long-running operation polling
 *   - Multipart body construction (binary-safe)
 *   - Standard MCP content-block formatting
 */

import { getRobloxApiKey } from './config.js';
import { logger } from './logger.js';

// ─── Constants ────────────────────────────────────────────────────────────────

/** Base URL for Roblox Open Cloud APIs. */
export const ROBLOX_CLOUD_BASE = 'https://apis.roblox.com';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface RobloxFetchOptions {
  method?: string;
  headers?: Record<string, string>;
  body?: string | Buffer;
  /** Skip the x-api-key header (for public APIs like thumbnails). */
  noAuth?: boolean;
  /** Max retry attempts for 429/5xx errors. Default: 3 */
  maxRetries?: number;
}

export interface RobloxFetchResult {
  ok: boolean;
  status: number;
  body: string;
  /** Parsed JSON if the response was JSON, otherwise undefined. */
  json?: unknown;
  /** Duration of the request in ms. */
  durationMs: number;
}

/** MCP text content block. */
export interface TextContent {
  type: 'text';
  text: string;
}

// ─── Auth Headers ─────────────────────────────────────────────────────────────

/** Standard JSON headers for Roblox Cloud API calls (reads key at call time). */
export function robloxHeaders(apiKey?: string): Record<string, string> {
  return {
    'x-api-key': apiKey ?? getRobloxApiKey(),
    'Content-Type': 'application/json',
  };
}

// ─── Fetch with Retry ─────────────────────────────────────────────────────────

/**
 * Make an authenticated fetch to a Roblox Open Cloud endpoint with
 * automatic retry on 429 (rate limit) and 5xx (server error) responses.
 */
export async function robloxFetch(
  url: string,
  options: RobloxFetchOptions = {},
): Promise<RobloxFetchResult> {
  const { method = 'GET', body, noAuth = false, maxRetries = 3 } = options;
  const headers: Record<string, string> = { ...options.headers };

  if (!noAuth && !headers['x-api-key']) {
    headers['x-api-key'] = getRobloxApiKey();
  }
  if (!headers['Content-Type'] && typeof body === 'string') {
    headers['Content-Type'] = 'application/json';
  }

  let lastResult: RobloxFetchResult | undefined;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    const start = Date.now();

    try {
      const res = await fetch(url, { method, headers, body });
      const resBody = await res.text();
      const durationMs = Date.now() - start;

      logger.apiResponse(url, res.status, durationMs);

      let json: unknown;
      try {
        json = JSON.parse(resBody);
      } catch {
        // Not JSON — that's fine
      }

      lastResult = { ok: res.ok, status: res.status, body: resBody, json, durationMs };

      // Retry on 429 or 5xx
      if ((res.status === 429 || res.status >= 500) && attempt < maxRetries) {
        const backoff = Math.min(1000 * 2 ** attempt, 10000);
        logger.warn(
          'roblox-fetch',
          `${res.status} on ${url}, retrying in ${backoff}ms (attempt ${attempt + 1}/${maxRetries})`,
        );
        await delay(backoff);
        continue;
      }

      return lastResult;
    } catch (err) {
      const durationMs = Date.now() - start;
      const message = err instanceof Error ? err.message : String(err);

      if (attempt < maxRetries) {
        const backoff = Math.min(1000 * 2 ** attempt, 10000);
        logger.warn(
          'roblox-fetch',
          `Network error on ${url}: ${message}, retrying in ${backoff}ms`,
        );
        await delay(backoff);
        continue;
      }

      lastResult = {
        ok: false,
        status: 0,
        body: `Network error: ${message}`,
        durationMs,
      };
    }
  }

  return lastResult!;
}

// ─── Operation Polling ────────────────────────────────────────────────────────

export interface PollResult {
  done: boolean;
  response?: unknown;
  error?: string;
}

/**
 * Poll a Roblox long-running operation until it completes or times out.
 *
 * @param operationPath  The operation path (e.g. "universes/.../operations/...")
 * @param maxAttempts    Maximum number of poll attempts. Default: 10
 * @param delayMs        Delay between attempts in ms. Default: 1000
 */
export async function pollOperation(
  operationPath: string,
  maxAttempts = 10,
  delayMs = 1000,
): Promise<PollResult> {
  // Normalise the path — remove leading slash and build full URL
  const cleanPath = operationPath.replace(/^\//, '');
  // Determine if it's a v1 or v2 path
  const url = cleanPath.startsWith('http')
    ? cleanPath
    : cleanPath.includes('/v1/')
      ? `${ROBLOX_CLOUD_BASE}/${cleanPath}`
      : `${ROBLOX_CLOUD_BASE}/cloud/v2/${cleanPath}`;

  for (let i = 0; i < maxAttempts; i++) {
    const result = await robloxFetch(url);

    if (!result.ok) {
      return { done: true, error: `Poll error ${result.status}: ${result.body}` };
    }

    const body = result.json as Record<string, unknown> | undefined;
    if (body?.done) {
      return { done: true, response: body.response ?? body };
    }

    if (i < maxAttempts - 1) {
      await delay(delayMs);
    }
  }

  return { done: false, error: `Operation timed out after ${maxAttempts} polling attempts` };
}

// ─── Multipart Body Builder ───────────────────────────────────────────────────

export interface MultipartField {
  name: string;
  contentType: string;
  /** String content (for JSON metadata) or Buffer (for binary file data). */
  data: string | Buffer;
  filename?: string;
}

/**
 * Build a binary-safe multipart/form-data body.
 *
 * Returns { body: Buffer, contentType: string } ready to pass to fetch().
 */
export function buildMultipartBody(fields: MultipartField[]): {
  body: Buffer;
  contentType: string;
} {
  const boundary = `----MCPBoundary${Date.now()}`;
  const parts: Buffer[] = [];

  for (const field of fields) {
    const disposition = field.filename
      ? `Content-Disposition: form-data; name="${field.name}"; filename="${field.filename}"`
      : `Content-Disposition: form-data; name="${field.name}"`;

    const header = `--${boundary}\r\n${disposition}\r\nContent-Type: ${field.contentType}\r\n\r\n`;
    parts.push(Buffer.from(header));
    parts.push(typeof field.data === 'string' ? Buffer.from(field.data) : field.data);
    parts.push(Buffer.from('\r\n'));
  }

  parts.push(Buffer.from(`--${boundary}--\r\n`));

  return {
    body: Buffer.concat(parts),
    contentType: `multipart/form-data; boundary=${boundary}`,
  };
}

// ─── Asset ID Extraction ──────────────────────────────────────────────────────

/**
 * Parse a Roblox asset ID from a creation/upload API response.
 *
 * The Open Cloud Assets v1 create endpoint returns a JSON operation object.
 * The asset ID can appear in several places depending on whether Roblox
 * returns the final result synchronously:
 *
 * 1. `response.assetId`  (direct field)
 * 2. `response.path`     (e.g. "assets/123456")
 * 3. `path`              (top-level operation path)
 */
export function extractAssetId(body: string): string | undefined {
  try {
    const json = JSON.parse(body);

    // Case 1: direct assetId field (common in completed operations)
    if (json.assetId) return String(json.assetId);
    if (json.response?.assetId) return String(json.response.assetId);

    // Case 2: path field like "assets/123456"
    const pathStr: string | undefined = json.response?.path ?? json.path;
    if (pathStr) {
      const match = pathStr.match(/assets\/(\d+)/);
      if (match) return match[1];
    }

    // Case 3: look in done/response
    if (json.done && json.response) {
      return extractAssetId(JSON.stringify(json.response));
    }
  } catch {
    // Not JSON — try regex on raw text
    const match = body.match(/"assetId"\s*:\s*"?(\d+)"?/);
    if (match) return match[1];
  }
  return undefined;
}

// ─── MCP Content Helpers ──────────────────────────────────────────────────────

/** Create a text content block for MCP tool responses. */
export function textContent(text: string): TextContent {
  return { type: 'text' as const, text };
}

/** Create an error response for MCP tools. */
export function errorResponse(
  status: number,
  body: string,
  endpoint?: string,
): { content: TextContent[] } {
  const parts = [`Error ${status}`];
  if (endpoint) parts.push(`on ${endpoint}`);
  parts.push(`: ${body}`);
  logger.error('tool-response', parts.join(' '));
  return { content: [textContent(parts.join(' '))] };
}

/** Create a success response wrapping a raw API body. */
export function successResponse(body: string): { content: TextContent[] } {
  return { content: [textContent(body)] };
}

/** Create a success response from a JSON-serializable value. */
export function jsonResponse(data: unknown): { content: TextContent[] } {
  return { content: [textContent(JSON.stringify(data, null, 2))] };
}

// ─── Utility ──────────────────────────────────────────────────────────────────

/** Promise-based delay. */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
