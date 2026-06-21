/** Barrel for the socket module: installs auth listeners on first import and re-exports the public surface. */
import { registerAuthSynchronizers } from './auth-synchronizers';

registerAuthSynchronizers();

export { sessionId } from './session';
export { getBasePath, withBasePath } from './base-path';
export { backroadFetch } from './fetch';
export { socket } from './client';
export { setBackroadValue, setRunUnsetBackroadValue } from './value-setters';
export { showToast } from './show-toast';
