import { ClientToServerEvents, ServerToClientEvents } from '@backroad/core';
import { Socket, io } from 'socket.io-client';
import superjson from 'superjson';
export const sessionId = sessionStorage.tabID
  ? sessionStorage.tabID
  : (sessionStorage.tabID = `${crypto.randomUUID()}`);

console.log('tab id', sessionId);
export const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
  `/${sessionId}`,
  {
    path: '/api/socket.io',
  }
);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const setBackroadValue = (props: {
  id: string;
  value: unknown;
  // triggerRerun?: boolean
}) => {
  return new Promise<void>((resolve) => {
    socket.emit(
      'set_value',
      {
        id: props.id,
        value: superjson.stringify(props.value),
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
  // sets and re-runs in backend
  return new Promise<void>((resolve) => {
    setBackroadValue(props).then(() => {
      socket.emit('unset_value', { id: props.id }, () => {
        resolve();
      });
    });
  });
};

export const getBackroadConfig = () => {
  return new Promise<void>((resolve) => {
    socket.emit('get_config', undefined, () => {
      resolve();
    });
  });
};
