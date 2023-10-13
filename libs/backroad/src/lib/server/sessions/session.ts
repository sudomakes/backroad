import {
  getInitialTreeStructure,
  type BackroadContainer,
  type ComponentPropsMapping,
  type InbuiltComponentTypes,
} from '@backroad/core';
import { BackroadNodeManager } from '../../backroad';
import { RenderQueue } from '../../backroad/render-queue';
import superjson from 'superjson';
import { UploadManager } from './upload-manager';
export class BackroadSession {
  sessionId: string;
  state: { [key: string]: unknown } = {};
  renderQueue: RenderQueue;
  rootNodeManager: BackroadNodeManager<'base'>;
  uploadManager: UploadManager;
  constructor(sessionId: string) {
    this.uploadManager = new UploadManager();
    this.sessionId = sessionId;
    this.rootNodeManager = new BackroadNodeManager(
      getInitialTreeStructure(),
      this
    );
    this.renderQueue = new RenderQueue(this);
  }

  get mainPageNodeManager() {
    return new BackroadNodeManager(
      this.rootNodeManager.container.children[0] as BackroadContainer<'page'>,
      this
    ); // this should always be the main page
  }
  resetTree() {
    this.renderQueue.flush(); // get rid of all pending flush commands
    this.rootNodeManager = new BackroadNodeManager(
      getInitialTreeStructure(),
      this
    );
  }

  valueOf<ComponentType extends InbuiltComponentTypes>(id: string) {
    if (id in this.state) {
      return this.state[id] as ComponentPropsMapping[ComponentType]['value'];
    }
    throw new Error(`No value found for ${id}`);
  }

  setValue(id: string, value: unknown) {
    this.state[id] = superjson.parse(superjson.stringify(value));
    // this.onRunRequest()
  }
  unsetValue(id: string) {
    delete this.state[id];
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
