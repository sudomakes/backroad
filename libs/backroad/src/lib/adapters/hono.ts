import * as http from 'http';
import {
  buildBackroadHandler,
  type BackroadAdapterOptions,
  type BackroadExecutor,
} from '../server/build';

// hono + @hono/node-server are optional peer deps, required lazily so apps that
// only use run()/backroadExpress never need them installed (same pattern as
// better-auth).
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const lazyRequire = (name: string): any => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    return require(name);
  } catch {
    throw new Error(
      `backroadHono requires "${name}". Install both \`hono\` and \`@hono/node-server\`.`
    );
  }
};

/**
 * Mount a Backroad app onto an existing Hono app (running on @hono/node-server).
 *
 * ```ts
 * const br = backroadHono(executor, { basePath: '/backroad' });
 * app.route('/backroad', br);
 * const server = serve({ fetch: app.fetch, port: 3000 });
 * br.attach(server); // Socket.IO — see note below
 * ```
 *
 * Hono speaks the Web Fetch API, so requests are bridged to Backroad's internal
 * express handler via the raw Node req/res that @hono/node-server exposes on the
 * context (`c.env.incoming` / `c.env.outgoing`). Socket.IO auto-attaches when a
 * request exposes its server, but because that isn't guaranteed through Hono's
 * fetch layer, calling `br.attach(server)` with the value returned by `serve()`
 * is the recommended, explicit path.
 */
export const backroadHono = (
  executor: BackroadExecutor,
  options?: BackroadAdapterOptions
) => {
  const handler = buildBackroadHandler(executor, options);
  const basePath = handler.basePath;

  const { Hono } = lazyRequire('hono');
  // RESPONSE_ALREADY_SENT tells @hono/node-server we wrote to the Node response
  // ourselves and it should not build a Response from the return value.
  const { RESPONSE_ALREADY_SENT } = lazyRequire(
    '@hono/node-server/utils/response'
  );

  const app = new Hono();
  app.all('*', async (c: any) => {
    const incoming: http.IncomingMessage | undefined = c.env?.incoming;
    const outgoing: http.ServerResponse | undefined = c.env?.outgoing;
    if (!incoming || !outgoing) {
      throw new Error(
        'backroadHono requires the @hono/node-server runtime (no raw Node req/res on the context).'
      );
    }

    // Best-effort auto-attach; explicit br.attach(server) is the supported path.
    const server = (incoming.socket as { server?: http.Server } | undefined)
      ?.server;
    if (server) handler.attach(server);

    // The express router matches paths relative to the mount, so strip the
    // prefix Hono's route() left on the raw Node url.
    if (basePath && incoming.url && incoming.url.startsWith(basePath)) {
      incoming.url = incoming.url.slice(basePath.length) || '/';
    }

    await new Promise<void>((resolve) => {
      outgoing.on('close', () => resolve());
      outgoing.on('finish', () => resolve());
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (handler as any)(incoming, outgoing, () => resolve());
    });

    return RESPONSE_ALREADY_SENT;
  });

  return Object.assign(app, { attach: handler.attach, basePath });
};
