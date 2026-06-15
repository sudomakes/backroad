import superjson from 'superjson';
import { IServerSocketEventHandler } from './types';
export const setValue: IServerSocketEventHandler<
  'set_value',
  (pathname: string) => Promise<void>
> = (socket, backroadSession, runExecutor) => async (props, callback) => {
  // console.log(
  //   'setting value before triggering rerun, new value for ',
  //   props.id,
  //   ' is ',
  //   props.value
  // );
  backroadSession.setValue(props.id, superjson.parse(props.value));
  await runExecutor(props.pathname);
  callback();
  // socket.emit('running', null, () => {
  //   console.log('running event emitted');
  // });
  // }
};
