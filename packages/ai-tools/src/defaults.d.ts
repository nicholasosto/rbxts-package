/**
 * @nicholasosto/ai-tools — Defaults
 *
 * Sensible default values used throughout the package.
 */
/** Default model for text generation (Responses API). */
export declare const DEFAULT_TEXT_MODEL = "gpt-5.2";
/** Default model for image generation. */
export declare const DEFAULT_IMAGE_MODEL = "gpt-image-1";
/** Default maximum automatic retries on transient errors. */
export declare const DEFAULT_MAX_RETRIES = 2;
/** Default request timeout in milliseconds (60 seconds). */
export declare const DEFAULT_TIMEOUT = 60000;
/** Default image output size. */
export declare const DEFAULT_IMAGE_SIZE: "1024x1024";
/** Default image quality level. */
export declare const DEFAULT_IMAGE_QUALITY: "auto";
/** Default image output format. */
export declare const DEFAULT_IMAGE_FORMAT: "png";
/** Default number of images to generate per request. */
export declare const DEFAULT_IMAGE_COUNT = 1;
