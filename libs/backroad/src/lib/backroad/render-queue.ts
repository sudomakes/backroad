import { BackroadSession } from '../server/sessions/session';
import { SocketManager } from './socket-manager';

export class RenderQueue {
  queue: string[] = [];
  flushTimeout: NodeJS.Timeout | null = null;
  addToQueue(payload: string) {
    this.queue.push(payload);
    if (this.flushTimeout) {
      clearTimeout(this.flushTimeout);
    }
    this.flushTimeout = setTimeout(() => {
      this.#flushToFrontend();
    }, 500);
  }
  constructor(private backroadSession: BackroadSession) {}
  flush() {
    if (this.flushTimeout) {
      clearTimeout(this.flushTimeout);
    }
    const queue = JSON.parse(JSON.stringify(this.queue));
    this.queue = [];
    return queue;
  }
  #flushToFrontend() {
    const socket = SocketManager.getSocket(this.backroadSession.sessionId);
    const nodesToEmit = this.flush();
    socket.emit('render', nodesToEmit, () => {
      console.log('batched render request acked by frontend');
    });
  }
  updateProps(props: any) {
    const socket = SocketManager.getSocket(this.backroadSession.sessionId);
    socket.emit('props_change', props, () => {
      console.log('props change request acked by frontend');
    });
  }
}
