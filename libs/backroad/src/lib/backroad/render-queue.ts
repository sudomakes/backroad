import { BackroadSession } from '../server/sessions/session';

export class RenderQueue {
  queue: string[] = [];
  // Coalesce a synchronous burst of renders (one script pass pushes many nodes)
  // into a single emit, flushed on the next microtask. No artificial delay: the
  // old 500ms debounce reset its timer on every push, so a steady token stream —
  // renders arriving <500ms apart — never flushed until the stream paused, which
  // is what made streamed chat updates land in one late jump.
  #flushScheduled = false;
  addToQueue(payload: string) {
    this.queue.push(payload);
    if (this.#flushScheduled) return;
    this.#flushScheduled = true;
    queueMicrotask(() => {
      this.#flushScheduled = false;
      if (this.queue.length) this.#flushToFrontend();
    });
  }
  constructor(private backroadSession: BackroadSession) {}
  flush() {
    const queue = JSON.parse(JSON.stringify(this.queue));
    this.queue = [];
    return queue;
  }
  #getSocket() {
    // The session can disconnect between scheduling a flush and the microtask
    // running, at which point getSocket() throws. Swallow that here so the
    // async flush path can't crash the process on a stale session.
    try {
      return this.backroadSession.socketManager.getSocket(
        this.backroadSession.sessionId
      );
    } catch {
      return undefined;
    }
  }
  #flushToFrontend() {
    const socket = this.#getSocket();
    // Still drain the queue even with no socket, so a later reconnect doesn't
    // replay a backlog of stale nodes.
    const nodesToEmit = this.flush();
    if (!socket) return;
    socket.emit('render', nodesToEmit, () => {
      /* ack ignored */
    });
  }
  updateProps(props: any) {
    const socket = this.#getSocket();
    if (!socket) return;
    socket.emit('props_change', props, () => {
      console.log('props change request acked by frontend');
    });
  }
}
