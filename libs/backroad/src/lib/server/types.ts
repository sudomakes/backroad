import type { BackroadConfig } from '@backroad/core';
import { BackroadNodeManager } from '../backroad';

export type BackroadRunContext = {
  currentPath: string;
};

export type BackroadExecutor = (
  nodeManager: BackroadNodeManager,
  context: BackroadRunContext
) => void | Promise<void>;

// Options accepted by the mountable core and the framework adapters. Everything
// in BackroadConfig (auth, appearance, analytics) plus the sub-path the app is
// mounted under. basePath defaults to '' (root) — that's the standalone run()
// case, behaviourally identical to before this refactor.
export type BackroadAdapterOptions = NonNullable<BackroadConfig> & {
  basePath?: string;
};
