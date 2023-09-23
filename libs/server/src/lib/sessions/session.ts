import { Socket } from 'socket.io';

export class BackroadSession {
  #id: string;
  state: { [key: string]: unknown } = {};

  constructor(socket: Socket) {
    this.#id = socket.id;
  }

  get id() {
    return this.#id;
  }

  valueOf(key: string) {
    return this.state[key];
  }

  setValue(key: string, value: unknown) {
    this.state[key] = value;
  }

  setValueIfNotSet(key: string, value: unknown) {
    if (key in this.state) {
      return;
    }
    this.setValue(key, value);
  }
}
