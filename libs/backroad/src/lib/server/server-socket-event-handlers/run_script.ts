// import { IServerSocketEventHandler } from './types';

import { IServerSocketEventHandler } from './types';

export const runScript: IServerSocketEventHandler<
  'run_script',
  (pathname: string) => Promise<void>
> = (socket, backroadSession, context) => async (args) => {
  await context(args.pathname);
};
