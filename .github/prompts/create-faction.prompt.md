---
mode: agent
description: 'Create a new faction for Soul Steel with YAML data and lore narrative'
tools:
  - mcp_rbxts-mcp_generate_and_upload_decal
  - mcp_rbxts-mcp_get_package_file
---

# Create Faction

You are creating a new faction for the Soul Steel game world.
All faction data lives in `game-docs/soul-steel/factions/` as YAML + Markdown pairs.

## Context

### The Five Domains

| Domain     | Theme                                   |
| ---------- | --------------------------------------- |
| `blood`    | Life force, sacrifice, crimson power    |
| `decay`    | Entropy, undeath, transformation        |
| `spirit`   | Ethereal energy, transcendence, balance |
| `robot`    | Technology, augmentation, precision     |
| `fateless` | Adaptability, freedom, potential        |

### Alignments

- `hostile` — attacks players on sight
- `neutral` — peaceful unless provoked, may offer quests
- `friendly` — allied with players, provides services

### Schema

The faction schema is at `game-docs/.schemas/faction.schema.json`. Required fields:
`id`, `displayName`, `domain`, `alignment`, `description`

## Workflow

### 1. Gather Concept

Ask the user for:

- Faction name and concept
- Which domain it belongs to
- Alignment toward the player
- General theme/purpose in the world

### 2. Generate YAML Data File

Create `game-docs/soul-steel/factions/{faction-id}.yaml` with:

- **bonuses**: 1-2 passive bonuses that reflect the faction's identity
  - Combat factions: damage or defense bonuses
  - Magical factions: mana or ability power bonuses
  - Stealthy factions: speed or crit bonuses
- **units**: Reference existing bestiary entries or note new ones to create
- **tags**: Descriptive tags for filtering

### 3. Write Lore Narrative

Create `game-docs/soul-steel/factions/{faction-id}.md` with:

- A compelling title and opening quote
- **History**: How the faction formed, key events
- **Culture**: Values, rituals, hierarchy
- **Territory**: Where they're found in the world
- **Notable Members**: Key NPCs or leaders (names + brief descriptions)
- **Player Interactions**: Quests, reputation, rewards

Use a dark-fantasy RPG tone. Each faction should feel distinct and have clear motivations players can understand.

### 4. Update Index

Add the faction's ID to `game-docs/soul-steel/factions/_index.yaml` under the `entries` list.

### 5. Cross-Reference Domain

If the domain file exists at `game-docs/soul-steel/world-lore/domains/{domain}.yaml`, add this faction's ID to its `factions` list.

### 6. (Optional) Generate Icon

If the user wants an icon, call `generate_and_upload_decal` with a prompt for a dark-fantasy faction emblem, then update the `icon` field.
