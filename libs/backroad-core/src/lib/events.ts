import type { Socket, DefaultEventsMap } from 'socket.io';
import { InitOptions } from 'react-ga4/types/ga4';
import type { BackroadAuthInstance } from './auth';

export type BackroadConfig =
  | undefined
  | {
      analytics?: {
        google?: string | InitOptions[];
      };
      /**
       * App-maker recommended defaults. Applied only until the user picks their
       * own (a persisted client preference always wins), so these are
       * recommendations, not overrides — unlike session-scoped backroad values.
       */
      appearance?: {
        /** Palette name matching a frontend theme (e.g. 'claude', 'twitter'). */
        theme?: string;
        mode?: 'light' | 'dark' | 'system';
      };
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
  | 'auth_signout'
  | 'toast_show';

// A toast is a fire-and-forget notification, not a tree node. Pushing it
// through the render queue would let the 500ms batch coalesce a button's
// transient set→unset reruns and drop it before it ever reaches the client, so
// it rides its own immediate event instead (like auth_redirect).
export type ToastArgs = {
  message: string;
  variant?: 'info' | 'success' | 'warning' | 'error';
  // ms on screen; 0 keeps it until dismissed; omit for the default.
  duration?: number;
};
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
      // The path the client is on when this run is triggered. Every
      // run-triggering event carries it so the server derives currentPath
      // purely from the request — no persisted/assumed state.
      pathname: string;
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
    args: { pathname: string };
    response?: never;
  };
  unset_value: {
    args: { id: string; pathname: string };
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
  toast_show: {
    args: ToastArgs;
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
