# ADR 0001: Monorepo Structure

**Status:** Accepted
**Date:** 2026-02-18

## Context

This project develops Roblox games using TypeScript (roblox-ts) alongside Node.js tooling for AI integration and Roblox Cloud APIs. We needed to share types, utilities, and build infrastructure across multiple packages targeting different runtimes.

## Decision

Use a pnpm + Nx monorepo with clear separation between two package scopes:

- **scope:roblox** — Packages that compile to Lua via `rbxtsc` and run inside the Roblox engine (assets, combat-stats, timer, name-generator, rpg-ui-bars, game-test)
- **scope:node** — Packages that compile to JavaScript via `tsc` and run in Node.js (node-tools, ai-tools, mcp-server)

Each scope has its own compilation pipeline, TypeScript configuration, and dependency constraints. Cross-scope imports are prohibited via ESLint module boundary rules.

## Consequences

- **Positive:** Clear dependency graph, no circular dependencies, cached incremental builds via Nx
- **Positive:** Each package has a single responsibility and well-defined public API
- **Negative:** Roblox-TS packages can't share runtime code with Node.js packages (they have incompatible module systems)
- **Negative:** Testing Roblox-TS packages requires build verification rather than unit tests (they produce Lua, not runnable JS)
