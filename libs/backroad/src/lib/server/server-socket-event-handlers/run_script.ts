import { IServerSocketEventHandler } from './base';

export const runScript: IServerSocketEventHandler<
  'run_script',
  {
    serverPort: number;
    scriptPath: string;
  }
> = (socket, backroadSession, options) => () => {
  backroadSession.setRunnerProcess({
    scriptPath: options.scriptPath,
    serverPort: options.serverPort,
  });
  socket.emit('running', null, () => {
    console.log('running event emitted');
  });
};
