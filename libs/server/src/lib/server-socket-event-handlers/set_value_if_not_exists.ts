import superjson from 'superjson';
import { IServerSocketEventHandler } from './base';
export const setValueIfNotExists: IServerSocketEventHandler<
  'set_value_if_not_exists'
> = (_, backroadSession) => (props, callback) => {
  console.debug(
    'session manager setting value if not exists for id',
    props.id,
    'requested value:',
    props.data
  );
  const operationResult = backroadSession.setValueIfNotSet(
    props.id,
    superjson.parse(props.data)
  );
  console.log(
    'verifying value inside set value if not exists for id',
    props.id,
    'value is:',
    backroadSession.valueOf(props.id)
  );
  // if () {
  callback(operationResult);
  // } else {
  //   callback('already_set');
  // }
};
