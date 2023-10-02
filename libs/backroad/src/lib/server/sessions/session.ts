// eslint-disable-next-line @nx/enforce-module-boundaries
import {
  BackroadContainer,
  ComponentPropsMapping,
  InbuiltComponentTypes,
} from 'backroad-core';
// import { ChildProcessWithoutNullStreams } from 'child_process';
// import { getBackroadScriptRunner } from '../runner';
import { BackroadNodeManager } from '../../backroad';

export class BackroadSession {
  // #runnerProcess?: ChildProcessWithoutNullStreams;
  sessionId: string;
  state: { [key: string]: unknown } = {};
  rootNodeManager: BackroadNodeManager<'base'>;
  constructor(sessionId: string) {
    this.sessionId = sessionId;
    this.rootNodeManager = new BackroadNodeManager(
      {
        children: [
          {
            type: 'page',
            args: {
              path: '/',
            },
            children: [],
            path: 'children.0',
          },
        ],
        path: '',
        type: 'base',
        args: {},
      },
      this
    );
  }

  get mainPageNodeManager() {
    return new BackroadNodeManager(
      this.rootNodeManager.container.children[0] as BackroadContainer<'page'>,
      this
    ); // this should always be the main page
  }

  valueOf<ComponentType extends InbuiltComponentTypes>(id: string) {
    if (id in this.state) {
      return this.state[id] as ComponentPropsMapping[ComponentType]['value'];
    }
    return undefined;
  }

  setValue(id: string, value: unknown) {
    this.state[id] = value;
    // this.onRunRequest()
  }

  // notify
  setValueIfNotSet(id: string, value: unknown) {
    if (id in this.state) {
      return false;
    }
    this.setValue(id, value);
    return true;
  }

  // setRunnerProcess(props: { scriptPath: string; serverPort: number }) {
  //   if (this.#runnerProcess) {
  //     this.#runnerProcess.kill();
  //   }
  //   this.#runnerProcess = getBackroadScriptRunner({
  //     scriptPath: props.scriptPath,
  //     envVariables: {
  //       BACKROAD_SESSION: this.sessionId,
  //       BACKROAD_SERVER_PORT: props.serverPort.toString(),
  //     },
  //   });
  // }
}
