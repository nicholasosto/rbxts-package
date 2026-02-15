/**
 * Quick smoke test for @nicholasosto/ai-tools
 *
 * Usage:
 *   npx tsx packages/ai-tools/src/test.ts
 *
 * Reads OPENAI_API_KEY from the monorepo root .env file automatically.
 * See .env.example for the expected keys.
 */

import { createAISessionFromEnv } from './index.js';

const session = createAISessionFromEnv();

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
