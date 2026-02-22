---
applyTo: '**/packages/{mcp-server,ai-tools,node-tools}/**'
---

# Node.js Packages — Copilot Context

You are working in a **Node.js** package that runs in the Node runtime (not Roblox).

## Build & Runtime

- Compiler: `tsc` (TypeScript → JavaScript ESM)
- Runtime: Node.js (v20+)
- Build command: `npx tsc -p tsconfig.build.json`
- Output: `dist/` directory
- Tests: `vitest`

## Key Conventions

- ES Modules (`"type": "module"` in package.json)
- Import with `.js` extension: `import { foo } from './bar.js'`
- Zod for runtime validation of tool inputs
- Environment variables via `@nicholasosto/node-tools` (`loadEnv`, `getRequiredEnv`)
- Structured logging via `logger` (stderr, not stdout — important for MCP stdio transport)

## MCP Server Architecture (mcp-server)

- Server factory: `createServer()` in `server.ts`
- Tool registration: Each file exports `register*Tools(server: McpServer)` function
- Tool barrel: All registrations re-exported from `tools/index.ts`
- Config: Lazy env getters in `config.ts` (call-time reads for key rotation)
- Helpers: `robloxFetch()` with retry, `pollOperation()`, `buildMultipartBody()`, `textContent()`

### Adding a New Tool Group

1. Create `tools/{group-name}.ts` with `export function register{GroupName}Tools(server: McpServer): void`
2. Add export to `tools/index.ts`
3. Call the registration function in `server.ts`'s `createServer()`

### Tool Input Pattern

```typescript
server.tool('tool_name', 'Description', { param: z.string() }, async ({ param }) => {
  // implementation
  return { content: [{ type: 'text', text: JSON.stringify(result) }] };
});
```

## AI Tools (ai-tools)

- `createAISessionFromEnv()` — factory using env vars
- `session.generateText(prompt, opts)` — OpenAI Responses API
- `session.generateImage(prompt, opts)` — DALL-E / gpt-image-1
- `session.analyzeImage(url, prompt, opts)` — GPT-4o vision

## DO NOT USE

- Roblox APIs (`game`, `Workspace`, `Players`, `math.*`)
- `require()` (use ESM `import`)
- `console.log` in MCP server (use `logger` to stderr)
