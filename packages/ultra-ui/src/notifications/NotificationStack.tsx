/**
 * NotificationStack — Renders a vertical stack of Toast notifications.
 * Toasts auto-dismiss after their duration expires.
 *
 * This component manages its own removal timers via useEffect.
 *
 * @example
 * ```tsx
 * <NotificationStack
 *   toasts={activeToasts}
 *   onDismiss={(id) => removeToast(id)}
 *   position="TopRight"
 * />
 * ```
 */

import React, { useEffect, useRef } from '@rbxts/react';
import { Toast } from './Toast';
import type { ToastData } from './types';

export type StackPosition = 'TopRight' | 'TopLeft' | 'BottomRight' | 'BottomLeft';

const POSITION_MAP: Record<StackPosition, { anchor: Vector2; position: UDim2 }> = {
  TopRight: { anchor: new Vector2(1, 0), position: new UDim2(1, -12, 0, 12) },
  TopLeft: { anchor: new Vector2(0, 0), position: new UDim2(0, 12, 0, 12) },
  BottomRight: { anchor: new Vector2(1, 1), position: new UDim2(1, -12, 1, -12) },
  BottomLeft: { anchor: new Vector2(0, 1), position: new UDim2(0, 12, 1, -12) },
};

export interface NotificationStackProps {
  /** Currently active toasts. */
  toasts: ToastData[];
  /** Called when a toast should be removed. */
  onDismiss: (id: string) => void;
  /** Screen corner. Default: "TopRight". */
  position?: StackPosition;
  /** Width of the notification stack. Default: 320. */
  width?: number;
  /** Gap between toasts. Default: 6. */
  gap?: number;
  /** Max visible toasts. Default: 5. */
  maxVisible?: number;
}

export function NotificationStack(props: NotificationStackProps): React.Element {
  const { toasts, onDismiss, position = 'TopRight', width = 320, gap = 6, maxVisible = 5 } = props;

  const layout = POSITION_MAP[position];
  const visibleToasts =
    toasts.size() > maxVisible ? toasts.filter((_, i) => i >= toasts.size() - maxVisible) : toasts;

  // Auto-dismiss timers
  const timerMap = useRef(new Map<string, thread>());

  useEffect(() => {
    for (const toast of visibleToasts) {
      if (!timerMap.current.has(toast.id)) {
        const dur = toast.duration ?? 4;
        const t = task.delay(dur, () => {
          timerMap.current.delete(toast.id);
          onDismiss(toast.id);
        });
        timerMap.current.set(toast.id, t);
      }
    }

    // Clean up timers for toasts that no longer exist
    for (const [id, t] of timerMap.current) {
      const stillExists = visibleToasts.find((toast) => toast.id === id) !== undefined;
      if (!stillExists) {
        task.cancel(t);
        timerMap.current.delete(id);
      }
    }
  }, [visibleToasts]);

  return (
    <frame
      key="NotificationStack"
      AnchorPoint={layout.anchor}
      Position={layout.position}
      Size={new UDim2(0, width, 1, 0)}
      BackgroundTransparency={1}
    >
      <uilistlayout
        SortOrder={Enum.SortOrder.LayoutOrder}
        Padding={new UDim(0, gap)}
        VerticalAlignment={
          position === 'BottomRight' || position === 'BottomLeft'
            ? Enum.VerticalAlignment.Bottom
            : Enum.VerticalAlignment.Top
        }
      />
      {visibleToasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          severity={toast.severity}
          icon={toast.icon}
          onDismiss={() => onDismiss(toast.id)}
        />
      ))}
    </frame>
  );
}
