import { BackroadSession } from './session';
const sessions: { [key: string]: BackroadSession | undefined } = {};
export const sessionManager = {
  getSession: <const T extends boolean>(
    sessionId: BackroadSession['sessionId'],
    props?: { upsert: T }
  ): T extends true ? BackroadSession : BackroadSession | null => {
    if (!sessions[sessionId]) {
      if (props && props.upsert) {
        sessions[sessionId] = new BackroadSession(sessionId);
        // @ts-expect-error - this is fine
        return sessions[sessionId];
      } else {
        // @ts-expect-error - this is fine
        return null;
      }
    }
    // @ts-expect-error - this is fine
    return sessions[sessionId];
  },
  // register: (session: BackroadSession) => {
  //   if (session.sessionId in sessions) {
  //     throw new Error('Session already exists');
  //   }
  //   sessions[session.sessionId] = session;
  // },
  unregister: (session: BackroadSession) => {
    delete sessions[session.sessionId];
  },
};
