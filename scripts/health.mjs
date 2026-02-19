#!/usr/bin/env node

/**
 * Health Check Script
 *
 * Runs all quality gates and produces a summary.
 * Usage: pnpm health
 */

import { execSync } from 'node:child_process';

const checks = [
  { name: 'Lint', command: 'npx nx run-many -t lint --parallel=3' },
  { name: 'Typecheck', command: 'npx nx run-many -t typecheck --parallel=3' },
  { name: 'Build', command: 'npx nx run-many -t build --parallel=3' },
  { name: 'Test', command: 'npx nx run-many -t test --parallel=3' },
  { name: 'Dead exports', command: 'npx knip' },
  { name: 'Formatting', command: 'npx prettier --check "packages/*/src/**/*.{ts,tsx,json}"' },
];

const results = [];

console.log('\n🏥 Running health checks...\n');
console.log('─'.repeat(50));

for (const check of checks) {
  const start = Date.now();
  try {
    execSync(check.command, { stdio: 'pipe', cwd: process.cwd() });
    const elapsed = ((Date.now() - start) / 1000).toFixed(1);
    results.push({ ...check, passed: true, elapsed });
    console.log(`  ✅ ${check.name} (${elapsed}s)`);
  } catch {
    const elapsed = ((Date.now() - start) / 1000).toFixed(1);
    results.push({ ...check, passed: false, elapsed });
    console.log(`  ❌ ${check.name} (${elapsed}s)`);
  }
}

console.log('─'.repeat(50));

const passed = results.filter((r) => r.passed).length;
const total = results.length;
const allPassed = passed === total;

console.log(`\n${allPassed ? '🎉' : '⚠️'}  ${passed}/${total} checks passed\n`);

process.exit(allPassed ? 0 : 1);
