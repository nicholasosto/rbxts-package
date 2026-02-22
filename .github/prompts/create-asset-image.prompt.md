---
mode: agent
description: 'Search local assets, generate AI images, save locally, upload to Roblox, and register in the assets package'
tools:
  - mcp_rbxts-mcp_search_local_assets
  - mcp_rbxts-mcp_generate_and_upload_decal
  - mcp_rbxts-mcp_generate_and_save_local
  - mcp_rbxts-mcp_thumbnail_get_assets
  - mcp_rbxts-mcp_analyze_image
  - mcp_rbxts-mcp_asset_get_info
  - mcp_rbxts-mcp_get_package_file
  - mcp_rbxts-mcp_game_docs_read
  - mcp_rbxts-mcp_game_docs_asset_status
  - mcp_rbxts-mcp_game_docs_asset_assign
---

# Asset Image Creation Pipeline

You are helping create and register new image assets for a Roblox dark-fantasy RPG game.
The assets package is at `packages/assets/src/images/` and uses branded `ImageAsset` types.
All generated images are **saved locally first**, then uploaded to Roblox.

## Local Assets Directory

Generated and existing images live under:

```
~/GameDev/assets/images/
```

The directory has these subfolders:

- `icons/` — existing hand-made and generated icons (legacy naming: `Icon - Name.png`)
- `characters-portraits/` — character portraits
- `part-textures/` — 3D part textures
- `particle-emitter-textures/` — VFX textures
- `ui-instance-background/` — UI panel backgrounds
- `design-images-prototypes/` — concept art
- `skybox-sets/` — skybox images
- `slice-frames/` — 9-slice UI frames
- `raw/` — unprocessed source images

Game-docs asset-map paths use a category structure:

```
abilities/bone-strike/icon.png
bestiary/skeleton-warrior/portrait.png
items/tattered-blade/icon.png
```

## Workflow

Follow these steps for EACH image the user requests:

### 1. Check Asset Map

- Use `game_docs_asset_status` to find the slot's current status, `suggestedFilename`, and `prompt`
- If the slot is already `assigned`, inform the user — it already has an asset

### 2. Search Local Assets First

**Always search before generating.** Call `search_local_assets` with:

- **exactPath**: The `suggestedFilename` from the asset-map (checks if the image was previously generated)
- **keywords**: Relevant terms from the entity name and slot type (e.g. `["bone", "strike"]` or `["skeleton", "warrior", "icon"]`)

If a suitable local image is found:

- Show the user the match(es) and ask if they want to use an existing one or generate fresh
- If they want to use an existing one, call `analyze_image` on it to confirm it's suitable
- Then skip to **Step 4** (Upload to Roblox) — the existing image just needs uploading and registering

### 3. Generate & Save Locally

If no suitable local image exists, call `generate_and_upload_decal` with:

- **name**: The entry key (PascalCase, e.g. `BoneStrike`)
- **description**: Short description for Roblox asset metadata
- **imagePrompt**: Visual description — use the `prompt` from the asset-map YAML if available. The tool automatically prepends a dark-fantasy RPG style guide. Focus on:
  - The subject/symbol (what does the icon depict?)
  - Colors and distinctive visual elements
  - Mood/feeling
  - Reference to matching existing icons in the same sub-catalog for consistency
- **localPath**: The `suggestedFilename` from the asset-map YAML (e.g. `abilities/bone-strike/icon.png`). This saves the PNG to `LOCAL_ASSETS_DIR/images/{localPath}` before uploading.
- **size**: `1024x1024` (default, best for Roblox decals)
- **quality**: `high`

> **Tip**: If the user wants to review locally before uploading, use `generate_and_save_local`
> instead, then upload separately after approval.

### 4. Verify the Upload

- Call `thumbnail_get_assets` with the returned asset ID to confirm the image rendered on Roblox CDN
- Show the user the thumbnail URL so they can visually verify
- Optionally call `analyze_image` on the thumbnail URL to verify it matches intent

### 5. Register in Assets Package

- Read the current sub-catalog file with `get_package_file` to see existing entries
- Edit the appropriate file in `packages/assets/src/images/` to add or replace the entry:
  ```typescript
  EntryName: asImageAsset('rbxassetid://<newAssetId>'),
  ```
- Remove any `// TODO` comments from replaced placeholders
- If creating a brand-new sub-catalog file, also update `packages/assets/src/images/index.ts`

### 6. Update the Asset Map

- Call `game_docs_asset_assign` to update the asset-map slot:
  - Set `status` to `assigned`
  - Set `assetRef` to `rbxassetid://<newAssetId>`
- This keeps the game-docs pipeline in sync with what's been generated

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

| Sub-catalog        | Theme                                    | Color Guidance                         |
| ------------------ | ---------------------------------------- | -------------------------------------- |
| `AbilityIcons`     | Combat/magic skill icons                 | Varies by element                      |
| `AttributeIcons`   | RPG stat icons (Strength, Agility, etc.) | Gold/warm tones                        |
| `ClassIcons`       | Character class emblems                  | Class-themed                           |
| `CurrencyIcons`    | In-game currency (Coins, Shards, Tombs)  | Gold, blue, dark                       |
| `DomainIcons`      | Faction domains (Chaos, Order, Void)     | Red/chaotic, gold/orderly, purple/void |
| `EquipmentIcons`   | Gear/equipment items                     | Metallic, material-based               |
| `GemIcons`         | Gem collectibles                         | Jewel tones                            |
| `ItemSlotIcons`    | Equipment slot silhouettes               | Neutral/grey                           |
| `MenuPanelIcons`   | UI menu navigation icons                 | Neutral fantasy style                  |
| `PanelBackgrounds` | Full panel background textures           | Domain-themed                          |
| `RarityFrames`     | Item rarity border frames                | Common→Legendary colors                |
| `Screens`          | Full-screen splash images                | Cinematic                              |
| `SoulGemIcons`     | Soul gem collectibles                    | Deep purple with mystical glow         |
| `StatusIcons`      | Buff/debuff status effects               | Effect-colored                         |
| `Textures`         | Tileable surface textures                | Material-dependent                     |
| `BeamTextures`     | Beam/trail effect textures               | Effect-colored                         |
| `UiControls`       | UI button/control icons                  | Clean, minimal                         |

## Constants

- **Roblox User ID**: `3394700055`
- **Asset Type**: `Decal`
- **Creator Type**: `User`

## Important Notes

- The upload API is async — the tool automatically polls for up to 30 seconds to get the final asset ID
- Always verify with `thumbnail_get_assets` before registering
- Keep entry key names in PascalCase to match existing conventions
- Use `as const satisfies Record<string, ImageAsset>` pattern in all sub-catalog files
