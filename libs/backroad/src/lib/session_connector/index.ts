import {
  BackroadComponent,
  BackroadNode,
  ComponentPropsMapping,
  InbuiltComponentTypes,
} from '@backroad/core';
import { io, Socket } from 'socket.io-client';
import superjson from 'superjson';
import deasync from 'deasync';
let socket: Socket | null = null;
const getConnection = () => {
  if (!socket) {
    if (
      process.env['BACKROAD_SESSION'] &&
      process.env['BACKROAD_SERVER_PORT']
    ) {
      socket = io({
        path: `http://localhost:${process.env['BACKROAD_SERVER_PORT']}/api/socket.io`,
      });
      socket.emit('init', {
        sessionId: process.env['BACKROAD_SESSION'],
      });
    } else {
      throw new Error('No backroad server connection data found');
    }
  }
  return socket;
};
export class sessionConnector {
  static getValueOf<T extends InbuiltComponentTypes>(
    props: BackroadComponent<T>
  ) {
    const socket = getConnection();
    let returnValue: unknown = '__NO_RESULT__';
    socket.emit('get-value', props.key, (payload: { data: string }) => {
      returnValue = superjson.parse(payload.data);
    });

    while (returnValue === '__NO_RESULT__') {
      deasync.sleep(100);
    }
    return returnValue as ComponentPropsMapping[T]['value'];
  }
  static setValueIfNotExists<T extends InbuiltComponentTypes>(props: {
    key: string;
    value: ComponentPropsMapping[T]['value'];
  }) {
    const socket = getConnection();
    return new Promise<void>((resolve) => {
      socket.emit(
        'set-value-if-not-exists',
        props.key,
        superjson.stringify(props.value),
        () => {
          resolve();
        }
      );
    });
  }
  static requestRender(element: BackroadNode) {
    socket.emit('request-render', element);
  }
}
