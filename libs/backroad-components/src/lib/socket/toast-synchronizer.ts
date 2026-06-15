/** Turns server-driven `toast_show` events into sonner notifications. */
import type { ToastArgs } from '@backroad/core';
import { toast } from 'backroad-ui';
import { socket } from './client';

const FIRE = {
  info: toast.info,
  success: toast.success,
  warning: toast.warning,
  error: toast.error,
} as const;

// Exported for unit testing the variant/duration mapping without a live socket.
export const showToast = (args: ToastArgs) => {
  const fire = FIRE[args.variant ?? 'info'] ?? toast.info;
  fire(args.message, {
    // sonner treats Infinity as "stay until dismissed"; our API uses 0.
    // `undefined` falls back to sonner's default duration.
    duration: args.duration === 0 ? Infinity : args.duration,
  });
};

export const registerToastSynchronizer = (): void => {
  socket.on('toast_show', showToast);
};
