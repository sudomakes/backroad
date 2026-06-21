import { afterEach, describe, expect, it } from 'vitest';
import express from 'express';
import * as http from 'http';
import type { AddressInfo } from 'net';
import { createRequire } from 'module';
import { backroadExpress } from './express';

// A no-op executor: these tests exercise the HTTP outlet (health, mount-prefix
// stripping, download 404) which never triggers a script run, so the executor
// is never actually invoked.
const noop = () => undefined;

// Bring a Node http.Server up on an ephemeral port and return the chosen port.
const listen = async (server: http.Server) => {
  await new Promise<void>((resolve) => server.listen(0, resolve));
  return (server.address() as AddressInfo).port;
};

// Tear a server down deterministically. fetch() (undici) keeps connections
// alive in a pool, which would otherwise stall server.close(), so force any
// lingering sockets shut first.
const close = (server: http.Server) =>
  new Promise<void>((resolve) => {
    (server as { closeAllConnections?: () => void }).closeAllConnections?.();
    server.close(() => resolve());
  });

describe('backroadExpress outlet', () => {
  let server: http.Server | undefined;

  afterEach(async () => {
    if (server) await close(server);
    server = undefined;
  });

  it('serves the health probe at the root mount', async () => {
    const app = express();
    app.use(backroadExpress(noop));
    server = http.createServer(app);
    const port = await listen(server);

    const res = await fetch(`http://127.0.0.1:${port}/api/health`);
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });
  });

  it('serves the health probe under a sub-path mount', async () => {
    const app = express();
    app.use('/backroad', backroadExpress(noop, { basePath: '/backroad' }));
    server = http.createServer(app);
    const port = await listen(server);

    const res = await fetch(`http://127.0.0.1:${port}/backroad/api/health`);
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });
  });

  it('reports the normalised basePath on the handler', () => {
    expect(backroadExpress(noop).basePath).toBe('');
    expect(backroadExpress(noop, { basePath: 'backroad/' }).basePath).toBe(
      '/backroad'
    );
  });

  it('404s an unknown download', async () => {
    const app = express();
    app.use(backroadExpress(noop));
    server = http.createServer(app);
    const port = await listen(server);

    const res = await fetch(
      `http://127.0.0.1:${port}/api/download/no-session/no-id`
    );
    expect(res.status).toBe(404);
  });
});

// hono + @hono/node-server are optional peer deps; only run the Hono outlet
// integration when both are actually installed so the suite stays green in
// environments that don't pull the optional packages.
const honoAvailable = (() => {
  try {
    const req = createRequire(__filename);
    req.resolve('hono');
    req.resolve('@hono/node-server');
    return true;
  } catch {
    return false;
  }
})();

describe.skipIf(!honoAvailable)('backroadHono outlet', () => {
  let server: http.Server | undefined;

  afterEach(async () => {
    if (server) await close(server);
    server = undefined;
  });

  it('serves the health probe under a sub-path mount', async () => {
    // Resolved through createRequire (not a static import) so tsc never tries to
    // type-resolve the optional hono packages when they aren't installed.
    const { backroadHono } = await import('./hono');
    const req = createRequire(__filename);
    const { serve } = req('@hono/node-server');
    const { Hono } = req('hono');

    const app = new Hono();
    app.route('/backroad', backroadHono(noop, { basePath: '/backroad' }));
    server = serve({ fetch: app.fetch, port: 0 }) as unknown as http.Server;
    const port = (server.address() as AddressInfo).port;

    const res = await fetch(`http://127.0.0.1:${port}/backroad/api/health`);
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });
  });
});
