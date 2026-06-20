import { BackroadConfig } from '@backroad/core';
import express from 'express';
import * as http from 'http';
import { buildBackroadHandler, type BackroadExecutor } from '../server/build';

// Re-exported for backwards compatibility — the type now lives in build.ts
// (the shared core) alongside the executor signature.
export type { BackroadRunContext } from '../server/build';

/**
 * Run a Backroad app as a standalone server on its own port. This is the
 * original entry point and is unchanged in behaviour: it's the mountable core
 * (buildBackroadHandler) with basePath '' on a fresh express app + http server.
 */
export const run = async (
  executor: BackroadExecutor,
  backroadOptions?: BackroadConfig
) => {
  const port = backroadOptions?.server?.port || 3333;

  const app = express();
  const handler = buildBackroadHandler(executor, {
    ...backroadOptions,
    basePath: '',
  });
  app.use(handler);

  const server = http.createServer(app);
  handler.attach(server);

  server.listen(port, () => {
    console.log(
      `Server started and can be accessed on http://localhost:${port}/`
    );
    if (process.env.BACKROAD_ENV === 'dev') {
      console.log(
        'Backroad is running in development mode. Frontend will be running on a separate address: http://localhost:4200/'
      );
    }
  });
};
