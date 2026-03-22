type SocketPayload = {
  id: string;
  value: unknown;
};

export const sessionId = 'ladle-preview-session';

export const socket = {
  emit: (...args: unknown[]) => {
    console.info('[ladle socket mock]', ...args);
  },
};

export const setBackroadValue = async ({ id, value }: SocketPayload) => {
  console.info('[ladle setBackroadValue]', { id, value });
};

export const setRunUnsetBackroadValue = async ({ id, value }: SocketPayload) => {
  console.info('[ladle setRunUnsetBackroadValue]', { id, value });
};
