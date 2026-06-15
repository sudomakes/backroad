/** Barrel for the socket module: installs server-driven listeners on first import and re-exports the public surface. */
import { registerAuthSynchronizers } from './auth-synchronizers';
import { registerToastSynchronizer } from './toast-synchronizer';

registerAuthSynchronizers();
registerToastSynchronizer();

export { sessionId } from './session';
export { socket } from './client';
export { setBackroadValue, setRunUnsetBackroadValue } from './value-setters';
export { showToast } from './toast-synchronizer';
