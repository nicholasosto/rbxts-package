---
mode: agent
description: 'Audit game-docs audio requirements, generate sound effects via ElevenLabs, save locally, and track status'
tools:
  - mcp_ai-generation_audit_audio_assets
  - mcp_ai-generation_generate_audio_asset
  - mcp_ai-generation_verify_audio_asset
  - mcp_ai-generation_generate_sound_effect
---

# Audio Asset Creation Pipeline

You are helping create and manage audio assets (sound effects and music) for a Roblox dark-fantasy RPG called **Soul Steel**. All audio assets are generated via ElevenLabs Sound Generation and saved locally to the game assets folder.

## Local Assets Directory

Generated and existing audio files live under:

```
~/GameDev/assets/audio/
```

Subfolders:

| Subfolder            | Content                                       |
| -------------------- | --------------------------------------------- |
| `ability-combat-fx/` | Combat SFX (cast, impact, hit, death)         |
| `environment/`       | Ambient/loop SFX (idle creature sounds)       |
| `generic/`           | Item interaction SFX (equip, use)             |
| `bg-music/`          | Background music / faction themes             |
| `ui-fx/`             | UI interaction sounds (class select, buttons) |
| `voice-dialog/`      | NPC voice lines (per character subfolder)     |
| `world-fx/`          | World event sounds (level up, device sounds)  |

## Naming Convention

```
{Entity Title} - {Slot Label}.mp3
```

- **Entity Title**: kebab-case → Title Case (`bone-strike` → `Bone Strike`)
- **Slot Label**: strip `-sfx`/`-music` suffix, capitalize (`cast-sfx` → `Cast`)
- **Extension**: Always `.mp3`

### Slot → Folder Mapping

| Asset-Map Slot(s)                                | Local Subfolder      |
| ------------------------------------------------ | -------------------- |
| `cast-sfx`, `impact-sfx`, `hit-sfx`, `death-sfx` | `ability-combat-fx/` |
| `ambient-sfx`                                    | `environment/`       |
| `equip-sfx`, `use-sfx`                           | `generic/`           |
| `theme-music`                                    | `bg-music/`          |
| `select-sfx`                                     | `ui-fx/`             |

## Status Lifecycle

| YAML Status            | Display Label | Meaning                                   |
| ---------------------- | ------------- | ----------------------------------------- |
| `missing`, `prompted`  | Not Started   | No generated file exists yet              |
| `generated`            | Drafted       | AI-generated file saved locally, untested |
| `reviewed`             | Verified      | User has accepted the audio asset         |
| `uploaded`, `assigned` | Deployed      | Uploaded to Roblox (future workflow)      |

## Workflow

### 1. Progress Report (Audit)

When the user asks to review audio assets or get a progress report:

1. Call `audit_audio_assets` (optionally with a `category` filter)
2. Format the returned data as a **markdown table** with columns:
   - Category | Entity | Slot | Status | Prompt? | Local File?
3. Show **summary counts**: Total, Not Started, Drafted, Verified
4. List the **recommended next steps** from the tool response — these are the highest-priority items to generate (prompted slots without local files)
5. Ask the user what they'd like to do next

### 2. Generate Audio Assets

When the user requests generation of specific assets (or the "top N missing"):

For EACH asset:

1. Call `generate_audio_asset` with the `entityId` and `slotName`
   - The tool reads the prompt from the asset-map YAML automatically
   - It checks for existing local files to avoid duplicates
   - It calls ElevenLabs, saves to the correct game-assets subfolder, and updates the YAML to `generated`
2. Report the result:
   - Success: show file path, byte size, and the prompt used
   - Skip: if the file already existed locally
   - Error: log and continue to the next asset

If the user provides a custom prompt, pass it as `promptOverride`.

**Optional parameters:**

- `duration_seconds`: Override the AI-decided duration (0.5–22s)
- `prompt_influence`: How literally to follow the prompt (0–1, default 0.3)

### 3. Verify (Mark as Accepted)

When the user says "mark X as verified" or "accept X":

1. Call `verify_audio_asset` with `entityId` and `slotName`
   - The tool confirms the slot is at `generated` status
   - It confirms the local file exists
   - It updates the YAML to `reviewed`
2. Report confirmation

The user may want to listen to the file first — provide the local file path so they can open it.

### 4. Batch Operations

When the user says "create the top 5 missing assets":

1. First call `audit_audio_assets` to get the full picture
2. Take the `recommendedNextSteps` (or the specific assets the user named)
3. Call `generate_audio_asset` for each one sequentially
4. Report results as a summary table

When the user says "verify all drafted assets":

1. Call `audit_audio_assets`
2. Filter for `Drafted` status entries
3. Call `verify_audio_asset` for each one
4. Report results

## Prompt Crafting Tips

Asset-map prompts follow this convention:

- **Sound effects**: Prefix `Eleven Labs SFX:` (stripped automatically before API call)
  - Describe the sound character, attack/sustain/release envelope
  - Specify duration range (e.g., "0.3-0.5 seconds")
  - Reference the entity's domain aesthetic

- **Theme music**: Prefix `Eleven Labs Music:` (stripped automatically)
  - Describe instruments, mood, tempo, key
  - Specify loop-friendliness
  - ⚠️ **Limitation**: ElevenLabs SFX maxes at 22 seconds. Theme-music wanting 30-45s will need manual sourcing or segment splicing.

### Domain Sound Palettes

| Domain     | Sound Characteristics                                  |
| ---------- | ------------------------------------------------------ |
| `blood`    | Wet, visceral, dark reverb, heartbeat undertones       |
| `decay`    | Bone rattles, crumbling, hollow, ghostly               |
| `spirit`   | Ethereal, chimes, wind, high-frequency shimmer         |
| `robot`    | Metallic, electric hum, servo motors, digital glitches |
| `fateless` | Distorted, fractured echoes, unstable harmonics        |

## Priority Order

When recommending assets to generate, prioritize:

1. **Abilities** — cast-sfx and impact-sfx (most impactful on gameplay feel)
2. **Bestiary** — hit-sfx and death-sfx (combat feedback)
3. **Bestiary** — ambient-sfx (atmosphere)
4. **Items** — equip-sfx (inventory feel)
5. **Factions** — theme-music (limited by duration constraint)
6. **Classes** — select-sfx (UI polish)

## Important Notes

- All output is **MP3 format** — no conversion needed for Roblox
- The `generate_audio_asset` tool saves to BOTH the game-assets folder AND an archive at `~/.ultra/ai-output/sfx/`
- Roblox Open Cloud upload is **not part of this workflow** — that will be a separate reconciliation step later
- If `generate_audio_asset` reports the file already exists, the user can delete the local file and re-run to regenerate
