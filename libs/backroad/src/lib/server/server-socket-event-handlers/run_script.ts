// import { IServerSocketEventHandler } from './types';

import { IServerSocketEventHandler } from './types';

export const runScript: IServerSocketEventHandler<
  'run_script',
  () => Promise<void>
> = (socket, backroadSession, context) => () => {
  context();
  socket.emit('running', null, () => {
    console.log('running event emitted');
  });
};
