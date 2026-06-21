import type { BackroadConfig } from '@backroad/core';
import express from 'express';
import formidable from 'formidable';
import { readFileSync } from 'fs';
import * as http from 'http';
import { join } from 'path';
import { Server } from 'socket.io';
import { BackroadNodeManager } from '../backroad';
import { SocketManager } from '../backroad/socket-manager';
import { socketEventHandlers } from './server-socket-event-handlers';
import { createSessionManager } from './sessions/session-manager';

export type BackroadRunContext = {
  currentPath: string;
};

export type BackroadExecutor = (
  nodeManager: BackroadNodeManager,
  context: BackroadRunContext
) => void | Promise<void>;

// Options accepted by the mountable core and the framework adapters. Everything
// in BackroadConfig (auth, appearance, analytics) plus the sub-path the app is
// mounted under. basePath defaults to '' (root) — that's the standalone run()
// case, behaviourally identical to before this refactor.
export type BackroadAdapterOptions = NonNullable<BackroadConfig> & {
  basePath?: string;
};

// Minimal extension → MIME map for download_button's auto-inference. Anything
// unknown falls back to application/octet-stream (a safe "just download it").
const MIME_BY_EXTENSION: Record<string, string> = {
  txt: 'text/plain',
  csv: 'text/csv',
  json: 'application/json',
  html: 'text/html',
  xml: 'application/xml',
  md: 'text/markdown',
  pdf: 'application/pdf',
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  gif: 'image/gif',
  svg: 'image/svg+xml',
  webp: 'image/webp',
  zip: 'application/zip',
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
};
const inferMimeType = (filename: string) => {
  const ext = filename.split('.').pop()?.toLowerCase() ?? '';
  return MIME_BY_EXTENSION[ext] ?? 'application/octet-stream';
};

// Normalise a user-supplied mount path into either '' (root) or '/segment'
// with no trailing slash, so every call site can compose it predictably.
const normalizeBasePath = (basePath?: string) => {
  if (!basePath) return '';
  const trimmed = basePath.replace(/^\/+|\/+$/g, '');
  if (!trimmed) return '';
  return `/${trimmed}`;
};

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

  // index.html is read once and patched per request to carry the mount path:
  // the asset bundle is built with relative URLs (vite base: './'), so a
  // runtime <base href> + window.__BACKROAD_BASE__ is what lets one prebuilt
  // bundle serve from any sub-path.
  const publicDir = join(__dirname, 'public');
  let indexHtmlRaw: string | undefined;
  const renderIndexHtml = () => {
    if (indexHtmlRaw === undefined) {
      indexHtmlRaw = readFileSync(join(publicDir, 'index.html'), 'utf-8');
    }
    const baseHref = basePath ? `${basePath}/` : '/';
    const inject =
      `<base href="${baseHref}" />` +
      `<script>window.__BACKROAD_BASE__=${JSON.stringify(basePath)};</script>`;
    // Drop any build-time <base> tag, then inject ours right after <head>.
    return indexHtmlRaw
      .replace(/<base\b[^>]*>/i, '')
      .replace(/<head([^>]*)>/i, `<head$1>${inject}`);
  };

  const router = express.Router();

  // Mount better-auth handler BEFORE any body parser / static handler so the
  // raw request body reaches better-auth. Loaded lazily so users without auth
  // never need to install better-auth.
  if (authConfig) {
    const { toNodeHandler } =
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      require('better-auth/node') as typeof import('better-auth/node');
    router.all('/api/auth/*', toNodeHandler(authConfig.instance));
  }

  // Tiny readiness probe — handy for Docker/orchestrator health checks and
  // used by Playwright's webServer wait in CI.
  router.get('/api/health', (_req, res) => {
    res.json({ ok: true });
  });

  router.use(express.static(publicDir, { index: false }));

  router.post('/api/uploads', (req, res) => {
    const form = formidable({});
    form.parse<'sessionId' | 'id', 'files'>(req, (err, fields, files) => {
      if (err) {
        return res.status(400).json({ error: 'invalid upload payload' });
      }
      const sessionId = fields.sessionId?.[0];
      const id = fields.id?.[0];
      if (!sessionId || !id) {
        return res.status(400).json({ error: 'sessionId and id are required' });
      }
      const session = sessionManager.getSession(sessionId);
      if (!session) {
        return res.status(404).json({ error: 'session not found' });
      }
      const value = files.files || [];
      session.setValue(id, value);
      return res.json(value);
    });
  });

  // On-demand download for br.downloadButton. The payload lives in session
  // state (never in the component tree), so it crosses the wire only when the
  // user actually clicks — streamed here with an attachment disposition.
  router.get('/api/download/:sessionId/:id', async (req, res) => {
    const session = sessionManager.getSession(req.params.sessionId);
    const download = session?.getDownload(req.params.id);
    if (!download) {
      return res.status(404).json({ error: 'download not found' });
    }
    let content: string | Uint8Array;
    try {
      content = await download.data();
    } catch (err) {
      console.error('download_button payload failed to generate', err);
      return res.status(500).json({ error: 'failed to generate download' });
    }
    const filename = download.filename ?? 'download';
    res.setHeader('Content-Type', download.mime ?? inferMimeType(filename));
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${encodeURIComponent(filename)}"`
    );
    return res.send(
      typeof content === 'string' || Buffer.isBuffer(content)
        ? content
        : Buffer.from(content)
    );
  });

  // SPA fallback — serve the (base-path-patched) index.html for any non-API GET.
  router.get('*', (_req, res) => {
    res.setHeader('Content-Type', 'text/html');
    res.send(renderIndexHtml());
  });

  // --- Socket.IO ---------------------------------------------------------
  let attached = false;
  const attach = (server: http.Server) => {
    if (attached) return;
    attached = true;
    const io = new Server(server, {
      // The one place the mount prefix must be baked in explicitly: Socket.IO
      // binds at the http.Server level, below express, so express can't strip
      // the prefix for it.
      path: `${basePath}/api/socket.io`,
      cors: {},
    });
    io.of(/^\/.+$/).on('connection', async (socket) => {
      const backroadSession = sessionManager.getSession(
        socket.nsp.name.slice(1),
        { upsert: true }
      );
      socketManager.register(backroadSession.sessionId, socket);

      // Drop the socket from the manager on disconnect so long-running servers
      // with many reconnecting clients don't accumulate stale entries.
      socket.on('disconnect', () => {
        socketManager.unregister(backroadSession.sessionId, socket);
      });

      // Resolve the better-auth session once per WS connection from the upgrade
      // headers, then cache it on the BackroadSession.
      if (authConfig) {
        try {
          const { fromNodeHeaders } =
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            require('better-auth/node') as typeof import('better-auth/node');
          const resolved = await authConfig.instance.api.getSession({
            headers: fromNodeHeaders(socket.request.headers),
          });
          if (resolved?.user?.id) {
            backroadSession.user = {
              isLoggedIn: true,
              id: resolved.user.id,
              name: resolved.user.name ?? '',
              email: resolved.user.email ?? '',
              image: resolved.user.image ?? undefined,
              raw: resolved,
            };
          } else {
            backroadSession.user = { isLoggedIn: false };
          }
        } catch (err) {
          console.error(
            'Failed to resolve auth session for WS connection',
            err
          );
          backroadSession.user = { isLoggedIn: false };
        }
      }

      // currentPath is derived purely from the triggering request — every
      // run-triggering event carries the client's pathname, so the server holds
      // no path state. No run is ever server-initiated.
      const runExecutor = async (currentPath: string) => {
        socket.emit('running', true, () => undefined);
        try {
          backroadSession.resetTree();
          await executor(backroadSession.mainPageNodeManager, { currentPath });
        } finally {
          socket.emit('running', false, () => undefined);
        }
      };

      socket.on(
        'set_value',
        socketEventHandlers.setValue(socket, backroadSession, runExecutor)
      );
      socket.on(
        'run_script',
        socketEventHandlers.runScript(socket, backroadSession, runExecutor)
      );
      socket.on(
        'unset_value',
        socketEventHandlers.unsetValue(socket, backroadSession, runExecutor)
      );

      socket.emit('backroad_config', options, () => {
        console.log('sent backroad config to frontend');
      });
    });
  };

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
    if (!attached) {
      const server = (req.socket as { server?: http.Server }).server;
      if (server) attach(server);
    }
    next();
  });
  handler.use(router);
  handler.attach = attach;
  handler.basePath = basePath;
  return handler;
};
