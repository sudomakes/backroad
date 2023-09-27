import { BackroadSession } from '../sessions/session';
import { sessionManager } from '../sessions/session-manager';
import { IServerSocketEventHandler } from './base';
import superjson from 'superjson';
export const setValueAndReRun: IServerSocketEventHandler<
  'set_value_and_re_run',
  {
    serverPort: number;
    scriptPath: string;
    backroadSession: BackroadSession;
  }
> = (socket, context) => (props) => {
  const backroadSession = sessionManager.getSession(socket.id);
  console.log(
    'setting value before triggering rerun, new value for ',
    props.id,
    ' is ',
    props.value
  );
  backroadSession.setValue(props.id, superjson.parse(props.value));
  backroadSession.setRunnerProcess({
    scriptPath: context.scriptPath,
    serverPort: context.serverPort,
  });
};
