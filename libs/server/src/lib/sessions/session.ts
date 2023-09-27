import { ChildProcessWithoutNullStreams } from 'child_process';
import { Socket } from 'socket.io';
import { getBackroadScriptRunner } from '../runner';

export class BackroadSession {
  #runnerProcess?: ChildProcessWithoutNullStreams;
  sessionId: string;
  state: { [key: string]: unknown } = {};

  constructor(socket: Socket) {
    this.sessionId = socket.id;
  }

  valueOf(id: string) {
    return this.state[id];
  }

  setValue(id: string, value: unknown) {
    this.state[id] = value;
  }

  setValueIfNotSet(id: string, value: unknown) {
    if (id in this.state) {
      return;
    }
    this.setValue(id, value);
  }

  setRunnerProcess(props: { scriptPath: string; serverPort: number }) {
    if (this.#runnerProcess) {
      this.#runnerProcess.kill();
    }
    this.#runnerProcess = getBackroadScriptRunner({
      scriptPath: props.scriptPath,
      envVariables: {
        BACKROAD_SESSION: this.sessionId,
        BACKROAD_SERVER_PORT: props.serverPort.toString(),
      },
    });
  }
}
