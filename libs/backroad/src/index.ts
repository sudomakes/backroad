export { run } from './lib/runner';
export type { BackroadRunContext } from './lib/runner';
export { BackroadNodeManager, ChatManager } from './lib/backroad';
export { Config } from './lib/server/server-socket-event-handlers/types';

// Pluggable mounting: embed a Backroad app inside an existing server instead of
// taking a whole port. buildBackroadHandler is the framework-agnostic core;
// backroadExpress / backroadHono are thin adapters over it.
export {
  buildBackroadHandler,
  type BackroadAdapterOptions,
  type BackroadExecutor,
  type BackroadHandler,
} from './lib/server/build';
export { backroadExpress } from './lib/adapters/express';
export { backroadHono } from './lib/adapters/hono';
