/**
 * @nicholasosto/mcp-server — Central Configuration
 *
 * All environment-driven defaults live here. Values are read lazily at call
 * time so that key rotation and late `.env` loading work correctly.
 */

import { getRequiredEnv } from '@nicholasosto/node-tools';
import { z } from 'zod';

// ─── Zod Helpers ──────────────────────────────────────────────────────────────

/** Zod schema for a numeric ID string (digits only). */
export const NumericId = z.string().regex(/^\d+$/, 'Must be a numeric ID (digits only)');

/** Optional numeric ID that falls back to a default. */
export function optionalNumericId(envKey: string, fallback: string) {
  return z
    .string()
    .regex(/^\d+$/, 'Must be a numeric ID (digits only)')
    .optional()
    .describe(`Defaults to env ${envKey} or ${fallback}`);
}

// ─── Defaults (from env with hardcoded fallbacks) ─────────────────────────────

/** Roblox Universe ID — reads from env at call time. */
export function getDefaultUniverseId(): string {
  return process.env.ROBLOX_UNIVERSE_ID ?? '9730686096';
}

/** Roblox Place ID — reads from env at call time. */
export function getDefaultPlaceId(): string {
  return process.env.ROBLOX_PLACE_ID ?? '87666753607582';
}

/** Default Roblox user ID for asset uploads. */
export function getDefaultCreatorId(): string {
  return process.env.ROBLOX_CREATOR_ID ?? '3394700055';
}

/** Default Roblox user ID for inventory queries. */
export function getDefaultUserId(): string {
  return process.env.ROBLOX_USER_ID ?? '3394700055';
}

/** Local assets directory for saving generated images. */
export function getLocalAssetsDir(): string {
  return process.env.LOCAL_ASSETS_DIR ?? '/Users/nicholasosto/GameDev/assets';
}

// ─── API Keys (call-time reads) ───────────────────────────────────────────────

/** Read the Roblox Cloud API key from environment at call time. */
export function getRobloxApiKey(): string {
  return getRequiredEnv('ROBLOX_CLOUD_API_KEY');
}

/** Read the OpenAI API key from environment at call time. */
export function getOpenAIApiKey(): string {
  return getRequiredEnv('OPENAI_API_KEY');
}

// ─── Startup Validation ───────────────────────────────────────────────────────

/**
 * Validate that all required environment variables are present.
 * Call this at server startup to fail fast with clear messages.
 *
 * Returns an array of warnings for optional vars that are missing.
 */
export function validateEnvironment(): { valid: boolean; errors: string[]; warnings: string[] } {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Required
  if (!process.env.ROBLOX_CLOUD_API_KEY?.trim()) {
    errors.push('ROBLOX_CLOUD_API_KEY is not set — Roblox tools will fail.');
  }
  if (!process.env.OPENAI_API_KEY?.trim()) {
    errors.push('OPENAI_API_KEY is not set — AI tools will fail.');
  }

  // Optional with defaults
  if (!process.env.ROBLOX_UNIVERSE_ID) {
    warnings.push('ROBLOX_UNIVERSE_ID not set — using default 9730686096.');
  }
  if (!process.env.ROBLOX_PLACE_ID) {
    warnings.push('ROBLOX_PLACE_ID not set — using default 87666753607582.');
  }

  return { valid: errors.length === 0, errors, warnings };
}
