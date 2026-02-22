# Soul Steel — Copilot Instructions

This is a **roblox-ts monorepo** for a Roblox dark-fantasy RPG called **Soul Steel**.

## Package Map

| Package                        | Runtime         | Purpose                                                             |
| ------------------------------ | --------------- | ------------------------------------------------------------------- |
| `@nicholasosto/assets`         | roblox-ts → Lua | Asset catalogs (images, animations, audio, rigs) with branded types |
| `@nicholasosto/combat-stats`   | roblox-ts → Lua | Attribute registry, stat formulas, combat state types               |
| `@nicholasosto/timer`          | roblox-ts → Lua | Timer decorators and display utilities                              |
| `@nicholasosto/ultra-ui`       | roblox-ts → Lua | UI components (bars, nameplates, panels, inventory)                 |
| `@nicholasosto/name-generator` | roblox-ts → Lua | Procedural name generation                                          |
| `@nicholasosto/game-test`      | roblox-ts → Lua | Main game project (consumes all roblox-ts packages)                 |
| `@nicholasosto/ai-tools`       | Node.js         | OpenAI session wrapper (text, image, vision)                        |
| `@nicholasosto/node-tools`     | Node.js         | Environment loading, file utilities                                 |
| `@nicholasosto/mcp-server`     | Node.js         | MCP server exposing AI, Roblox, and monorepo tools                  |

**Do not mix** roblox-ts APIs (`game`, `Workspace`, `Players`, `math.*`) with Node.js APIs (`fs`, `path`, `process`). They compile to completely different runtimes.

## Game Entity Data

All game world data (monsters, abilities, factions, classes, items, lore) lives in `game-docs/soul-steel/` as YAML + Markdown pairs. See `game-docs/README.md` for full conventions.

- Schemas: `game-docs/.schemas/`
- Templates: `game-docs/soul-steel/{category}/_template.yaml`
- Agent prompts: `.github/prompts/create-*.prompt.md`

## Key Vocabulary

- **Domains**: `blood`, `decay`, `spirit`, `robot`, `fateless`
- **Attributes**: `strength`, `vitality`, `agility`, `intelligence`, `spirit`, `luck`
- **Rarity**: `common`, `uncommon`, `rare`, `epic`, `legendary`, `mythic`
- **Entity IDs**: Always kebab-case (e.g., `skeleton-warrior`, `fire-bolt`)
