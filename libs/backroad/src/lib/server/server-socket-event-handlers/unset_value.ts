import { IServerSocketEventHandler } from './types';
export const unsetValue: IServerSocketEventHandler<
  'unset_value',
  () => Promise<void>
> = (socket, backroadSession, runExecutor) => async (props, callback) => {
  backroadSession.unsetValue(props.id);
  // if (props.triggerRerun === true || props.triggerRerun === undefined) {
  // console.log('triggering rerun');
  // backroadSession.setRunnerProcess({
  //   scriptPath: context.scriptPath,
  //   serverPort: context.serverPort,
  // });
  await runExecutor();
  callback();
  // socket.emit('running', null, () => {
  //   console.log('running event emitted');
  // });
  // }
};
