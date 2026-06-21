import {
  buildBackroadHandler,
  type BackroadAdapterOptions,
  type BackroadExecutor,
  type BackroadHandler,
} from '../server/build';

/**
 * Mount a Backroad app onto an existing Express app.
 *
 * ```ts
 * app.use('/backroad', backroadExpress(executor, { basePath: '/backroad' }));
 * ```
 *
 * The returned value is an express handler that also carries `.attach(server)`.
 * Socket.IO auto-attaches on the first HTTP request, so the one-liner above is
 * all you need. If your setup can't expose the http.Server to a request (a
 * custom proxy, say), call `.attach(server)` explicitly after `app.listen()`.
 */
export const backroadExpress = (
  executor: BackroadExecutor,
  options?: BackroadAdapterOptions
): BackroadHandler => buildBackroadHandler(executor, options);
