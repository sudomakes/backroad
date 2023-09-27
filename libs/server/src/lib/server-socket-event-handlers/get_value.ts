import { sessionManager } from '../sessions/session-manager';
import { IServerSocketEventHandler } from './base';
import superjson from 'superjson';
export const getValue: IServerSocketEventHandler<'get_value'> =
  () => (props, callback) => {
    callback(
      superjson.stringify(
        sessionManager.getSession(props.sessionId)?.valueOf(props.id)
      )
    );
  };
