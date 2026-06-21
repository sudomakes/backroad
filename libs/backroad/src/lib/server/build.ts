import express from 'express';
import * as http from 'http';
import { join } from 'path';
import { SocketManager } from '../backroad/socket-manager';
import { normalizeBasePath } from './base-path';
import { createBackroadRouter } from './http-routes';
import { createIndexHtmlRenderer } from './index-html';
import { createSessionManager } from './sessions/session-manager';
import { createSocketAttacher } from './socket-server';
import type { BackroadAdapterOptions, BackroadExecutor } from './types';

// Types live in ./types now; re-exported here so the long-standing
// '../server/build' import path keeps working for the runner and adapters.
export type {
  BackroadAdapterOptions,
  BackroadExecutor,
  BackroadRunContext,
} from './types';

export type BackroadHandler = express.Express & {
  /**
   * Bind Socket.IO to the host's http.Server. The returned express handler
   * auto-attaches on its first request (via req.socket.server), so this is only
   * needed when that lazy attach can't reach the server — e.g. Hono's
   * node-server, or hosts behind a custom proxy. Calling it twice is a no-op.
   */
  attach: (server: http.Server) => void;
  basePath: string;
};

/**
 * Build a mountable Backroad app: an express handler (the /api/* routes, static
 * assets and SPA fallback) plus an attach() that binds Socket.IO to whatever
 * http.Server ends up serving it. This is the single core shared by run() and
 * every framework adapter — run() is just this with basePath: ''.
 *
 * The pieces it composes each live in their own module:
 *   - base-path.ts   normalise the mount sub-path
 *   - index-html.ts  per-request SPA document patched with the mount path
 *   - http-routes.ts the express Router (auth, health, uploads, downloads, SPA)
 *   - socket-server.ts the lazy Socket.IO attacher
 * This file just wires them together onto the mountable express handler.
 */
export const buildBackroadHandler = (
  executor: BackroadExecutor,
  options?: BackroadAdapterOptions
): BackroadHandler => {
  const basePath = normalizeBasePath(options?.basePath);
  const authConfig = options?.auth;

  // Per-instance registries — two mounted apps never share sessions or sockets.
  const socketManager = new SocketManager();
  const sessionManager = createSessionManager(socketManager);

  const publicDir = join(__dirname, 'public');
  const renderIndexHtml = createIndexHtmlRenderer(publicDir, basePath);

  const router = createBackroadRouter({
    authConfig,
    publicDir,
    sessionManager,
    renderIndexHtml,
  });

  const attach = createSocketAttacher({
    basePath,
    authConfig,
    executor,
    options,
    sessionManager,
    socketManager,
  });

  // The mountable handler is a full express() app (not a bare Router) so that
  // req/res get express's enhancements (res.json/send/sendFile) even when an
  // adapter invokes it directly on raw Node req/res — e.g. the Hono bridge,
  // where there is no parent express app to do the enhancing.
  //
  // A once-only auto-attach middleware sits in front of the routes: the browser
  // always loads the page (HTTP) before opening the websocket, so grabbing the
  // http.Server off the first request binds Socket.IO in time — giving the
  // app.use('/x', backroadExpress(...)) one-liner with no explicit attach step.
  const handler = express() as BackroadHandler;
  handler.use((req, _res, next) => {
    const server = (req.socket as { server?: http.Server }).server;
    if (server) attach(server);
    next();
  });
  handler.use(router);
  handler.attach = attach;
  handler.basePath = basePath;
  return handler;
};
