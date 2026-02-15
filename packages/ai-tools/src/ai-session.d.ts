/**
 * @nicholasosto/ai-tools — AI Session
 *
 * Factory function that creates an OpenAI-backed session
 * with methods for text and image generation.
 */
import type { AIToolsConfig, AISession } from './types.js';
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
export declare function createAISession(config: AIToolsConfig): AISession;
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
export declare function createAISessionFromEnv(overrides?: Omit<AIToolsConfig, 'apiKey'>): AISession;
