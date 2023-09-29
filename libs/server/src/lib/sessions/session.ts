import { ComponentPropsMapping, InbuiltComponentTypes } from 'backroad-core';
import { ChildProcessWithoutNullStreams } from 'child_process';
import { getBackroadScriptRunner } from '../runner';

export class BackroadSession {
  #runnerProcess?: ChildProcessWithoutNullStreams;
  sessionId: string;
  state: { [key: string]: unknown } = {};

  constructor(sessionId: string) {
    this.sessionId = sessionId;
  }

  valueOf<ComponentType extends InbuiltComponentTypes>(id: string) {
    if (id in this.state) {
      return this.state[id] as ComponentPropsMapping[ComponentType]['value'];
    }
    return undefined;
  }

  setValue(id: string, value: unknown) {
    this.state[id] = value;
  }

  setValueIfNotSet(id: string, value: unknown) {
    if (id in this.state) {
      return false;
    }
    this.setValue(id, value);
    return true;
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
