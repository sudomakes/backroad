/** Maps a toast's args onto a sonner notification. */
import type { ToastArgs } from '@backroad/core';
import { toast } from 'backroad-ui';

const FIRE = {
  info: toast.info,
  success: toast.success,
  warning: toast.warning,
  error: toast.error,
} as const;

const DEFAULT_DURATION = 5000;

export const showToast = (args: ToastArgs) => {
  const fire = FIRE[args.variant ?? 'info'] ?? toast.info;
  fire(args.message, {
    // 0 → sonner's "stay until dismissed"; otherwise the given ms, defaulting
    // to 5s.
    duration: args.duration === 0 ? Infinity : args.duration ?? DEFAULT_DURATION,
  });
};
