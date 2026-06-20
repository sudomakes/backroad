import type { ServerSocketType } from '@backroad/core';

// One SocketManager per Backroad instance (see buildBackroadHandler). Holding
// the sessionId→socket map on the instance — rather than a module-global —
// lets two Backroad apps run in the same process without their sockets
// colliding.
export class SocketManager {
  #sessionToSocketMapping: Record<string, ServerSocketType> = {};
  getSocket(sessionId: string) {
    if (sessionId in this.#sessionToSocketMapping)
      return this.#sessionToSocketMapping[sessionId];
    else throw new Error(`No socket found for session ${sessionId}`);
  }
  register(sessionId: string, socket: ServerSocketType) {
    this.#sessionToSocketMapping[sessionId] = socket;
  }
}
