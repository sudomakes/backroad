import { SocketManager } from '../../backroad/socket-manager';
import { BackroadSession } from './session';

// One session registry per Backroad instance. Created via createSessionManager
// so each mounted app (or each run()) owns its own sessions map and its own
// SocketManager — the two move together because every BackroadSession needs to
// reach its instance's sockets (render-queue, br.login/logout).
export const createSessionManager = (socketManager: SocketManager) => {
  const sessions = new Map<string, BackroadSession>();
  return {
    getSession: <const T extends boolean>(
      sessionId: BackroadSession['sessionId'],
      props?: { upsert: T }
    ): T extends true ? BackroadSession : BackroadSession | null => {
      const existing = sessions.get(sessionId);
      if (!existing) {
        if (props && props.upsert) {
          const created = new BackroadSession(sessionId, socketManager);
          sessions.set(sessionId, created);
          return created;
        } else {
          // @ts-expect-error - this is fine
          return null;
        }
      }
      return existing;
    },
    unregister: (session: BackroadSession) => {
      sessions.delete(session.sessionId);
    },
  };
};
