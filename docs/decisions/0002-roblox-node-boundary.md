# ADR 0002: Roblox / Node.js Boundary Enforcement

**Status:** Accepted
**Date:** 2026-02-18

## Context

The monorepo contains packages targeting two incompatible runtimes: Roblox (Lua via roblox-ts) and Node.js. An accidental cross-scope import would compile but fail at runtime — producing bugs that are hard to trace.

## Decision

Enforce scope boundaries automatically via `@nx/enforce-module-boundaries` ESLint rule:

- Each package is tagged with `scope:roblox` or `scope:node` in its `project.json`
- ESLint prevents any import that crosses scope boundaries
- Violations are caught at lint time (pre-commit hook) and in CI

Additionally, packages are tagged `type:lib` or `type:app`:
- Libraries cannot depend on applications
- Applications can depend on libraries

## Consequences

- **Positive:** Cross-scope import mistakes are caught immediately, not at deploy time
- **Positive:** Dependency direction is enforced (no library depending on an app)
- **Trade-off:** Shared types between scopes must be duplicated or extracted to a scope-neutral package if needed in the future
