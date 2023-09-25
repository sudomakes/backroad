import { sessionManager } from '../sessions/session-manager';
import { IServerSocketEventHandler } from './base';
import superjson from 'superjson';

export const setValue: IServerSocketEventHandler =
  () => (props: { key: string; sessionId: string; data: string }, callback) => {
    const session = sessionManager.getSession(props.sessionId);
    if (session) {
      session.setValue(props.key, superjson.parse(props.data));
      callback({ message: 'Success' });
    }
  };
