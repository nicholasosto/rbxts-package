/**
 * useHumanoidHealth — React hook that subscribes to a Humanoid's health changes.
 *
 * Returns `{ current, max }` that update automatically whenever the
 * Humanoid's Health or MaxHealth properties change.
 *
 * @example
 * ```tsx
 * const humanoid = character?.FindFirstChildOfClass("Humanoid");
 * const health = useHumanoidHealth(humanoid);
 * return <ResourceBar current={health.current} max={health.max} style={ResourceBarStyle.Health} />;
 * ```
 */

import React from '@rbxts/react';

interface HumanoidHealthState {
  current: number;
  max: number;
}

export function useHumanoidHealth(humanoid: Humanoid | undefined): HumanoidHealthState {
  const [state, setState] = React.useState<HumanoidHealthState>({
    current: humanoid?.Health ?? 0,
    max: humanoid?.MaxHealth ?? 100,
  });

  React.useEffect(() => {
    if (!humanoid) {
      setState({ current: 0, max: 100 });
      return;
    }

    // Sync initial values
    setState({ current: humanoid.Health, max: humanoid.MaxHealth });

    const connections: RBXScriptConnection[] = [];

    // Health changed event
    connections.push(
      humanoid.HealthChanged.Connect((newHealth) => {
        setState((prev) => ({
          ...prev,
          current: newHealth,
        }));
      }),
    );

    // MaxHealth changed via property signal
    connections.push(
      humanoid.GetPropertyChangedSignal('MaxHealth').Connect(() => {
        setState((prev) => ({
          ...prev,
          max: humanoid.MaxHealth,
        }));
      }),
    );

    return () => {
      for (const conn of connections) {
        conn.Disconnect();
      }
    };
  }, [humanoid]);

  return state;
}
