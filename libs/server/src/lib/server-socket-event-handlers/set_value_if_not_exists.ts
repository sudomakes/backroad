import { sessionManager } from '../sessions/session-manager';
import { IServerSocketEventHandler } from './base';
import superjson from 'superjson';
export const setValueIfNotExists: IServerSocketEventHandler<
  'set_value_if_not_exists'
> = () => (props, callback) => {
  console.debug('setting value if not exists', props);
  const session = sessionManager.getSession(props.sessionId);
  session.setValueIfNotSet(props.id, superjson.parse(props.data));
  console.log(
    'checking set value inside set value if not exists',
    session.valueOf(props.id)
  );
  callback('done');
};
