import { sessionManager } from '../sessions/session-manager';
import { IServerSocketEventHandler } from './base';
import superjson from 'superjson';

export const setValue: IServerSocketEventHandler<'set_value'> =
  () => (props, callback) => {
    const session = sessionManager.getSession(props.sessionId);
    if (session) {
      session.setValue(props.id, superjson.parse(props.data));
      callback({ message: 'Success' });
    }
  };
