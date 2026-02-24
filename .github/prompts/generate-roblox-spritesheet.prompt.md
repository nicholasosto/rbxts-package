---
description: "Generate a sprite sheet for Roblox particle/animation use"
[vscode, execute, read, agent, edit, search, web,'ai-generation-mcp/*', todo]
---

# Roblox Sprite Sheet Generator

You are generating a sprite sheet image for use in Roblox Studio.

## Constraints

- Output must be a **square power-of-2** image: 1024x1024 or 2048x2048
- Grid layout: ${rows}x${columns} evenly spaced frames
- Each frame must be self-contained with no bleed into adjacent cells
- Background must be **transparent** (alpha channel)
- All frames should maintain consistent style, lighting, and scale

## Generation Instructions

Use the `generate_image` MCP tool with these settings:

- size: "${size:1024x1024}"
- style: "${style:digital-art}"
- prompt suffix: "sprite sheet grid layout, ${rows:4}x${columns:4} frames, transparent background, game asset, clean cell boundaries, no overlap between frames"

## Metadata Output

After generation, output a Lua-ready config block:

```lua
local SpriteSheet = {
    imageSize = Vector2.new(${totalWidth}, ${totalHeight}),
    frameSize = Vector2.new(${totalWidth / columns}, ${totalHeight / rows}),
    rows = ${rows},
    columns = ${columns},
    frameCount = ${frameCount},
    offsets = {} -- populated below
}

for row = 0, SpriteSheet.rows - 1 do
    for col = 0, SpriteSheet.columns - 1 do
        table.insert(SpriteSheet.offsets, Vector2.new(
            col * SpriteSheet.frameSize.X,
            row * SpriteSheet.frameSize.Y
        ))
    end
end
```

Always confirm the grid dimensions with the user before generating.
