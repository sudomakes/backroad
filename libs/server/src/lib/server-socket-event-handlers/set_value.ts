import { sessionManager } from '../sessions/session-manager';
import { IServerSocketEventHandler } from './base';
import superjson from 'superjson';

export const setValue: IServerSocketEventHandler =
  (socket) => (props: { key: string; data: string }, callback) => {
    const session = sessionManager.getSession(socket.id);
    if (session) {
      session.setValue(props.key, superjson.parse(props.data));
      callback({ message: 'Success' });
    }
  };
