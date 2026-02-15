/**
 * Quick smoke test for @nicholasosto/ai-tools
 *
 * Usage:
 *   OPENAI_API_KEY="sk-..." node --loader ts-node/esm packages/ai-tools/src/test.ts
 *
 *   — or after building —
 *   OPENAI_API_KEY="sk-..." node packages/ai-tools/dist/test.js
 */

import { createAISession } from './index.js';

const apiKey = process.env['OPENAI_API_KEY'];
if (!apiKey) {
  console.error('❌  Set OPENAI_API_KEY env var before running this test.');
  process.exit(1);
}

const session = createAISession({ apiKey });

console.log('── Text Generation ──');
const textResult = await session.generateText('Say hello in three languages.', {
  temperature: 0.7,
  maxOutputTokens: 200,
});
console.log('Model:', textResult.model);
console.log('Text:', textResult.text);
console.log('Usage:', textResult.usage);

console.log('\n── Image Generation ──');
const imageResult = await session.generateImage('A pixel-art red dragon on a white background', {
  size: '1024x1024',
  quality: 'low',
});
console.log('Model:', imageResult.model);
console.log('Images:', imageResult.images.length);
console.log('Has b64 data:', !!imageResult.images[0]?.b64Data);
console.log('Has URL:', !!imageResult.images[0]?.url);

console.log('\n✅  All tests passed.');
