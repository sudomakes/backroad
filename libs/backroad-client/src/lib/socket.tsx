import { ClientToServerEvents, ServerToClientEvents } from '@backroad/core';
import { Socket, io } from 'socket.io-client';
import superjson from 'superjson';
const tabID = sessionStorage.tabID
  ? sessionStorage.tabID
  : (sessionStorage.tabID = `${crypto.randomUUID()}`);

console.log('tab id', tabID);
export const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
  `/${tabID}`,
  {
    path: '/api/socket.io',
  }
);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const setBackroadValue = (props: {
  id: string;
  value: unknown;
  triggerRerun?: boolean;
}) => {
  socket.emit(
    'set_value',
    {
      id: props.id,
      value: superjson.stringify(props.value),
      triggerRerun: props.triggerRerun,
    },
    () => {
      console.log('set and rerun callback');
    }
  );
};
