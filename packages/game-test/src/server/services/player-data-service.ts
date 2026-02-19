import { Service, type OnStart } from '@flamework/core';
import ProfileStore, { type Profile } from '@rbxts/profile-store';
import { Players } from '@rbxts/services';
import { GlobalEvents } from '../../shared/network';
import { DEFAULT_PROFILE, type PlayerProfile } from '../../shared/player-data';

const DEBOUNCE_SAVE_SECONDS = 10;

/**
 * PlayerDataService
 *
 * Manages persistent player data using ProfileStore.
 *
 * Lifecycle:
 *   PlayerAdded  → StartSessionAsync → Reconcile → fire ProfileLoaded
 *   PlayerRemoving → EndSession
 *   game:BindToClose → EndSession for all active profiles
 *
 * Auto-save: ProfileStore handles periodic auto-saves internally.
 * Debounced manual save: call `markDirty(player)` after mutations;
 * a `Profile:Save()` will fire after DEBOUNCE_SAVE_SECONDS of inactivity.
 */
@Service()
export class PlayerDataService implements OnStart {
  /** The underlying ProfileStore instance. */
  private store = ProfileStore.New<PlayerProfile>('PlayerData', DEFAULT_PROFILE);

  /** Active profiles keyed by player UserId. */
  private profiles = new Map<number, Profile<PlayerProfile>>();

  /** Debounce timers for manual saves. */
  private saveTimers = new Map<number, thread>();

  private networkEvents = GlobalEvents.createServer({});

  onStart(): void {
    // Handle players already in the server (studio quick-start)
    for (const player of Players.GetPlayers()) {
      task.spawn(() => this.loadProfile(player));
    }

    Players.PlayerAdded.Connect((player) => {
      this.loadProfile(player);
    });

    Players.PlayerRemoving.Connect((player) => {
      this.releaseProfile(player);
    });

    // Shutdown safety — end all sessions so data saves
    game.BindToClose(() => {
      for (const [userId] of this.profiles) {
        const player = Players.GetPlayerByUserId(userId);
        if (player) {
          this.releaseProfile(player);
        }
      }
    });
  }

  // ─── Public API ──────────────────────────────────────────────────────────

  /**
   * Returns the active Profile for a player, or undefined if not yet loaded.
   */
  getProfile(player: Player): Profile<PlayerProfile> | undefined {
    return this.profiles.get(player.UserId);
  }

  /**
   * Returns the profile Data for a player, or undefined if not yet loaded.
   */
  getData(player: Player): PlayerProfile | undefined {
    const profile = this.profiles.get(player.UserId);
    if (profile && profile.IsActive()) {
      return profile.Data;
    }
    return undefined;
  }

  /**
   * Mark a player's profile as dirty so it saves after a debounce window.
   * Call this after any mutation to profile.Data.
   */
  markDirty(player: Player): void {
    const userId = player.UserId;
    const profile = this.profiles.get(userId);
    if (!profile || !profile.IsActive()) return;

    // Cancel any existing debounce timer
    const existing = this.saveTimers.get(userId);
    if (existing) {
      task.cancel(existing);
    }

    // Schedule a save after the debounce window
    const timer = task.delay(DEBOUNCE_SAVE_SECONDS, () => {
      this.saveTimers.delete(userId);
      if (profile.IsActive()) {
        profile.Save();
      }
    });
    this.saveTimers.set(userId, timer);
  }

  // ─── Internal ────────────────────────────────────────────────────────────

  private loadProfile(player: Player): void {
    const userId = player.UserId;
    const profileKey = `Player_${userId}`;

    // Start a session — this yields
    const profile = this.store.StartSessionAsync(profileKey, {
      Cancel: () => {
        // If the player left before the session loaded, cancel
        return player.Parent !== Players;
      },
    });

    // Player may have left while we were loading
    if (player.Parent !== Players) {
      profile.EndSession();
      return;
    }

    // Fill any missing keys from the template
    profile.Reconcile();

    // Associate userId for GDPR compliance
    profile.AddUserId(userId);

    // Handle session stolen by another server
    profile.OnSessionEnd.Connect(() => {
      this.profiles.delete(userId);
      if (player.Parent === Players) {
        player.Kick('Your data has been loaded on another server — please rejoin.');
      }
    });

    // Store and notify the client
    this.profiles.set(userId, profile);
    this.networkEvents.ProfileLoaded.fire(player, profile.Data);

    print(`[PlayerDataService] Profile loaded for ${player.Name} (${userId})`);
  }

  private releaseProfile(player: Player): void {
    const userId = player.UserId;

    // Cancel any pending debounce timer
    const timer = this.saveTimers.get(userId);
    if (timer) {
      task.cancel(timer);
      this.saveTimers.delete(userId);
    }

    const profile = this.profiles.get(userId);
    if (profile) {
      profile.EndSession();
      this.profiles.delete(userId);
      print(`[PlayerDataService] Profile released for ${player.Name} (${userId})`);
    }
  }
}
