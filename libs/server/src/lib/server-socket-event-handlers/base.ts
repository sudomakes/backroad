import { BackroadEvents, BackroadEventsMapping } from 'backroad-core';
import { Socket } from 'socket.io';

export type IServerSocketEventHandler<
  EventType extends BackroadEvents,
  Context = unknown
> = (
  socket: Socket,
  context?: Context
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
) => (
  args: BackroadEventsMapping[EventType]['args'],
  callback?: (
    callbackArgs: BackroadEventsMapping[EventType]['response']
  ) => void
) => void;
