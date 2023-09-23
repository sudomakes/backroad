import { BackroadSession } from './session';

const sessions: { [key: string]: BackroadSession } = {};
export const sessionManager = {
  getSession: (sessionId: BackroadSession['id']) => {
    if (!sessions[sessionId]) {
      null;
    }
    return sessions[sessionId];
  },
};
