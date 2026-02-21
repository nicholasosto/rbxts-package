/**
 * @nicholasosto/node-tools — Environment Loader
 *
 * Loads the monorepo root .env file and provides typed getters
 * for each service's required environment variables.
 *
 * Usage:
 * ```ts
 * import { loadEnv, getOpenAIConfig, getRobloxCloudConfig } from '@nicholasosto/node-tools';
 *
 * loadEnv();                         // call once at startup
 * const openai = getOpenAIConfig();  // { apiKey: 'sk-...' }
 * const roblox = getRobloxCloudConfig(); // { apiKey: '...' }
 * ```
 */

import { config as dotenvConfig } from 'dotenv';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { OpenAIConfig, RobloxCloudConfig } from './types.js';

// ─── Internal State ────────────────────────────────────────────────────────────

let _loaded = false;

// ─── Core Helpers ──────────────────────────────────────────────────────────────

/**
 * Load environment variables from the monorepo root `.env` file.
 * Safe to call multiple times — only the first call reads the file.
 *
 * @param envPath  Optional absolute path to a `.env` file. Defaults to the
 *                 monorepo root (three levels up from this compiled file).
 */
export function loadEnv(envPath?: string): void {
  if (_loaded) return;

  const resolvedPath =
    envPath ?? resolve(dirname(fileURLToPath(import.meta.url)), '..', '..', '..', '.env');

  // MCP stdio servers must keep stdout reserved for JSON-RPC frames.
  // dotenv v17 logs load info to stdout unless quiet is enabled.
  dotenvConfig({ path: resolvedPath, quiet: true });
  _loaded = true;
}

/**
 * Read an environment variable and throw if it is missing or empty.
 *
 * @param key  The environment variable name (e.g. `"OPENAI_API_KEY"`).
 * @returns    The non-empty string value.
 * @throws     Error with a clear message naming the missing key.
 */
export function getRequiredEnv(key: string): string {
  const value = process.env[key]?.trim();
  if (!value) {
    throw new Error(
      `Missing required environment variable: ${key}\n` +
        `  → Make sure it is set in your .env file or shell environment.\n` +
        `  → See .env.example for reference.`,
    );
  }
  return value;
}

// ─── Typed Service Getters ─────────────────────────────────────────────────────

/**
 * Returns the OpenAI configuration from environment variables.
 * Automatically calls `loadEnv()` if it hasn't been called yet.
 */
export function getOpenAIConfig(): OpenAIConfig {
  loadEnv();
  return {
    apiKey: getRequiredEnv('OPENAI_API_KEY'),
  };
}

/**
 * Returns the Roblox Cloud configuration from environment variables.
 * Automatically calls `loadEnv()` if it hasn't been called yet.
 */
export function getRobloxCloudConfig(): RobloxCloudConfig {
  loadEnv();
  return {
    apiKey: getRequiredEnv('ROBLOX_CLOUD_API_KEY'),
  };
}
