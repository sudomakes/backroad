import superjson from 'superjson';
import { IServerSocketEventHandler } from './base';
export const setValueAndReRun: IServerSocketEventHandler<
  'set_value',
  {
    serverPort: number;
    scriptPath: string;
  }
> = (socket, backroadSession, context) => (props) => {
  console.log(
    'setting value before triggering rerun, new value for ',
    props.id,
    ' is ',
    props.value
  );
  backroadSession.setValue(props.id, superjson.parse(props.value));
  if (props.triggerRerun === true || props.triggerRerun === undefined) {
    console.log('triggering rerun');
    backroadSession.setRunnerProcess({
      scriptPath: context.scriptPath,
      serverPort: context.serverPort,
    });
    socket.emit('running', null, () => {
      console.log('running event emitted');
    });
  }
};
