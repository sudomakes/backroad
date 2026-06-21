import { BackroadConfig } from '@backroad/core';
import * as http from 'http';
import { buildBackroadHandler, type BackroadExecutor } from '../server/build';

// Re-exported for backwards compatibility — the type now lives in build.ts
// (the shared core) alongside the executor signature.
export type { BackroadRunContext } from '../server/build';

/**
 * Run a Backroad app as a standalone server on its own port. This is the
 * original entry point and is unchanged in behaviour: it's the mountable core
 * (buildBackroadHandler) with basePath '' served on a plain Node http.Server.
 *
 * The standalone setup reads as a server setup that just happens to use the
 * Backroad handler: build the app, hand it to http.createServer, listen. The
 * handler is itself a full express app, so there's no extra express() wrapper
 * to stand up here — that framework choice lives inside the handler/adapters.
 */
export const run = async (
  executor: BackroadExecutor,
  backroadOptions?: BackroadConfig
) => {
  const port = backroadOptions?.server?.port ?? 3333;

  const handler = buildBackroadHandler(executor, {
    ...backroadOptions,
    basePath: '',
  });

  const server = http.createServer(handler);
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
