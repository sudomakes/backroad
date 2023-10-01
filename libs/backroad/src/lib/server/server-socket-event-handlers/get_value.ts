import superjson from 'superjson';
import { IServerSocketEventHandler } from './base';
export const getValue: IServerSocketEventHandler<'get_value'> =
  (_, session) => (props, callback) => {
    callback(superjson.stringify(session.valueOf(props.id)));
  };
