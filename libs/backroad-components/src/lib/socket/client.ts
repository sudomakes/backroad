/** Owns the singleton socket.io client connected to the per-tab session namespace. */
import { ClientToServerEvents, ServerToClientEvents } from '@backroad/core';
import { Socket, io } from 'socket.io-client';
import { sessionId } from './session';

export const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
  `/${sessionId}`,
  {
    path: '/api/socket.io',
  }
);
