# @nicholasosto/mcp-server

A **Model Context Protocol (MCP) server** that bridges AI capabilities (OpenAI) with Roblox Open Cloud APIs and monorepo introspection tools. Designed for use with MCP-compatible clients like VS Code Copilot, Claude Desktop, or any JSON-RPC stdio client.

## Quick Start

```bash
# Development (with tsx)
npx tsx packages/mcp-server/src/index.ts

# Production (after build)
pnpm build --filter @nicholasosto/mcp-server
node packages/mcp-server/dist/index.js
```

### VS Code / Claude Desktop Configuration

Add to your MCP client config:

```json
{
  "mcpServers": {
    "rbxts-mcp": {
      "command": "npx",
      "args": ["tsx", "packages/mcp-server/src/index.ts"],
      "cwd": "/path/to/rbxts-package"
    }
  }
}
```

## Environment Variables

Create a `.env` file at the monorepo root:

```env
# Required
ROBLOX_CLOUD_API_KEY=your-roblox-open-cloud-api-key
OPENAI_API_KEY=sk-your-openai-api-key

# Optional (have hardcoded fallbacks)
ROBLOX_UNIVERSE_ID=9730686096
ROBLOX_PLACE_ID=87666753607582
ROBLOX_CREATOR_ID=3394700055
ROBLOX_USER_ID=3394700055
MONOREPO_PACKAGES_DIR=/absolute/path/to/packages

# Logging
LOG_LEVEL=info  # debug | info | warn | error
```

The server validates environment variables at startup and logs warnings for any missing optional values.

## Tool Reference

### AI / OpenAI Tools

| Tool                        | Description                                                    |
| --------------------------- | -------------------------------------------------------------- |
| `generate_text`             | Generate text using OpenAI with model/temperature overrides    |
| `generate_image`            | Generate images (DALL-E) with size/quality/format options      |
| `analyze_image`             | Analyze images using GPT-4o vision (categorize, describe, OCR) |
| `generate_and_upload_decal` | Combined pipeline: generate image → upload to Roblox → verify  |

### Roblox DataStore Tools

| Tool                    | Description                       |
| ----------------------- | --------------------------------- |
| `datastore_list_stores` | List all DataStores in a universe |
| `datastore_list_keys`   | List keys in a specific DataStore |
| `datastore_get_entry`   | Get a single entry by key         |
| `datastore_set_entry`   | Create or update an entry         |

### Roblox Asset Tools

| Tool                         | Description                                |
| ---------------------------- | ------------------------------------------ |
| `asset_get_info`             | Get asset metadata by ID                   |
| `asset_update`               | Update display name / description          |
| `asset_list_versions`        | List version history                       |
| `asset_get_version`          | Get a specific version                     |
| `asset_rollback_version`     | Rollback to a previous version             |
| `asset_archive`              | Archive an asset                           |
| `asset_restore`              | Restore an archived asset                  |
| `asset_search_creator_store` | Search the Creator Store                   |
| `asset_upload`               | Upload a new asset (binary-safe multipart) |

### Roblox Engine (Instance) Tools

| Tool                     | Description                                |
| ------------------------ | ------------------------------------------ |
| `instance_get`           | Get instance properties by ID              |
| `instance_list_children` | List children (use `"root"` for top-level) |
| `instance_update`        | Update instance properties                 |
| `instance_create`        | Create a new instance                      |
| `instance_delete`        | Delete an instance and its descendants     |

### Roblox Inventory Tools

| Tool                          | Description                                |
| ----------------------------- | ------------------------------------------ |
| `inventory_list_items`        | List a user's inventory items with filters |
| `inventory_check_ownership`   | Check if a user owns specific assets       |
| `inventory_list_collectibles` | List limited/collectible items             |

### Other Tools

| Tool                   | Description                              |
| ---------------------- | ---------------------------------------- |
| `messaging_publish`    | Publish to a MessagingService topic      |
| `thumbnail_get_assets` | Get CDN thumbnail URLs (public, no auth) |
| `list_packages`        | List all monorepo packages               |
| `get_package_exports`  | Read a package's barrel index.ts         |
| `get_package_types`    | Read a package's types.ts                |
| `get_package_file`     | Read any file from a package             |

## Architecture

```
src/
├── index.ts              # Shebang entry point (stdio transport)
├── server.ts             # Server factory: loads env, registers tools
├── config.ts             # Central configuration & env var validation
├── logger.ts             # Structured stderr logging
├── roblox-helpers.ts     # Shared: fetch w/ retry, polling, multipart, content helpers
├── types.ts              # Re-exports for backward compatibility
├── tools/
│   ├── index.ts                  # Barrel export
│   ├── text-generation.ts        # generate_text
│   ├── image-generation.ts       # generate_image
│   ├── image-analysis.ts         # analyze_image
│   ├── asset-image-pipeline.ts   # generate_and_upload_decal
│   ├── roblox-datastores.ts      # datastore_* tools
│   ├── roblox-messaging.ts       # messaging_publish
│   ├── roblox-assets.ts          # asset_* tools
│   ├── roblox-instances.ts       # instance_* tools
│   ├── roblox-inventories.ts     # inventory_* tools
│   ├── roblox-thumbnails.ts      # thumbnail_get_assets
│   └── package-info.ts           # list_packages, get_package_*
├── categorize-decals.ts  # Standalone: batch decal categorization script
├── apply-renames.ts      # Standalone: apply proposed renames
└── __tests__/
    ├── config.test.ts
    ├── logger.test.ts
    ├── roblox-helpers.test.ts
    └── server.test.ts
```

### Key Design Decisions

**Registration pattern** — Each tool module exports a single `registerXxxTools(server)` function. Adding a new tool group requires creating the file and adding two lines (export + registration call).

**Call-time configuration** — API keys and default IDs are read from environment at tool call time (not server startup), supporting key rotation without restarts and catching missing keys with clear error messages.

**Binary-safe uploads** — Asset uploads use `Buffer.concat()` for multipart body construction, correctly handling binary data that would be corrupted by string-based approaches.

**Automatic retry** — The `robloxFetch()` wrapper retries on 429 (rate limit) and 5xx (server error) responses with exponential backoff.

**Operation polling** — Roblox Engine and Assets APIs return long-running operations. The shared `pollOperation()` utility handles automatic polling until completion or timeout.

**Structured logging** — All logs go to stderr (never stdout, which is reserved for JSON-RPC). Log level is configurable via `LOG_LEVEL` env var.

## Development

```bash
# Type-check
pnpm typecheck --filter @nicholasosto/mcp-server

# Run tests
pnpm test --filter @nicholasosto/mcp-server

# Build
pnpm build --filter @nicholasosto/mcp-server

# Dev mode (auto-restarts)
npx tsx packages/mcp-server/src/index.ts
```

## Dependencies

| Package                     | Purpose                                 |
| --------------------------- | --------------------------------------- |
| `@modelcontextprotocol/sdk` | MCP protocol implementation             |
| `@nicholasosto/ai-tools`    | OpenAI API wrapper (workspace)          |
| `@nicholasosto/node-tools`  | Environment loading, config (workspace) |
| `zod`                       | Input validation with type-safe schemas |
