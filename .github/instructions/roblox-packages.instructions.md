---
applyTo: '**/packages/{assets,combat-stats,timer,ultra-ui,name-generator,game-test}/**'
---

# Roblox-TS Packages — Copilot Context

You are working in a **roblox-ts** package that compiles to Lua and runs in the Roblox engine.

## Build & Runtime

- Compiler: `rbxtsc` (TypeScript → Luau)
- Runtime: Roblox engine (Luau VM)
- Build command: `npx rbxtsc` or Nx target `build`
- Output: `out/` directory

## Key Conventions

- Use `math.floor()`, `math.min()`, `math.max()`, `math.clamp()` — NOT `Math.floor()` etc.
- Use `as const satisfies Record<K, V>` for typed constant catalogs
- Use branded types for asset URIs: `ImageAsset`, `AnimationAsset`, `AudioAsset`, `MeshAsset`
- Helper functions: `asImageAsset('rbxassetid://...')`, `asAnimationAsset(...)`, etc.
- Barrel exports via `index.ts` in each package

## Available Roblox APIs

`game`, `Workspace`, `Players`, `ReplicatedStorage`, `ServerScriptService`, `RunService`, `UserInputService`, `TweenService`, `HttpService`

## DO NOT USE

- `fs`, `path`, `process`, `Buffer` (Node.js APIs — will not compile)
- `Math.*` (use Luau `math.*`)
- `console.log` (use `print()` or `warn()`)
- `setTimeout`/`setInterval` (use `task.delay()`, `task.spawn()`, `RunService.Heartbeat`)

## Attribute System (combat-stats)

The `AttributeRegistry` pattern:

- 6 base attributes: strength, vitality, agility, intelligence, spirit, luck
- 9 derived stats computed via formulas
- `createDefaultRegistry()` factory function
- Types: `AttributeDefinition`, `DerivedStatDefinition`, `StatProfile`, `CombatState`

## Asset Catalogs (assets)

- `IMAGE_CATALOG.{SubCatalog}.{EntryName}` — typed as `ImageAsset`
- `ANIMATION_CATALOG.{SubCatalog}.{EntryName}` — typed as `AnimationAsset`
- `RIG_CATALOG.{FactionName}` — indexed by domain (Blood, Decay, Spirit, Robot, Fateless)
- `AUDIO_CATALOG`, `PARTICLE_CATALOG` — same pattern

## Generated Code (combat-stats/src/generated/)

Files in `src/generated/` are **auto-generated** by the codegen pipeline from `game-docs/soul-steel/*.yaml`. Do not edit them manually — they will be overwritten.
