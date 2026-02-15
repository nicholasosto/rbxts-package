/**
 * @nicholasosto/ai-tools
 *
 * OpenAI API wrapper for text and image generation.
 * Create a session with your API key, then call generateText() or generateImage().
 */

// ─── Types ─────────────────────────────────────────────────────────────────────

export type {
  AIToolsConfig,
  AISession,
  TextGenerationOptions,
  TextGenerationResult,
  ImageGenerationOptions,
  ImageGenerationResult,
  GeneratedImage,
  ImageSize,
  ImageQuality,
  ImageOutputFormat,
  ImageAnalysisOptions,
  ImageAnalysisResult,
} from './types.js';

// ─── Core ──────────────────────────────────────────────────────────────────────

export { createAISession, createAISessionFromEnv } from './ai-session.js';

// ─── Defaults ──────────────────────────────────────────────────────────────────

export {
  DEFAULT_TEXT_MODEL,
  DEFAULT_IMAGE_MODEL,
  DEFAULT_VISION_MODEL,
  DEFAULT_MAX_RETRIES,
  DEFAULT_TIMEOUT,
  DEFAULT_IMAGE_SIZE,
  DEFAULT_IMAGE_QUALITY,
  DEFAULT_IMAGE_FORMAT,
  DEFAULT_IMAGE_COUNT,
} from './defaults.js';
