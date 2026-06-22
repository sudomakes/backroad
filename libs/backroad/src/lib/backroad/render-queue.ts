import { BackroadSession } from '../server/sessions/session';
import { SocketManager } from './socket-manager';

type QueuedNode = { payload: string; runId: number };

export class RenderQueue {
  queue: QueuedNode[] = [];
  // Coalesce a synchronous burst of renders (one script pass pushes many nodes)
  // into a single emit, flushed on the next microtask. No artificial delay: the
  // old 500ms debounce reset its timer on every push, so a steady token stream —
  // renders arriving <500ms apart — never flushed until the stream paused, which
  // is what made streamed chat updates land in one late jump.
  #flushScheduled = false;
  addToQueue(payload: string) {
    // Stamp with the run that produced this patch (NOT the run that happens to
    // be current at flush time) so a superseded async run's late patches stay
    // labelled with their stale runId and get dropped by the client.
    this.queue.push({ payload, runId: this.backroadSession.runId });
    if (this.#flushScheduled) return;
    this.#flushScheduled = true;
    queueMicrotask(() => {
      this.#flushScheduled = false;
      if (this.queue.length) this.#flushToFrontend();
    });
  }
  constructor(private backroadSession: BackroadSession) {}
  flush() {
    const queue = this.queue;
    this.queue = [];
    return queue;
  }
  #flushToFrontend() {
    const socket = SocketManager.getSocket(this.backroadSession.sessionId);
    const nodes = this.flush();
    // A single coalesced flush can (when async runs overlap) contain patches
    // from more than one run. Emit one `render` per contiguous run group so each
    // batch carries a single, accurate runId for the client gate.
    let i = 0;
    while (i < nodes.length) {
      const runId = nodes[i].runId;
      const group: string[] = [];
      while (i < nodes.length && nodes[i].runId === runId) {
        group.push(nodes[i].payload);
        i++;
      }
      socket.emit('render', { nodes: group, runId }, () => {
        /* ack ignored */
      });
    }
  }
  updateProps(props: any) {
    const socket = SocketManager.getSocket(this.backroadSession.sessionId);
    socket.emit('props_change', props, () => {
      console.log('props change request acked by frontend');
    });
  }
}
