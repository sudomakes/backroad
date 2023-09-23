import superjson from 'superjson';
import { io, Socket } from 'socket.io-client';
import { BackroadComponent, BackroadContainer } from '../base';
let socket: Socket | null = null;
const getConnection = () => {
  if (!socket) {
    if (
      process.env['BACKROAD_SESSION'] &&
      process.env['BACKROAD_SERVER_PORT']
    ) {
      socket = io({
        path: `http://localhost:${process.env['BACKROAD_SERVER_PORT']}/api/socket.io`,
      });
      socket.emit('init', {
        sessionId: process.env['BACKROAD_SESSION'],
      });
    } else {
      throw new Error('No backroad server connection data found');
    }
  }
  return socket;
};
export const sessionConnector = {
  getValueOf: (key) => {
    const socket = getConnection();
    return new Promise((resolve) => {
      socket.emit('get-value', key, (payload: { data: string }) => {
        resolve(superjson.parse(payload.data));
      });
    });
  },
  setValueIfNotExists: (key, value) => {
    const socket = getConnection();
    return new Promise<void>((resolve) => {
      socket.emit(
        'set-value-if-not-exists',
        key,
        superjson.stringify(value),
        () => {
          resolve();
        }
      );
    });
  },
  requestRender: (element: BackroadComponent | BackroadContainer) => {
    socket.emit('request-render', element);
  },
};
