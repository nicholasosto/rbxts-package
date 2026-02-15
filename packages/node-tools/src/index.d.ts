/**
 * @nicholasosto/node-tools
 *
 * Node.js dev tooling and scripts for the rbxts monorepo.
 * Add CLI tools, build scripts, asset pipeline helpers, etc.
 */
export type { OpenAIConfig, RobloxCloudConfig, ServiceConfigMap, ServiceName } from './types.js';
export { loadEnv, getRequiredEnv, getOpenAIConfig, getRobloxCloudConfig } from './env.js';
export declare function greet(name: string): string;
