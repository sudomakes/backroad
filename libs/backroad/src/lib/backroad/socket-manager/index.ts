import type { ServerSocketType } from '@backroad/core';

// One SocketManager per Backroad instance (see buildBackroadHandler). Holding
// the sessionId→socket map on the instance — rather than a module-global —
// lets two Backroad apps run in the same process without their sockets
// colliding.
export class SocketManager {
  #sessionToSocketMapping = new Map<string, ServerSocketType>();
  getSocket(sessionId: string) {
    const socket = this.#sessionToSocketMapping.get(sessionId);
    if (socket) return socket;
    else throw new Error(`No socket found for session ${sessionId}`);
  }
  register(sessionId: string, socket: ServerSocketType) {
    this.#sessionToSocketMapping.set(sessionId, socket);
  }
  unregister(sessionId: string, socket: ServerSocketType) {
    // Only drop the mapping when it still points at the disconnecting socket.
    // A stale disconnect (older connection closing after a newer socket for the
    // same session has registered) must not evict the live socket.
    if (this.#sessionToSocketMapping.get(sessionId) === socket) {
      this.#sessionToSocketMapping.delete(sessionId);
    }
  }
}
