import type { NotificationSeverity } from '@nicholasosto/ultra-ui';
import { createProducer } from '@rbxts/reflex';

/** A toast notification entry in the store. */
export interface NotificationEntry {
  id: string;
  message: string;
  severity: NotificationSeverity;
  duration?: number;
  icon?: string;
}

export interface NotificationState {
  toasts: NotificationEntry[];
  nextId: number;
}

const initialState: NotificationState = {
  toasts: [],
  nextId: 1,
};

export const notificationSlice = createProducer(initialState, {
  /** Push a new toast notification. */
  pushToast: (
    state,
    message: string,
    severity: NotificationSeverity,
    duration?: number,
  ): NotificationState => ({
    toasts: [
      ...state.toasts,
      {
        id: `toast_${state.nextId}`,
        message,
        severity,
        duration,
      },
    ],
    nextId: state.nextId + 1,
  }),

  /** Remove a toast by id. */
  dismissToast: (state, id: string): NotificationState => ({
    toasts: state.toasts.filter((t) => t.id !== id),
    nextId: state.nextId,
  }),

  /** Clear all toasts. */
  clearToasts: (): NotificationState => ({
    toasts: [],
    nextId: 1,
  }),
});
