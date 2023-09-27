import { IServerSocketEventHandler } from './base';
import { BackroadSession } from '../sessions/session';
import { getBackroadScriptRunner } from '../runner';

export const runScript: IServerSocketEventHandler<
  'run_script',
  {
    serverPort: number;
    scriptPath: string;
    backroadSession: BackroadSession;
  }
> = (socket, options) => () => {
  options.backroadSession.setRunnerProcess(
    getBackroadScriptRunner({
      scriptPath: options.scriptPath,
      envVariables: {
        BACKROAD_SESSION: options.backroadSession.id,
        BACKROAD_SERVER_PORT: options.serverPort.toString(),
      },
    })
  );
};
