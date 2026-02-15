---
mode: agent
description: "Generate AI images, upload to Roblox as Decals, and register them in the assets package"
tools:
  - mcp_rbxts-mcp_generate_and_upload_decal
  - mcp_rbxts-mcp_thumbnail_get_assets
  - mcp_rbxts-mcp_analyze_image
  - mcp_rbxts-mcp_asset_get_info
  - mcp_rbxts-mcp_get_package_file
---

# Asset Image Creation Pipeline

You are helping create and register new image assets for a Roblox dark-fantasy RPG game.
The assets package is at `packages/assets/src/images/` and uses branded `ImageAsset` types.

## Workflow

Follow these steps for EACH image the user requests:

### 1. Identify the Target
- Ask what sub-catalog the image belongs to (e.g. `SoulGemIcons`, `CurrencyIcons`, `AbilityIcons`)
- Ask for the entry key name (e.g. `ScholarsInsight`)
- Read the current sub-catalog file with `get_package_file` to see existing entries and identify placeholders (`rbxassetid://0`) or duplicates

### 2. Generate & Upload
Call `generate_and_upload_decal` with:
- **name**: The entry key (PascalCase, e.g. `ScholarsInsight`)
- **description**: Short description for Roblox asset metadata
- **imagePrompt**: Visual description — the tool automatically prepends a dark-fantasy RPG style guide. Focus on:
  - The subject/symbol (what does the icon depict?)
  - Colors and distinctive visual elements
  - Mood/feeling
  - Reference to matching existing icons in the same sub-catalog for consistency
- **size**: `1024x1024` (default, best for Roblox decals)
- **quality**: `high`

### 3. Verify the Upload
- Call `thumbnail_get_assets` with the returned asset ID to confirm the image rendered on Roblox CDN
- Show the user the thumbnail URL so they can visually verify
- Optionally call `analyze_image` on the thumbnail URL to verify it matches intent

### 4. Register in Assets Package
- Edit the appropriate file in `packages/assets/src/images/` to add or replace the entry:
  ```typescript
  EntryName: asImageAsset('rbxassetid://<newAssetId>'),
  ```
- Remove any `// TODO` comments from replaced placeholders
- If creating a brand-new sub-catalog file, also update `packages/assets/src/images/index.ts`

## Style Guide (built into the tool, but useful for prompt crafting)

All icons should follow this consistent visual language:
- Dark fantasy / medieval RPG aesthetic
- Deep purple, dark blue, or category-appropriate color palette
- Star-like geometric frame with pointed edges (for soul gems / icons)
- Stone-like textured background
- Soft ambient lighting with mystical glow
- Centered, symmetrical composition
- 2D game UI icon style
- No text in the image

## Sub-Catalog Reference

| Sub-catalog | Theme | Color Guidance |
|-------------|-------|----------------|
| `AbilityIcons` | Combat/magic skill icons | Varies by element |
| `AttributeIcons` | RPG stat icons (Strength, Agility, etc.) | Gold/warm tones |
| `ClassIcons` | Character class emblems | Class-themed |
| `CurrencyIcons` | In-game currency (Coins, Shards, Tombs) | Gold, blue, dark |
| `DomainIcons` | Faction domains (Chaos, Order, Void) | Red/chaotic, gold/orderly, purple/void |
| `EquipmentIcons` | Gear/equipment items | Metallic, material-based |
| `GemIcons` | Gem collectibles | Jewel tones |
| `ItemSlotIcons` | Equipment slot silhouettes | Neutral/grey |
| `MenuPanelIcons` | UI menu navigation icons | Neutral fantasy style |
| `PanelBackgrounds` | Full panel background textures | Domain-themed |
| `RarityFrames` | Item rarity border frames | Common→Legendary colors |
| `Screens` | Full-screen splash images | Cinematic |
| `SoulGemIcons` | Soul gem collectibles | Deep purple with mystical glow |
| `StatusIcons` | Buff/debuff status effects | Effect-colored |
| `Textures` | Tileable surface textures | Material-dependent |
| `BeamTextures` | Beam/trail effect textures | Effect-colored |
| `UiControls` | UI button/control icons | Clean, minimal |

## Constants
- **Roblox User ID**: `3394700055`
- **Asset Type**: `Decal`
- **Creator Type**: `User`

## Important Notes
- The upload API is async — the tool automatically polls for up to 30 seconds to get the final asset ID
- Always verify with `thumbnail_get_assets` before registering
- Keep entry key names in PascalCase to match existing conventions
- Use `as const satisfies Record<string, ImageAsset>` pattern in all sub-catalog files
