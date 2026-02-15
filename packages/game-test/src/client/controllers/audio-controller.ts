import { Controller, OnStart } from '@flamework/core';
import { SoundService } from '@rbxts/services';
import Maid from '@rbxts/maid';
import { AUDIO_CATALOG } from '@nicholasosto/assets';
import { clientEvents } from '../network';

/**
 * AudioController
 *
 * Manages client-side audio playback: SFX, music, and voice.
 * Uses AUDIO_CATALOG from the assets package for type-safe audio IDs.
 */
@Controller({})
export class AudioController implements OnStart {
  /** Pool of reusable Sound instances keyed by audio ID */
  private soundPool = new Map<string, Sound>();

  /** Currently playing music track */
  private currentMusic?: Sound;

  private maid = new Maid();

  onStart(): void {
    this.listenForServerEvents();
  }

  /** Listen for server-requested audio cues */
  private listenForServerEvents(): void {
    this.maid.GiveTask(
      clientEvents.AudioCue.connect((audioKey: string) => {
        // Parse "Category.Key" format from server
        const parts = audioKey.split('.');
        if (parts.size() === 2) {
          this.playSfx(parts[0] as keyof typeof AUDIO_CATALOG, parts[1]);
        }
      }),
    );
  }

  /**
   * Play a one-shot sound effect from the catalog.
   * @param category - Top-level category (e.g. 'SfxCombat', 'SfxUi', 'SfxFeedback')
   * @param key - Sound name within the category
   * @param volume - Playback volume 0–1 (default: 1)
   */
  public playSfx(category: keyof typeof AUDIO_CATALOG, key: string, volume = 1): void {
    const catalog = AUDIO_CATALOG[category] as Record<string, { readonly __brand: string }>;
    const soundId = catalog[key];
    if (!soundId) {
      warn(`[AudioController] Unknown SFX: ${category}.${key}`);
      return;
    }

    const cacheKey = `${category}.${key}`;
    let sound = this.soundPool.get(cacheKey);

    if (!sound) {
      sound = new Instance('Sound');
      sound.SoundId = soundId as unknown as string;
      sound.Parent = SoundService;
      this.soundPool.set(cacheKey, sound);
    }

    sound.Volume = volume;
    sound.Play();
  }

  /**
   * Play a music track. Stops the current music if one is playing.
   * @param key - Music track name from AUDIO_CATALOG.Music
   * @param volume - Playback volume 0–1 (default: 0.5)
   */
  public playMusic(key: string, volume = 0.5): void {
    this.stopMusic();

    const musicId = (AUDIO_CATALOG.Music as Record<string, { readonly __brand: string }>)[key];
    if (!musicId) {
      warn(`[AudioController] Unknown music track: ${key}`);
      return;
    }

    const sound = new Instance('Sound');
    sound.SoundId = musicId as unknown as string;
    sound.Volume = volume;
    sound.Looped = true;
    sound.Parent = SoundService;
    sound.Play();
    this.currentMusic = sound;
  }

  /** Stop the currently playing music track */
  public stopMusic(): void {
    if (this.currentMusic) {
      this.currentMusic.Stop();
      this.currentMusic.Destroy();
      this.currentMusic = undefined;
    }
  }
}
