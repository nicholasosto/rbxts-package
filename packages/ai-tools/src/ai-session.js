/**
 * @nicholasosto/ai-tools — AI Session
 *
 * Factory function that creates an OpenAI-backed session
 * with methods for text and image generation.
 */
import OpenAI from 'openai';
import { getOpenAIConfig } from '@nicholasosto/node-tools';
import { DEFAULT_TEXT_MODEL, DEFAULT_IMAGE_MODEL, DEFAULT_MAX_RETRIES, DEFAULT_TIMEOUT, DEFAULT_IMAGE_SIZE, DEFAULT_IMAGE_QUALITY, DEFAULT_IMAGE_FORMAT, DEFAULT_IMAGE_COUNT, } from './defaults.js';
/**
 * Create a new AI session backed by the OpenAI API.
 *
 * @example
 * ```ts
 * const session = createAISession({ apiKey: 'sk-...' });
 *
 * const text = await session.generateText('Explain recursion in one sentence.');
 * console.log(text.text);
 *
 * const image = await session.generateImage('A pixel-art dragon');
 * console.log(image.images[0].b64Data);
 * ```
 */
export function createAISession(config) {
    const { apiKey, defaultTextModel = DEFAULT_TEXT_MODEL, defaultImageModel = DEFAULT_IMAGE_MODEL, maxRetries = DEFAULT_MAX_RETRIES, timeout = DEFAULT_TIMEOUT, } = config;
    const client = new OpenAI({
        apiKey,
        maxRetries,
        timeout,
    });
    // ─── Text Generation ───────────────────────────────────────────────────
    async function generateText(prompt, options = {}) {
        const { model = defaultTextModel, instructions, temperature, maxOutputTokens } = options;
        const response = await client.responses.create({
            model,
            input: prompt,
            ...(instructions && { instructions }),
            ...(temperature !== undefined && { temperature }),
            ...(maxOutputTokens !== undefined && { max_output_tokens: maxOutputTokens }),
        });
        return {
            text: response.output_text,
            model: response.model,
            requestId: response._request_id ?? '',
            usage: {
                inputTokens: response.usage?.input_tokens ?? 0,
                outputTokens: response.usage?.output_tokens ?? 0,
            },
        };
    }
    // ─── Image Generation ──────────────────────────────────────────────────
    async function generateImage(prompt, options = {}) {
        const { model = defaultImageModel, size = DEFAULT_IMAGE_SIZE, quality = DEFAULT_IMAGE_QUALITY, n = DEFAULT_IMAGE_COUNT, outputFormat = DEFAULT_IMAGE_FORMAT, } = options;
        const response = await client.images.generate({
            model,
            prompt,
            size,
            quality,
            n,
            output_format: outputFormat,
        });
        const images = (response.data ?? []).map((img) => ({
            b64Data: img.b64_json ?? undefined,
            url: img.url ?? undefined,
        }));
        return {
            images,
            model,
            requestId: response._request_id ?? '',
        };
    }
    // ─── Return Session ────────────────────────────────────────────────────
    return { generateText, generateImage };
}
/**
 * Create an AI session using the API key from environment variables.
 *
 * Reads `OPENAI_API_KEY` from the monorepo root `.env` file (via `@nicholasosto/node-tools`).
 * All other config options can be overridden via the optional `overrides` parameter.
 *
 * @example
 * ```ts
 * const session = createAISessionFromEnv();
 * const result = await session.generateText('Hello!');
 * ```
 */
export function createAISessionFromEnv(overrides = {}) {
    const { apiKey } = getOpenAIConfig();
    return createAISession({ apiKey, ...overrides });
}
