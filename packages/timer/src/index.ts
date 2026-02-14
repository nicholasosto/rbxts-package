// ─── Timer Package: Barrel Exports ───────────────────────────────────────────

// Types, enums & interfaces
export {
  TimerDirection,
  TimerState,
  TimerFormat,
  TimerAnchor,
  TimerEffect,
  TimerOptions,
  TimerDisplayConfig,
  TimerThreshold,
  EffectEntry,
  TimerTickPayload,
  TimerLifecyclePayload,
  TimerThresholdPayload,
  ResolvedTimerConfig,
  PulseConfig,
  FlashConfig,
  ColorShiftConfig,
  ShakeConfig,
  FadeConfig,
  UrgencyGlowConfig,
  CompletionBurstConfig,
  ProgressRingConfig,
  EffectConfigMap,
} from './types';

// Defaults & config resolution
export {
  ANCHOR_MAP,
  DEFAULT_DISPLAY_CONFIG,
  DEFAULT_TIMER_OPTIONS,
  resolveTimerConfig,
  resolveDisplayConfig,
} from './defaults';

// Formatting
export { formatTime } from './format';

// Signal system
export { TimerHooks } from './signals';

// Core timer
export { Timer } from './timer';

// Effects engine
export { EffectsEngine, DisplayElements } from './effects';

// Display
export { TimerDisplay } from './display';

// Flamework service (server)
export { TimerService } from './timer-service';

// Flamework controller (client)
export { TimerController } from './timer-controller';
