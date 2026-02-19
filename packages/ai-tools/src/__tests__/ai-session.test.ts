import { describe, it, expect, vi } from 'vitest';
import { createAISession } from '../ai-session.js';
import {
  DEFAULT_TEXT_MODEL,
  DEFAULT_IMAGE_MODEL,
  DEFAULT_MAX_RETRIES,
  DEFAULT_TIMEOUT,
} from '../defaults.js';

// Mock the OpenAI client so tests don't make real API calls
vi.mock('openai', () => {
  const mockResponsesCreate = vi.fn().mockResolvedValue({
    output_text: 'Hello world',
    model: 'gpt-5.2',
    usage: { input_tokens: 10, output_tokens: 5 },
  });

  const mockImagesGenerate = vi.fn().mockResolvedValue({
    data: [{ b64_json: 'base64data', url: undefined }],
  });

  return {
    default: vi.fn().mockImplementation(() => ({
      responses: { create: mockResponsesCreate },
      images: { generate: mockImagesGenerate },
    })),
  };
});

describe('createAISession', () => {
  it('creates a session with required config', () => {
    const session = createAISession({ apiKey: 'sk-test' });
    expect(session).toBeDefined();
    expect(session.generateText).toBeTypeOf('function');
    expect(session.generateImage).toBeTypeOf('function');
    expect(session.analyzeImage).toBeTypeOf('function');
  });

  it('passes config to OpenAI client', async () => {
    const OpenAI = (await import('openai')).default;
    createAISession({
      apiKey: 'sk-custom',
      maxRetries: 5,
      timeout: 30_000,
    });

    expect(OpenAI).toHaveBeenCalledWith({
      apiKey: 'sk-custom',
      maxRetries: 5,
      timeout: 30_000,
    });
  });

  it('uses default values when optional config is omitted', async () => {
    const OpenAI = (await import('openai')).default;
    createAISession({ apiKey: 'sk-defaults' });

    expect(OpenAI).toHaveBeenCalledWith({
      apiKey: 'sk-defaults',
      maxRetries: DEFAULT_MAX_RETRIES,
      timeout: DEFAULT_TIMEOUT,
    });
  });
});

describe('session.generateText', () => {
  it('calls OpenAI responses API and returns structured result', async () => {
    const session = createAISession({ apiKey: 'sk-test' });
    const result = await session.generateText('Test prompt');

    expect(result.text).toBe('Hello world');
    expect(result.model).toBe('gpt-5.2');
    expect(result.usage.inputTokens).toBe(10);
    expect(result.usage.outputTokens).toBe(5);
  });
});

describe('session.generateImage', () => {
  it('calls OpenAI images API and returns structured result', async () => {
    const session = createAISession({ apiKey: 'sk-test' });
    const result = await session.generateImage('A pixel art dragon');

    expect(result.images).toHaveLength(1);
    expect(result.images[0].b64Data).toBe('base64data');
    expect(result.model).toBe(DEFAULT_IMAGE_MODEL);
  });
});
