import type { Socket } from 'socket.io';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';
export type ClientToServerEventTypes = 'get_value' | 'set_value' | 'run_script';
// | 'get_tree'
// | 'set_value_if_not_exists'
// | 'request_render'
// | 'run_script'
type ConstructSocketIoEventSignatureFromBackroadEvents<
  T extends BackroadEvents
> = {
  [key in T]: (
    args: BackroadEventsMapping[key]['args'],
    callback: (callBackArgs: BackroadEventsMapping[key]['response']) => void
  ) => void;
};
export type ServerToClientEventTypes = 'render' | 'running';
export type ClientToServerEvents =
  ConstructSocketIoEventSignatureFromBackroadEvents<ClientToServerEventTypes>;
export type ServerToClientEvents =
  ConstructSocketIoEventSignatureFromBackroadEvents<ServerToClientEventTypes>;
export type BackroadEventsMapping = {
  get_value: {
    args: { id: string; sessionId: string };
    response: string;
  };
  set_value: {
    args: { id: string; value: string; triggerRerun?: boolean };
    response?: void;
  };
  render: {
    args: string; //BackroadNode<true, false>;
    response?: void;
  };
  running: {
    args: null;
    response?: void;
  };
  run_script: {
    args?: void;
    response?: never;
  };
  // request_render: {
  //   args: { node: BackroadNode<false, false> };
  //   response: void;
  // };
  // get_tree: {
  //   args: object;
  //   response: BackroadContainer<'base', true>;
  // };
  // set_value_if_not_exists: {
  //   args: { id: string; sessionId: string; data: string };
  //   response: boolean;
  // };
};
export type BackroadEvents = keyof BackroadEventsMapping;
export type ServerSocketType = Socket<
  ClientToServerEvents,
  ServerToClientEvents,
  DefaultEventsMap,
  any
>;
