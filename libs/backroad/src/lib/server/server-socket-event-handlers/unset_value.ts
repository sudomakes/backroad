import { IServerSocketEventHandler } from './types';
export const unsetValue: IServerSocketEventHandler<
  'unset_value',
  (pathname: string) => Promise<void>
> = (socket, backroadSession, runExecutor) => async (props, callback) => {
  backroadSession.unsetValue(props.id);
  await runExecutor(props.pathname);
  callback();
};
