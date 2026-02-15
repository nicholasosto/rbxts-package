/**
 * @nicholasosto/node-tools — Environment Types
 *
 * Typed configuration interfaces for each external service.
 * Add new service configs here as the project grows.
 */
/** OpenAI service configuration. */
export interface OpenAIConfig {
    /** The OpenAI API key (e.g. "sk-..."). */
    apiKey: string;
}
/** Roblox Open Cloud service configuration. */
export interface RobloxCloudConfig {
    /** The Roblox Cloud API key. */
    apiKey: string;
}
/** Map of service names to their typed config shapes. */
export interface ServiceConfigMap {
    openai: OpenAIConfig;
    robloxCloud: RobloxCloudConfig;
}
/** Union of all known service names. */
export type ServiceName = keyof ServiceConfigMap;
