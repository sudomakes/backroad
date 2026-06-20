import { SocketManager } from '../../backroad/socket-manager';
import { BackroadSession } from './session';

// One session registry per Backroad instance. Created via createSessionManager
// so each mounted app (or each run()) owns its own sessions map and its own
// SocketManager — the two move together because every BackroadSession needs to
// reach its instance's sockets (render-queue, br.login/logout).
export const createSessionManager = (socketManager: SocketManager) => {
  const sessions: { [key: string]: BackroadSession | undefined } = {};
  return {
    getSession: <const T extends boolean>(
      sessionId: BackroadSession['sessionId'],
      props?: { upsert: T }
    ): T extends true ? BackroadSession : BackroadSession | null => {
      if (!sessions[sessionId]) {
        if (props && props.upsert) {
          sessions[sessionId] = new BackroadSession(sessionId, socketManager);
          return sessions[sessionId];
        } else {
          // @ts-expect-error - this is fine
          return null;
        }
      }
      return sessions[sessionId];
    },
    unregister: (session: BackroadSession) => {
      delete sessions[session.sessionId];
    },
  };
};

export type SessionManager = ReturnType<typeof createSessionManager>;
