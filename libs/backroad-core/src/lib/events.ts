import { BackroadNode } from './core';

type ClientToServerEventTypes =
  | 'get_value'
  | 'set_value_if_not_exists'
  | 'request_render'
  | 'run_script'
  | 'set_value';
type ConstructSocketIoEventSignatureFromBackroadEvents<
  T extends BackroadEvents
> = {
  [key in T]: (
    args: BackroadEventsMapping[key]['args'],
    callback: (callBackArgs: BackroadEventsMapping[key]['response']) => void
  ) => void;
};
type ServerToClientEventTypes = 'render' | 'running';
export type ClientToServerEvents =
  ConstructSocketIoEventSignatureFromBackroadEvents<ClientToServerEventTypes>;
export type ServerToClientEvents =
  ConstructSocketIoEventSignatureFromBackroadEvents<ServerToClientEventTypes>;
export type BackroadEventsMapping = {
  get_value: {
    args: { id: string; sessionId: string };
    response: string;
  };
  request_render: {
    args: { node: BackroadNode<false, false> };
    response: void;
  };
  set_value_if_not_exists: {
    args: { id: string; sessionId: string; data: string };
    response: boolean;
  };
  run_script: {
    args?: void;
    response?: never;
  };
  set_value: {
    args: { id: string; value: string; triggerRerun?: boolean };
    response: never;
  };
  render: {
    args: string; //BackroadNode<true, false>;
    response?: void;
  };
  running: {
    args: null;
    response?: void;
  };
};
export type BackroadEvents = keyof BackroadEventsMapping;
