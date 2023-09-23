import { Socket } from 'socket.io';

export type IServerSocketEventHandler = (
  socket: Socket
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
) => (...args: any) => void;
