import { BackroadSession } from './session';
const sessions: { [key: string]: BackroadSession } = {};
export const sessionManager = {
  getSession: (
    sessionId: BackroadSession['sessionId'],
    props?: { upsert: boolean }
  ) => {
    if (!sessions[sessionId]) {
      if (props?.upsert) {
        sessions[sessionId] = new BackroadSession(sessionId);
      } else {
        return null;
      }
    }
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
