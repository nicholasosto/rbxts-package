# ADR 0003: Error Handling Strategy

**Status:** Proposed
**Date:** 2026-02-18

## Context

The audit found inconsistent error handling across packages:
- `node-tools` throws descriptive errors with context
- `mcp-server` has multiple silent `catch` blocks that swallow errors
- Roblox-TS packages assume valid inputs with no error handling

## Decision

Adopt a tiered error handling strategy:

### Node.js packages (node-tools, ai-tools)
- Throw descriptive `Error` objects with context (current pattern in node-tools)
- Callers decide whether to catch, log, or propagate

### MCP Server
- Tool handlers should catch errors and return them as MCP error responses (not silent swallows)
- Use a shared `handleToolError(error, toolName)` helper that:
  1. Logs the error with tool context
  2. Returns a structured MCP error response
- Replace all existing empty/silent catch blocks

### Roblox-TS packages
- Use `pcall()` / error patterns where Roblox runtime failures are possible
- Document expected input constraints via JSDoc rather than runtime validation (TypeScript types provide compile-time safety)

## Consequences

- **Positive:** No more silent failures in mcp-server tools
- **Positive:** Consistent error context for debugging
- **Action required:** Refactor 6 silent catch blocks identified in audit
