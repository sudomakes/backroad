import { BackroadNode } from './core';

type ClientToServerEventTypes =
  | 'get_value'
  | 'set_value_if_not_exists'
  | 'request_render'
  | 'run_script'
  | 'set_value_and_re_run';
type ConstructSocketIoEventSignatureFromBackroadEvents<
  T extends BackroadEvents
> = {
  [key in T]: (
    args: BackroadEventsMapping[key]['args'],
    callback: (callBackArgs: BackroadEventsMapping[key]['response']) => void
  ) => void;
};
type ServerToClientEventTypes = 'render';
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
    args: { node: BackroadNode; sessionId: string };
    response: void;
  };
  set_value_if_not_exists: {
    args: { id: string; sessionId: string; data: string };
    response: 'done';
  };
  run_script: {
    args?: void;
    response?: never;
  };
  set_value_and_re_run: {
    args: { id: string; value: string };
    response: never;
  };
  render: {
    args: { value?: unknown; path: string; type: string; id?: string };
    response?: void;
  };
};
export type BackroadEvents = keyof BackroadEventsMapping;
