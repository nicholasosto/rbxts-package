/**
 * @nicholasosto/ai-tools — Type Definitions
 *
 * All public interfaces and type aliases for the ai-tools package.
 */

// ─── Configuration ─────────────────────────────────────────────────────────────

/** Configuration required to create an AI session. */
export interface AIToolsConfig {
  /** Your OpenAI API key (e.g. "sk-..."). */
  apiKey: string;

  /** Default model for text generation. @default "gpt-5.2" */
  defaultTextModel?: string;

  /** Default model for image generation. @default "gpt-image-1" */
  defaultImageModel?: string;

  /** Maximum number of automatic retries on transient errors. @default 2 */
  maxRetries?: number;

  /** Request timeout in milliseconds. @default 60_000 */
  timeout?: number;
}

// ─── Text Generation ───────────────────────────────────────────────────────────

/** Options for a single text generation call. */
export interface TextGenerationOptions {
  /** Override the model for this request (e.g. "gpt-5-mini"). */
  model?: string;

  /** System-level instructions that guide the model's behaviour. */
  instructions?: string;

  /** Sampling temperature (0 = deterministic, 2 = creative). @default 1 */
  temperature?: number;

  /** Maximum number of tokens to generate. */
  maxOutputTokens?: number;
}

/** Result returned from a text generation call. */
export interface TextGenerationResult {
  /** The generated text content. */
  text: string;

  /** The model that was actually used. */
  model: string;

  /** OpenAI request ID for debugging / support tickets. */
  requestId: string;

  /** Token usage statistics. */
  usage: {
    inputTokens: number;
    outputTokens: number;
  };
}

// ─── Image Generation ──────────────────────────────────────────────────────────

/** Supported image output sizes. */
export type ImageSize = '1024x1024' | '1024x1536' | '1536x1024' | 'auto';

/** Image quality level. */
export type ImageQuality = 'low' | 'medium' | 'high' | 'auto';

/** Image output format. */
export type ImageOutputFormat = 'png' | 'jpeg' | 'webp';

/** Options for a single image generation call. */
export interface ImageGenerationOptions {
  /** Override the model for this request. */
  model?: string;

  /** Desired image dimensions. @default "1024x1024" */
  size?: ImageSize;

  /** Rendering quality level. @default "auto" */
  quality?: ImageQuality;

  /** Number of images to generate (1-4). @default 1 */
  n?: number;

  /** Output format. @default "png" */
  outputFormat?: ImageOutputFormat;
}

/** A single generated image. */
export interface GeneratedImage {
  /** Base-64 encoded image data (when response_format is "b64_json"). */
  b64Data?: string;

  /** Temporary URL to the generated image (when response_format is "url"). */
  url?: string;
}

/** Result returned from an image generation call. */
export interface ImageGenerationResult {
  /** Array of generated images. */
  images: GeneratedImage[];

  /** The model that was actually used. */
  model: string;

  /** OpenAI request ID for debugging / support tickets. */
  requestId: string;
}

// ─── Session ───────────────────────────────────────────────────────────────────

/** The public interface returned by `createAISession()`. */
export interface AISession {
  /** Generate text from a prompt. */
  generateText(prompt: string, options?: TextGenerationOptions): Promise<TextGenerationResult>;

  /** Generate one or more images from a prompt. */
  generateImage(prompt: string, options?: ImageGenerationOptions): Promise<ImageGenerationResult>;
}
