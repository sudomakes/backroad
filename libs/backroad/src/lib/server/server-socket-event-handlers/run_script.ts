// import { IServerSocketEventHandler } from './types';

import { IServerSocketEventHandler } from './types';

export const runScript: IServerSocketEventHandler<
  'run_script',
  () => Promise<void>
> = (socket, backroadSession, context) => async () => {
  // runExecutor emits the running start/end signal itself.
  await context();
};
