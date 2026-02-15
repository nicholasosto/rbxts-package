import React, { useEffect, useState } from '@rbxts/react';
import { Players } from '@rbxts/services';

/**
 * useCharacter — safely gets the local player's character without blocking render.
 * Returns undefined until the character is available, then updates on respawn.
 */
export function useCharacter(): Model | undefined {
  const player = Players.LocalPlayer;

  const [character, setCharacter] = useState<Model | undefined>(player.Character);

  useEffect(() => {
    // If already have a character, set it
    if (player.Character) {
      setCharacter(player.Character);
    }

    // Listen for new characters (including first spawn if Character is nil)
    const connection = player.CharacterAdded.Connect((char: Model) => {
      setCharacter(char);
    });

    return () => {
      connection.Disconnect();
    };
  }, []);

  return character;
}

/**
 * useHumanoid — safely gets the Humanoid from the current character.
 * Returns undefined if character is not yet available.
 */
export function useHumanoid(): Humanoid | undefined {
  const character = useCharacter();

  const [humanoid, setHumanoid] = useState<Humanoid | undefined>(undefined);

  useEffect(() => {
    if (!character) {
      setHumanoid(undefined);
      return;
    }

    const hum = character.FindFirstChildOfClass('Humanoid');
    setHumanoid(hum);
  }, [character]);

  return humanoid;
}
