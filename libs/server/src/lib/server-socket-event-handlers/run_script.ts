import { IServerSocketEventHandler } from './base';
import { BackroadSession } from '../sessions/session';

export const runScript: IServerSocketEventHandler<
  'run_script',
  {
    serverPort: number;
    scriptPath: string;
    backroadSession: BackroadSession;
  }
> = (socket, options) => () => {
  options.backroadSession.setRunnerProcess({
    scriptPath: options.scriptPath,
    serverPort: options.serverPort,
  });
};
