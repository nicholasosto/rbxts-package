import { describe, it, expect, vi } from 'vitest';
import { z } from 'zod';

// Mock config to avoid requiring real env vars
vi.mock('../config.js', () => ({
  getRobloxApiKey: () => 'test-api-key',
  getDefaultUniverseId: () => '9730686096',
  getDefaultPlaceId: () => '87666753607582',
  getDefaultCreatorId: () => '3394700055',
  getDefaultUserId: () => '3394700055',
  NumericId: z.string().regex(/^\d+$/),
}));

import {
  extractAssetId,
  buildMultipartBody,
  robloxHeaders,
  textContent,
  errorResponse,
  successResponse,
  jsonResponse,
  delay,
} from '../roblox-helpers.js';

describe('extractAssetId', () => {
  it('extracts from direct assetId field', () => {
    const body = JSON.stringify({ assetId: '12345' });
    expect(extractAssetId(body)).toBe('12345');
  });

  it('extracts from response.assetId', () => {
    const body = JSON.stringify({ response: { assetId: '67890' } });
    expect(extractAssetId(body)).toBe('67890');
  });

  it('extracts from response.path', () => {
    const body = JSON.stringify({ response: { path: 'assets/11111' } });
    expect(extractAssetId(body)).toBe('11111');
  });

  it('extracts from top-level path', () => {
    const body = JSON.stringify({ path: 'operations/xxx/assets/22222' });
    expect(extractAssetId(body)).toBe('22222');
  });

  it('extracts from done + response', () => {
    const body = JSON.stringify({ done: true, response: { assetId: '33333' } });
    expect(extractAssetId(body)).toBe('33333');
  });

  it('extracts numeric assetId', () => {
    const body = JSON.stringify({ assetId: 44444 });
    expect(extractAssetId(body)).toBe('44444');
  });

  it('falls back to regex on non-JSON', () => {
    const body = 'some text "assetId": "55555" more text';
    expect(extractAssetId(body)).toBe('55555');
  });

  it('falls back to regex with unquoted number', () => {
    const body = 'some text "assetId":66666 more text';
    expect(extractAssetId(body)).toBe('66666');
  });

  it('returns undefined when no ID found', () => {
    expect(extractAssetId('{}')).toBeUndefined();
    expect(extractAssetId('')).toBeUndefined();
    expect(extractAssetId('not json at all')).toBeUndefined();
  });
});

describe('buildMultipartBody', () => {
  it('creates valid multipart with string field', () => {
    const result = buildMultipartBody([
      { name: 'request', contentType: 'application/json', data: '{"key":"value"}' },
    ]);

    expect(result.contentType).toMatch(/^multipart\/form-data; boundary=/);
    expect(result.body).toBeInstanceOf(Buffer);
    expect(result.body.toString()).toContain('{"key":"value"}');
    expect(result.body.toString()).toContain('Content-Disposition: form-data; name="request"');
    expect(result.body.toString()).toContain('Content-Type: application/json');
  });

  it('creates valid multipart with binary field and filename', () => {
    const binaryData = Buffer.from([0x89, 0x50, 0x4e, 0x47]); // PNG header
    const result = buildMultipartBody([
      { name: 'request', contentType: 'application/json', data: '{}' },
      { name: 'fileContent', contentType: 'image/png', data: binaryData, filename: 'image.png' },
    ]);

    const bodyStr = result.body.toString();
    expect(bodyStr).toContain('filename="image.png"');
    expect(bodyStr).toContain('Content-Type: image/png');
    // Binary data should be preserved
    expect(result.body.includes(binaryData)).toBe(true);
  });

  it('handles multiple fields', () => {
    const result = buildMultipartBody([
      { name: 'field1', contentType: 'text/plain', data: 'hello' },
      { name: 'field2', contentType: 'text/plain', data: 'world' },
    ]);

    const bodyStr = result.body.toString();
    expect(bodyStr).toContain('name="field1"');
    expect(bodyStr).toContain('name="field2"');
    expect(bodyStr).toContain('hello');
    expect(bodyStr).toContain('world');
  });

  it('preserves binary data integrity', () => {
    // Create binary data with bytes that would be corrupted by toString('binary')
    const binaryData = Buffer.from([0x00, 0x80, 0xff, 0xfe, 0x01, 0x90, 0xa0]);
    const result = buildMultipartBody([
      { name: 'file', contentType: 'application/octet-stream', data: binaryData },
    ]);

    // The binary data should be present in the output buffer
    expect(result.body.includes(binaryData)).toBe(true);
  });
});

describe('robloxHeaders', () => {
  it('includes api key and content type', () => {
    const headers = robloxHeaders('my-key');
    expect(headers['x-api-key']).toBe('my-key');
    expect(headers['Content-Type']).toBe('application/json');
  });

  it('uses default key from config when not provided', () => {
    const headers = robloxHeaders();
    expect(headers['x-api-key']).toBe('test-api-key');
  });
});

describe('MCP content helpers', () => {
  it('textContent creates proper block', () => {
    const result = textContent('hello');
    expect(result).toEqual({ type: 'text', text: 'hello' });
  });

  it('successResponse wraps body', () => {
    const result = successResponse('{"ok":true}');
    expect(result.content).toHaveLength(1);
    expect(result.content[0].text).toBe('{"ok":true}');
  });

  it('errorResponse includes status', () => {
    const result = errorResponse(404, 'Not Found');
    expect(result.content).toHaveLength(1);
    expect(result.content[0].text).toContain('404');
    expect(result.content[0].text).toContain('Not Found');
  });

  it('errorResponse includes endpoint when provided', () => {
    const result = errorResponse(500, 'Server Error', 'https://api.example.com/test');
    expect(result.content[0].text).toContain('https://api.example.com/test');
  });

  it('jsonResponse serializes object', () => {
    const result = jsonResponse({ foo: 'bar', num: 42 });
    expect(result.content).toHaveLength(1);
    const parsed = JSON.parse(result.content[0].text);
    expect(parsed).toEqual({ foo: 'bar', num: 42 });
  });
});

describe('delay', () => {
  it('resolves after specified time', async () => {
    const start = Date.now();
    await delay(50);
    const elapsed = Date.now() - start;
    expect(elapsed).toBeGreaterThanOrEqual(40); // allow small timing variance
  });
});
