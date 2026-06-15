import type { Socket, DefaultEventsMap } from 'socket.io';
import { InitOptions } from 'react-ga4/types/ga4';
import type { BackroadAuthInstance } from './auth';

export type BackroadConfig =
  | undefined
  | {
      analytics?: {
        google?: string | InitOptions[];
      };
      theme?: 'light' | 'dark';
      server?: {
        port?: number;
      };
      auth?: {
        instance: BackroadAuthInstance;
      };
    };
export type ClientToServerEventTypes =
  | 'get_value'
  | 'set_value'
  | 'run_script'
  | 'unset_value';
type ConstructSocketIoEventSignatureFromBackroadEvents<
  T extends BackroadEvents
> = {
  [key in T]: (
    args: BackroadEventsMapping[key]['args'],
    callback: (callBackArgs: BackroadEventsMapping[key]['response']) => void
  ) => void;
};
export type ServerToClientEventTypes =
  | 'render'
  | 'running'
  | 'backroad_config'
  | 'props_change'
  | 'auth_redirect'
  | 'auth_signout';
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
    args: {
      id: string;
      value: string;
      //  triggerRerun?: boolean
    };
    response?: void;
  };
  render: {
    args: string[]; //BackroadNode<true, false>;
    response?: void;
  };
  running: {
    // true when the server starts executing the script, false when it
    // finishes — drives the live "Running" indicator (no client-side guesses).
    args: boolean;
    response?: void;
  };
  props_change: {
    args: any;
    response?: void;
  };
  config: {
    args: { theme?: 'light' | 'dark' | undefined };
    response?: void;
  };
  run_script: {
    args?: void;
    response?: never;
  };
  unset_value: {
    args: { id: string };
    response?: void;
  };
  backroad_config: {
    args: BackroadConfig;
    response?: never;
  };
  auth_redirect: {
    args: { url: string };
    response?: void;
  };
  auth_signout: {
    args: undefined;
    response?: void;
  };
};
export type BackroadEvents = keyof BackroadEventsMapping;
export type ServerSocketType = Socket<
  ClientToServerEvents,
  ServerToClientEvents,
  DefaultEventsMap,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  any
>;
