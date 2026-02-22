import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock the node-tools module before importing config
vi.mock('@nicholasosto/node-tools', () => ({
  getRequiredEnv: (key: string) => {
    const val = process.env[key]?.trim();
    if (!val) throw new Error(`Missing required environment variable: ${key}`);
    return val;
  },
  loadEnv: vi.fn(),
}));

import {
  getDefaultUniverseId,
  getDefaultPlaceId,
  getDefaultCreatorId,
  getDefaultUserId,
  getRobloxApiKey,
  getOpenAIApiKey,
  validateEnvironment,
  NumericId,
} from '../config.js';

describe('config', () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe('NumericId schema', () => {
    it('accepts valid numeric strings', () => {
      expect(NumericId.parse('12345')).toBe('12345');
      expect(NumericId.parse('9730686096')).toBe('9730686096');
      expect(NumericId.parse('0')).toBe('0');
    });

    it('rejects non-numeric strings', () => {
      expect(() => NumericId.parse('abc')).toThrow();
      expect(() => NumericId.parse('123abc')).toThrow();
      expect(() => NumericId.parse('')).toThrow();
      expect(() => NumericId.parse('12.34')).toThrow();
      expect(() => NumericId.parse('-1')).toThrow();
    });
  });

  describe('default getters', () => {
    it('returns env value when set', () => {
      process.env.ROBLOX_UNIVERSE_ID = '111';
      expect(getDefaultUniverseId()).toBe('111');
    });

    it('returns hardcoded fallback when env not set', () => {
      delete process.env.ROBLOX_UNIVERSE_ID;
      expect(getDefaultUniverseId()).toBe('9730686096');
    });

    it('reads place ID from env', () => {
      process.env.ROBLOX_PLACE_ID = '222';
      expect(getDefaultPlaceId()).toBe('222');
    });

    it('reads creator ID from env', () => {
      process.env.ROBLOX_CREATOR_ID = '333';
      expect(getDefaultCreatorId()).toBe('333');
    });

    it('reads user ID from env', () => {
      process.env.ROBLOX_USER_ID = '444';
      expect(getDefaultUserId()).toBe('444');
    });
  });

  describe('API key getters', () => {
    it('returns key when set', () => {
      process.env.ROBLOX_CLOUD_API_KEY = 'test-roblox-key';
      expect(getRobloxApiKey()).toBe('test-roblox-key');
    });

    it('throws when key missing', () => {
      delete process.env.ROBLOX_CLOUD_API_KEY;
      expect(() => getRobloxApiKey()).toThrow(/ROBLOX_CLOUD_API_KEY/);
    });

    it('returns OpenAI key when set', () => {
      process.env.OPENAI_API_KEY = 'sk-test';
      expect(getOpenAIApiKey()).toBe('sk-test');
    });

    it('throws when OpenAI key missing', () => {
      delete process.env.OPENAI_API_KEY;
      expect(() => getOpenAIApiKey()).toThrow(/OPENAI_API_KEY/);
    });
  });

  describe('validateEnvironment', () => {
    it('reports valid when both keys present', () => {
      process.env.ROBLOX_CLOUD_API_KEY = 'key1';
      process.env.OPENAI_API_KEY = 'key2';
      const result = validateEnvironment();
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('reports errors for missing required keys', () => {
      delete process.env.ROBLOX_CLOUD_API_KEY;
      delete process.env.OPENAI_API_KEY;
      const result = validateEnvironment();
      expect(result.valid).toBe(false);
      expect(result.errors).toHaveLength(2);
    });

    it('reports warnings for missing optional IDs', () => {
      process.env.ROBLOX_CLOUD_API_KEY = 'key1';
      process.env.OPENAI_API_KEY = 'key2';
      delete process.env.ROBLOX_UNIVERSE_ID;
      delete process.env.ROBLOX_PLACE_ID;
      const result = validateEnvironment();
      expect(result.valid).toBe(true);
      expect(result.warnings.length).toBeGreaterThan(0);
    });

    it('no warnings when optional IDs are set', () => {
      process.env.ROBLOX_CLOUD_API_KEY = 'key1';
      process.env.OPENAI_API_KEY = 'key2';
      process.env.ROBLOX_UNIVERSE_ID = '111';
      process.env.ROBLOX_PLACE_ID = '222';
      const result = validateEnvironment();
      expect(result.warnings).toHaveLength(0);
    });
  });
});
