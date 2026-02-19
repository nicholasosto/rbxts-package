import { describe, it, expect } from 'vitest';
import {
  DEFAULT_TEXT_MODEL,
  DEFAULT_IMAGE_MODEL,
  DEFAULT_VISION_MODEL,
  DEFAULT_MAX_RETRIES,
  DEFAULT_TIMEOUT,
  DEFAULT_IMAGE_SIZE,
  DEFAULT_IMAGE_QUALITY,
  DEFAULT_IMAGE_FORMAT,
  DEFAULT_IMAGE_COUNT,
} from '../defaults.js';

describe('ai-tools defaults', () => {
  it('exports all expected default values', () => {
    expect(DEFAULT_TEXT_MODEL).toBeTypeOf('string');
    expect(DEFAULT_IMAGE_MODEL).toBeTypeOf('string');
    expect(DEFAULT_VISION_MODEL).toBeTypeOf('string');
    expect(DEFAULT_MAX_RETRIES).toBeTypeOf('number');
    expect(DEFAULT_TIMEOUT).toBeTypeOf('number');
    expect(DEFAULT_IMAGE_SIZE).toBeTypeOf('string');
    expect(DEFAULT_IMAGE_QUALITY).toBeTypeOf('string');
    expect(DEFAULT_IMAGE_FORMAT).toBeTypeOf('string');
    expect(DEFAULT_IMAGE_COUNT).toBeTypeOf('number');
  });

  it('has sensible numeric defaults', () => {
    expect(DEFAULT_MAX_RETRIES).toBeGreaterThanOrEqual(0);
    expect(DEFAULT_TIMEOUT).toBeGreaterThan(0);
    expect(DEFAULT_IMAGE_COUNT).toBeGreaterThanOrEqual(1);
  });

  it('uses valid image size format', () => {
    expect(DEFAULT_IMAGE_SIZE).toMatch(/^\d+x\d+$/);
  });
});
