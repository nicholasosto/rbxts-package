import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { getRequiredEnv, getOpenAIConfig, getRobloxCloudConfig } from '../env.js';

describe('getRequiredEnv', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('returns the value when the env var exists', () => {
    process.env.TEST_KEY = 'test-value';
    expect(getRequiredEnv('TEST_KEY')).toBe('test-value');
  });

  it('trims whitespace from values', () => {
    process.env.TEST_KEY = '  trimmed  ';
    expect(getRequiredEnv('TEST_KEY')).toBe('trimmed');
  });

  it('throws when the env var is missing', () => {
    delete process.env.MISSING_KEY;
    expect(() => getRequiredEnv('MISSING_KEY')).toThrowError(
      /Missing required environment variable: MISSING_KEY/,
    );
  });

  it('throws when the env var is empty string', () => {
    process.env.EMPTY_KEY = '';
    expect(() => getRequiredEnv('EMPTY_KEY')).toThrowError(
      /Missing required environment variable: EMPTY_KEY/,
    );
  });

  it('throws when the env var is only whitespace', () => {
    process.env.SPACE_KEY = '   ';
    expect(() => getRequiredEnv('SPACE_KEY')).toThrowError(
      /Missing required environment variable: SPACE_KEY/,
    );
  });
});

describe('getOpenAIConfig', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('returns config with apiKey when OPENAI_API_KEY is set', () => {
    process.env.OPENAI_API_KEY = 'sk-test-key-123';
    const config = getOpenAIConfig();
    expect(config).toEqual({ apiKey: 'sk-test-key-123' });
  });

  it('throws when OPENAI_API_KEY is missing', () => {
    delete process.env.OPENAI_API_KEY;
    expect(() => getOpenAIConfig()).toThrowError(/OPENAI_API_KEY/);
  });
});

describe('getRobloxCloudConfig', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('returns config with apiKey when ROBLOX_CLOUD_API_KEY is set', () => {
    process.env.ROBLOX_CLOUD_API_KEY = 'rblx-test-key';
    const config = getRobloxCloudConfig();
    expect(config).toEqual({ apiKey: 'rblx-test-key' });
  });

  it('throws when ROBLOX_CLOUD_API_KEY is missing', () => {
    delete process.env.ROBLOX_CLOUD_API_KEY;
    expect(() => getRobloxCloudConfig()).toThrowError(/ROBLOX_CLOUD_API_KEY/);
  });
});
