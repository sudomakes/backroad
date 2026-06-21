import type { BackroadConfig } from '@backroad/core';
import * as http from 'http';
import { Server } from 'socket.io';
import { SocketManager } from '../backroad/socket-manager';
import { socketEventHandlers } from './server-socket-event-handlers';
import { createSessionManager } from './sessions/session-manager';
import type { BackroadExecutor } from './types';

type SessionManager = ReturnType<typeof createSessionManager>;

/**
 * Build the lazy Socket.IO attacher for a Backroad instance. Socket.IO binds at
 * the http.Server level (below express), so the mount prefix has to be baked
 * into its path explicitly — that's the one place express can't strip it for us.
 *
 * The returned `attach(server)` is idempotent: the first call wires Socket.IO to
 * the given http.Server, subsequent calls are no-ops. Both the framework
 * adapters' once-only auto-attach middleware and an explicit `handler.attach()`
 * funnel through here.
 */
export const createSocketAttacher = ({
  basePath,
  authConfig,
  executor,
  options,
  sessionManager,
  socketManager,
}: {
  basePath: string;
  authConfig: NonNullable<BackroadConfig>['auth'] | undefined;
  executor: BackroadExecutor;
  options: BackroadConfig | undefined;
  sessionManager: SessionManager;
  socketManager: SocketManager;
}) => {
  let attached = false;
  return (server: http.Server) => {
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
};
