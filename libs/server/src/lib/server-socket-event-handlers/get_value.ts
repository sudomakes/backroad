import { sessionManager } from '../sessions/session-manager';
import { IServerSocketEventHandler } from './base';
import superjson from 'superjson';
export const getValue: IServerSocketEventHandler =
  () => (props: { key: string; sessionId: string }, callback) => {
    callback(
      superjson.stringify(
        sessionManager.getSession(props.sessionId)?.valueOf(props.key)
      )
    );
  };
