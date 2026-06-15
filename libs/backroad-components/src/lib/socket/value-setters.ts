/** Promise-based helpers for pushing component values back to the backroad server. */
import superjson from 'superjson';
import { socket } from './client';

export const setBackroadValue = (props: { id: string; value: unknown }) => {
  return new Promise<void>((resolve) => {
    socket.emit(
      'set_value',
      {
        id: props.id,
        value: superjson.stringify(props.value),
        pathname: window.location.pathname,
      },
      () => {
        resolve();
      }
    );
  });
};

export const setRunUnsetBackroadValue = (
  props: Parameters<typeof setBackroadValue>[0]
) => {
  return new Promise<void>((resolve) => {
    setBackroadValue(props).then(() => {
      socket.emit(
        'unset_value',
        { id: props.id, pathname: window.location.pathname },
        () => {
          resolve();
        }
      );
    });
  });
};
