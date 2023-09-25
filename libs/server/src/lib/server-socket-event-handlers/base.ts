import { Socket } from 'socket.io';

export type IServerSocketEventHandler<T = unknown> = (
  socket: Socket,
  args?: T
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
) => (...args: any) => void;
