// eslint-disable-next-line @nx/enforce-module-boundaries
import type {
  BackroadEventsMapping,
  ClientToServerEventTypes,
  ClientToServerEvents,
  ServerToClientEvents,
} from '@backroad/core';
import { Socket } from 'socket.io';
import { BackroadSession } from '../sessions/session';

export type Config = {
  theme?: 'light' | 'dark';
};

export type IServerSocketEventHandler<
  EventType extends ClientToServerEventTypes,
  Context = undefined
> = (
  socket: Socket<ClientToServerEvents, ServerToClientEvents>,
  backroadSession: BackroadSession,
  ...context: Context extends undefined ? [undefined?] : [Context]
) => // eslint-disable-next-line @typescript-eslint/no-explicit-any
(
  args: BackroadEventsMapping[EventType]['args'],
  callback: (callbackArgs: BackroadEventsMapping[EventType]['response']) => void
) => void;

export type IServerSocketConfigHandler<
  EventType extends ClientToServerEventTypes,
  Context = undefined
> = (
  socket: Socket<ClientToServerEvents, ServerToClientEvents>,
  config: Config,
  ...context: Context extends undefined ? [undefined?] : [Context]
) => (
  args: BackroadEventsMapping[EventType]['args'],
  callback: (callbackArgs: BackroadEventsMapping[EventType]['response']) => void
) => void;
