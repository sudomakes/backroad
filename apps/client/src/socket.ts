import { io } from 'socket.io-client';
export const socket = io({ path: '/api/socket.io' });

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const setAndReRun = (props: { id: string; value: any }) => {
  socket.emit('set_value_and_re_run', props);
};
