/**
 * Shared module — demonstrates importing from @nicholasosto/assets.
 *
 * This file validates that the workspace dependency link works correctly.
 * The assets package should resolve both at compile time (IntelliSense)
 * and at runtime (via Rojo's node_modules mapping).
 */
import {
  ANIMATION_CATALOG,
  AUDIO_CATALOG,
  IMAGE_CATALOG,
  RIG_CATALOG,
  PARTICLE_CATALOG,
  MathUtils,
  StringUtils,
} from '@nicholasosto/assets';

// --- Verify asset access patterns ---

// Animation: get a specific melee animation ID
export const TestMeleeAnim = ANIMATION_CATALOG.Melee.BasicMelee01;

// Audio: get a UI sound effect
export const TestButtonSound = AUDIO_CATALOG.SfxUi.ButtonClick;

// Image: get an ability icon
export const TestFireballIcon = IMAGE_CATALOG.AbilityIcons.Fireball;

// Rig: get a faction rig name
export const TestRig = RIG_CATALOG.Robot.Steambot;

// Particle: get a status effect name
export const TestParticle = PARTICLE_CATALOG.Status.Burning;

// Utility: math and string helpers
export const TestClamp = MathUtils.clamp(150, 0, 100); // 100
export const TestFormat = StringUtils.formatNumber(1234567); // "1,234,567"

print('[game-test] Asset imports verified successfully');
print(`  Melee Animation: ${TestMeleeAnim}`);
print(`  Button Sound: ${TestButtonSound}`);
print(`  Fireball Icon: ${TestFireballIcon}`);
print(`  Robot Rig: ${TestRig}`);
print(`  Burn Particle: ${TestParticle}`);
print(`  Clamped Value: ${TestClamp}`);
print(`  Formatted Number: ${TestFormat}`);
