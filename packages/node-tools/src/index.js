/**
 * @nicholasosto/node-tools
 *
 * Node.js dev tooling and scripts for the rbxts monorepo.
 * Add CLI tools, build scripts, asset pipeline helpers, etc.
 */
// ─── Environment Loader ───────────────────────────────────────────────────────
export { loadEnv, getRequiredEnv, getOpenAIConfig, getRobloxCloudConfig } from './env.js';
// ─── Utilities ─────────────────────────────────────────────────────────────────
export function greet(name) {
    return `Hello from node-tools, ${name}!`;
}
