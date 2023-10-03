import superjson from 'superjson';
import { IServerSocketEventHandler } from './types';
export const setValue: IServerSocketEventHandler<
  'set_value',
  () => Promise<void>
> = (socket, backroadSession, context) => async (props, callback) => {
  console.log(
    'setting value before triggering rerun, new value for ',
    props.id,
    ' is ',
    props.value
  );
  backroadSession.setValue(props.id, superjson.parse(props.value));
  if (props.triggerRerun === true || props.triggerRerun === undefined) {
    console.log('triggering rerun');
    // backroadSession.setRunnerProcess({
    //   scriptPath: context.scriptPath,
    //   serverPort: context.serverPort,
    // });
    await context();
    callback();
    // socket.emit('running', null, () => {
    //   console.log('running event emitted');
    // });
  }
};
