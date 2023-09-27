import { BackroadNode } from './core';

type ClientToServerEventTypes =
  | 'get_value'
  | 'set_value_if_not_exists'
  | 'request_render'
  | 'run_script'
  | 'set_value_and_re_run';
interface ClientToServerEvents {
  [key in ClientToServerEventTypes]: (
    args: BackroadEventsMapping[typeof key]['args'],
    callback: (
      callBackArgs: BackroadEventsMapping[typeof key]['response']
    ) => void
  ) => void;
}
export type BackroadEventsMapping = {
  get_value: {
    args: { id: string; sessionId: string };
    response: string;
  };
  // set_value: {
  //   args: { id: string; sessionId: string; data: string };
  //   response: { message: 'Success' };
  // };
  request_render: {
    args: { node: BackroadNode; sessionId: string };
    response: void;
  };
  set_value_if_not_exists: {
    args: { id: string; sessionId: string; data: string };
    response: 'done';
  };
  run_script: {
    args: never;
    response: never;
  };
  set_value_and_re_run: {
    args: { id: string; value: string };
    response: never;
  };
};
export type BackroadEvents = keyof BackroadEventsMapping;
