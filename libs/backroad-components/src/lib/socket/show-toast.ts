/** Maps a toast's args onto a sonner notification. */
import type { ToastArgs } from '@backroad/core';
import { toast } from 'backroad-ui';

const FIRE = {
  info: toast.info,
  success: toast.success,
  warning: toast.warning,
  error: toast.error,
} as const;

export const showToast = (args: ToastArgs) => {
  const fire = FIRE[args.variant ?? 'info'] ?? toast.info;
  fire(args.message, {
    // sonner treats Infinity as "stay until dismissed"; our API uses 0.
    // `undefined` falls back to sonner's default duration.
    duration: args.duration === 0 ? Infinity : args.duration,
  });
};
