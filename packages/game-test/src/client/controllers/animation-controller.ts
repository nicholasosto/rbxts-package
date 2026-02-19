import { Controller, type OnStart } from '@flamework/core';
import { Players } from '@rbxts/services';
import Maid from '@rbxts/maid';
import { ANIMATION_CATALOG } from '@nicholasosto/assets';
import { clientEvents } from '../network';

/**
 * AnimationController
 *
 * Manages client-side animation playback on the local character.
 * Uses ANIMATION_CATALOG from the assets package for type-safe animation IDs.
 */
@Controller({})
export class AnimationController implements OnStart {
  private animator?: Animator;
  private loadedTracks = new Map<string, AnimationTrack>();
  private maid = new Maid();

  onStart(): void {
    this.setupCharacter();
    this.listenForServerEvents();
  }

  /** Get or wait for the local character's Animator */
  private setupCharacter(): void {
    const player = Players.LocalPlayer;
    const character = player.Character ?? player.CharacterAdded.Wait()[0];
    const humanoid = character.WaitForChild('Humanoid') as Humanoid;
    this.animator = humanoid.WaitForChild('Animator') as Animator;

    // Re-setup on respawn
    this.maid.GiveTask(
      player.CharacterAdded.Connect((newChar: Model) => {
        const hum = newChar.WaitForChild('Humanoid') as Humanoid;
        this.animator = hum.WaitForChild('Animator') as Animator;
        this.loadedTracks.clear();
      }),
    );
  }

  /** Listen for server-requested animations */
  private listenForServerEvents(): void {
    this.maid.GiveTask(
      clientEvents.AnimationPlay.connect((animationKey: string, _targetId: string) => {
        // Parse "Category.Key" format from server
        const parts = animationKey.split('.');
        if (parts.size() === 2) {
          this.playAnimation(parts[0] as keyof typeof ANIMATION_CATALOG, parts[1]);
        }
      }),
    );
  }

  /**
   * Play an animation by catalog key.
   * @param category - Top-level category (e.g. 'Melee', 'Magic', 'Combat')
   * @param key - Animation name within the category
   * @param priority - Roblox animation priority (default: Action)
   */
  public playAnimation(
    category: keyof typeof ANIMATION_CATALOG,
    key: string,
    priority: Enum.AnimationPriority = Enum.AnimationPriority.Action,
  ): AnimationTrack | undefined {
    if (!this.animator) return undefined;

    const catalog = ANIMATION_CATALOG[category] as Record<string, { readonly __brand: string }>;
    const animId = catalog[key];
    if (!animId) {
      warn(`[AnimationController] Unknown animation: ${category}.${key}`);
      return undefined;
    }

    const trackKey = `${category}.${key}`;
    let track = this.loadedTracks.get(trackKey);

    if (!track) {
      const animation = new Instance('Animation');
      animation.AnimationId = animId as unknown as string;
      track = this.animator.LoadAnimation(animation);
      track.Priority = priority;
      this.loadedTracks.set(trackKey, track);
    }

    track.Play();
    return track;
  }

  /** Stop all currently playing animation tracks */
  public stopAll(): void {
    for (const [, track] of this.loadedTracks) {
      if (track.IsPlaying) {
        track.Stop();
      }
    }
  }
}
