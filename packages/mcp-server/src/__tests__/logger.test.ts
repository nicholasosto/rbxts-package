import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import { logger } from '../logger.js';

describe('logger', () => {
  let stderrSpy: ReturnType<typeof vi.spyOn>;
  const originalEnv = { ...process.env };

  beforeEach(() => {
    stderrSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    stderrSpy.mockRestore();
    process.env = originalEnv;
  });

  it('logs info messages to stderr', () => {
    process.env.LOG_LEVEL = 'info';
    logger.info('test', 'hello world');
    expect(stderrSpy).toHaveBeenCalledTimes(1);
    expect(stderrSpy.mock.calls[0][0]).toContain('[INFO]');
    expect(stderrSpy.mock.calls[0][0]).toContain('[test]');
    expect(stderrSpy.mock.calls[0][0]).toContain('hello world');
  });

  it('logs error messages', () => {
    process.env.LOG_LEVEL = 'error';
    logger.error('api', 'something broke', { code: 500 });
    expect(stderrSpy).toHaveBeenCalledTimes(1);
    expect(stderrSpy.mock.calls[0][0]).toContain('[ERROR]');
    expect(stderrSpy.mock.calls[0][0]).toContain('"code":500');
  });

  it('respects log level — debug suppressed at info', () => {
    process.env.LOG_LEVEL = 'info';
    logger.debug('test', 'debug msg');
    expect(stderrSpy).not.toHaveBeenCalled();
  });

  it('debug shown when LOG_LEVEL=debug', () => {
    process.env.LOG_LEVEL = 'debug';
    logger.debug('test', 'debug msg');
    expect(stderrSpy).toHaveBeenCalledTimes(1);
    expect(stderrSpy.mock.calls[0][0]).toContain('[DEBUG]');
  });

  it('toolCall redacts fileContent', () => {
    process.env.LOG_LEVEL = 'info';
    logger.toolCall('asset_upload', { name: 'test', fileContent: 'a'.repeat(1000) });
    expect(stderrSpy).toHaveBeenCalledTimes(1);
    const msg = stderrSpy.mock.calls[0][0];
    expect(msg).not.toContain('a'.repeat(100));
    expect(msg).toContain('[base64');
  });

  it('toolCall truncates long values', () => {
    process.env.LOG_LEVEL = 'info';
    logger.toolCall('datastore_set', { value: 'x'.repeat(300) });
    const msg = stderrSpy.mock.calls[0][0];
    expect(msg).toContain('…');
  });

  it('apiResponse logs at debug level', () => {
    process.env.LOG_LEVEL = 'debug';
    logger.apiResponse('https://api.test.com', 200, 150);
    expect(stderrSpy).toHaveBeenCalledTimes(1);
    expect(stderrSpy.mock.calls[0][0]).toContain('200');
    expect(stderrSpy.mock.calls[0][0]).toContain('150ms');
  });

  it('defaults to info level with invalid LOG_LEVEL', () => {
    process.env.LOG_LEVEL = 'invalid';
    logger.info('test', 'should show');
    logger.debug('test', 'should not show');
    expect(stderrSpy).toHaveBeenCalledTimes(1);
  });
});
