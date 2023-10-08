import type { ServerSocketType } from '@backroad/core';

const sessionToSocketMapping: Record<string, ServerSocketType> = {};
export class SocketManager {
  static getSocket(sessionId: string) {
    if (sessionId in sessionToSocketMapping)
      return sessionToSocketMapping[sessionId];
    else throw new Error(`No socket found for session ${sessionId}`);
  }
  static register(sessionId: string, socket: ServerSocketType) {
    sessionToSocketMapping[sessionId] = socket;
  }
}
