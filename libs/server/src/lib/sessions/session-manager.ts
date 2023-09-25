import { BackroadSession } from './session';
const sessions: { [key: string]: BackroadSession } = {};
export const sessionManager = {
  getSession: (sessionId: BackroadSession['id']) => {
    if (!sessions[sessionId]) {
      null;
    }
    return sessions[sessionId];
  },
  register: (session: BackroadSession) => {
    if (session.id in sessions) {
      throw new Error('Session already exists');
    }
    sessions[session.id] = session;
  },
  unregister: (session: BackroadSession) => {
    delete sessions[session.id];
  },
};
