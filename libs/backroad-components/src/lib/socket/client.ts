/** Owns the singleton socket.io client connected to the per-tab session namespace. */
import { ClientToServerEvents, ServerToClientEvents } from '@backroad/core';
import { Socket, io } from 'socket.io-client';
import { withBasePath } from './base-path';
import { sessionId } from './session';

export const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
  // The namespace is the per-tab session id (relative to the origin, so it is
  // NOT prefixed). The handshake path, however, is the one place that carries
  // the mount sub-path — it must match the server's `${basePath}/api/socket.io`.
  `/${sessionId}`,
  {
    path: withBasePath('/api/socket.io'),
  }
);
