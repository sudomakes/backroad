import { getBackroadScriptRunner } from '../runner';
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

  backroadSession.setValue(props.id, superjson.parse(props.value));
  backroadSession.setRunnerProcess(
    getBackroadScriptRunner({
      scriptPath: context.scriptPath,
      envVariables: {
        BACKROAD_SESSION: backroadSession.id,
        BACKROAD_SERVER_PORT: context.serverPort.toString(),
      },
    })
  );
};
