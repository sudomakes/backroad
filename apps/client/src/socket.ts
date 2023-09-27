import { ClientToServerEvents, ServerToClientEvents } from 'backroad-core';
import { Socket, io } from 'socket.io-client';
export const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io({
  path: '/api/socket.io',
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const setAndReRun = (props: { id: string; value: any }) => {
  socket.emit('set_value_and_re_run', props, () => {
    console.log('set and rerun callback');
  });
};
