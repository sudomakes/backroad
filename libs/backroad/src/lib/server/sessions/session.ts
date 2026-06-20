import {
  getInitialTreeStructure,
  type BackroadContainer,
  type BackroadUser,
  type ComponentPropsMapping,
  type InbuiltComponentTypes,
} from '@backroad/core';
import { BackroadNodeManager } from '../../backroad';
import { RenderQueue } from '../../backroad/render-queue';
import { SocketManager } from '../../backroad/socket-manager';
import superjson from 'superjson';
// import { UploadManager } from './upload-manager';

// What a download_button payload can resolve to: text or raw bytes (Buffer is a
// Uint8Array, so binary formats — images, PDFs, zips — are covered).
type DownloadContent = string | Uint8Array;
// Always a function so the contents are computed lazily, on request only. May
// be sync or async.
export type DownloadDataResolver = () =>
  | DownloadContent
  | Promise<DownloadContent>;

export class BackroadSession {
  sessionId: string;
  state: { [key: string]: unknown } = {};
  // Payloads for download_button, keyed by component id. Kept out of the
  // component tree so a large file never serializes into every rerun's render
  // emit — it's streamed on demand via GET /api/download/:sessionId/:id.
  // `data` may be a thunk: when so, the contents aren't even computed until a
  // download is actually requested, so an expensive payload costs nothing on
  // the (common) runs where the button is never clicked.
  downloads: {
    [id: string]: {
      data: DownloadDataResolver;
      filename?: string;
      mime?: string;
    };
  } = {};
  renderQueue: RenderQueue;
  rootNodeManager: BackroadNodeManager<'base'>;
  user: BackroadUser = { isLoggedIn: false };
  // The instance's socket registry. Held on the session so anything reachable
  // from a session (render-queue, br.login/logout) can emit without touching a
  // module-global — that's what keeps two Backroad apps isolated in one process.
  socketManager: SocketManager;
  // uploadManager: UploadManager;
  constructor(sessionId: string, socketManager: SocketManager) {
    // this.uploadManager = new UploadManager();
    this.sessionId = sessionId;
    this.socketManager = socketManager;
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
    this.rootNodeManager.reset(getInitialTreeStructure());
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

  setDownload(
    id: string,
    payload: {
      data: DownloadDataResolver;
      filename?: string;
      mime?: string;
    }
  ) {
    this.downloads[id] = payload;
  }
  getDownload(id: string) {
    return this.downloads[id];
  }

  // notify
  setValueIfNotSet(id: string, value: unknown) {
    if (id in this.state) {
      return false;
    }
    this.setValue(id, value);
    return true;
  }
}
