import {
  BackroadComponent,
  BackroadNode,
  ComponentPropsMapping,
  InbuiltComponentTypes,
} from '@backroad/core';
import { io, Socket } from 'socket.io-client';
import superjson from 'superjson';
// import deasync from 'deasync';

const getSessionInformation = () => {
  if (process.env['BACKROAD_SESSION'] && process.env['BACKROAD_SERVER_PORT']) {
    return {
      sessionId: process.env['BACKROAD_SESSION'],
      serverPort: process.env['BACKROAD_SERVER_PORT'],
    };
  } else {
    throw new Error('No backroad server connection data found');
  }
};
const getConnection = () => {
  // if (!socket) {
  return new Promise<Socket>((resolve) => {
    console.log('getting socket', getSessionInformation());
    const socket = io(
      `http://localhost:${getSessionInformation().serverPort}`,
      {
        path: `/api/socket.io`,
        // hostname: 'localhost',
        // host:"",
        // port: getSessionInformation().serverPort,
      }
    );
    // socket.connect();
    // let connected = false;
    socket.on('connect', () => {
      // connected = true;
      resolve(socket);
      console.debug('connected to socket inside backroad package');
    });
    // socket.on('disconnect', () => {
    //   console.debug('disconnected from socket inside backroad package');
    // });
    // socket.on('connect_error', (err) => {
    //   console.debug('connection error', err);
    // });
    // while (!connected) {
    // deasync.sleep(100);
    // }
    // }
    // return socket;
  });
};
export class sessionConnector {
  static async getValueOf<T extends InbuiltComponentTypes>(
    props: BackroadComponent<T>
  ) {
    const socket = await getConnection();
    return new Promise<ComponentPropsMapping[T]['value']>((resolve) => {
      socket.emit(
        'get_value',
        { key: props.key, sessionId: getSessionInformation().sessionId },
        (value: string) => {
          resolve(superjson.parse(value));
        }
      );
    });
  }
  static async setValueIfNotExists<T extends InbuiltComponentTypes>(props: {
    key: string;
    value: ComponentPropsMapping[T]['value'];
  }) {
    console.debug('setting value if not exists', props);
    const socket = await getConnection();
    return new Promise<void>((resolve) => {
      socket.emit(
        'set_value_if_not_exists',
        {
          key: props.key,
          data: superjson.stringify(props.value),
          sessionId: getSessionInformation().sessionId,
        },
        (val) => {
          console.log('value set successfully for', props.key, val);
          resolve();
        }
      );
    });

    // while (responseValue === null) {
    //   // deasync.sleep(100);
    // }
    // return new Promise<void>((resolve) => {
    // });
  }
  static async requestRender(node: BackroadNode) {
    const socket = await getConnection();
    return new Promise<void>((resolve) => {
      socket.emit(
        'request_render',
        {
          node,
          sessionId: getSessionInformation().sessionId,
        },
        () => {
          resolve();
        }
      );
    });
  }
}
