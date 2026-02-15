/**
 * @nicholasosto/ai-tools — Defaults
 *
 * Sensible default values used throughout the package.
 */
/** Default model for text generation (Responses API). */
export const DEFAULT_TEXT_MODEL = 'gpt-5.2';
/** Default model for image generation. */
export const DEFAULT_IMAGE_MODEL = 'gpt-image-1';
/** Default maximum automatic retries on transient errors. */
export const DEFAULT_MAX_RETRIES = 2;
/** Default request timeout in milliseconds (60 seconds). */
export const DEFAULT_TIMEOUT = 60_000;
/** Default image output size. */
export const DEFAULT_IMAGE_SIZE = '1024x1024';
/** Default image quality level. */
export const DEFAULT_IMAGE_QUALITY = 'auto';
/** Default image output format. */
export const DEFAULT_IMAGE_FORMAT = 'png';
/** Default number of images to generate per request. */
export const DEFAULT_IMAGE_COUNT = 1;
