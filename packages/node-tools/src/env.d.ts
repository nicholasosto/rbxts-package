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
import type { OpenAIConfig, RobloxCloudConfig } from './types.js';
/**
 * Load environment variables from the monorepo root `.env` file.
 * Safe to call multiple times — only the first call reads the file.
 *
 * @param envPath  Optional absolute path to a `.env` file. Defaults to the
 *                 monorepo root (three levels up from this compiled file).
 */
export declare function loadEnv(envPath?: string): void;
/**
 * Read an environment variable and throw if it is missing or empty.
 *
 * @param key  The environment variable name (e.g. `"OPENAI_API_KEY"`).
 * @returns    The non-empty string value.
 * @throws     Error with a clear message naming the missing key.
 */
export declare function getRequiredEnv(key: string): string;
/**
 * Returns the OpenAI configuration from environment variables.
 * Automatically calls `loadEnv()` if it hasn't been called yet.
 */
export declare function getOpenAIConfig(): OpenAIConfig;
/**
 * Returns the Roblox Cloud configuration from environment variables.
 * Automatically calls `loadEnv()` if it hasn't been called yet.
 */
export declare function getRobloxCloudConfig(): RobloxCloudConfig;
