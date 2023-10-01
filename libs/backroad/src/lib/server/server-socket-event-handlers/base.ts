// eslint-disable-next-line @nx/enforce-module-boundaries
import {
  BackroadEvents,
  BackroadEventsMapping,
  ClientToServerEvents,
  ServerToClientEvents,
} from 'backroad-core';
import { Socket } from 'socket.io';
import { BackroadSession } from '../sessions/session';

export type IServerSocketEventHandler<
  EventType extends BackroadEvents,
  Context = undefined
> = (
  socket: Socket<ClientToServerEvents, ServerToClientEvents>,
  backroadSession: BackroadSession,
  ...context: Context extends undefined ? [undefined?] : [Context]
) => // eslint-disable-next-line @typescript-eslint/no-explicit-any
(
  args: BackroadEventsMapping[EventType]['args'],
  callback?: (
    callbackArgs: BackroadEventsMapping[EventType]['response']
  ) => void
) => void;
