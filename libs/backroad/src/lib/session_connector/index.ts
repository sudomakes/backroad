import {
  BackroadComponent,
  BackroadNode,
  ClientToServerEvents,
  ComponentPropsMapping,
  InbuiltComponentTypes,
  ServerToClientEvents,
} from 'backroad-core';
import { Socket, io } from 'socket.io-client';
import superjson from 'superjson';

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

let connection: Socket<ServerToClientEvents, ClientToServerEvents> | null =
  null;
const getConnection = () => {
  return new Promise<Omit<typeof connection, null>>((resolve) => {
    if (connection === null) {
      connection = io(
        `http://localhost:${getSessionInformation().serverPort}/${
          getSessionInformation().sessionId
        }`,
        {
          path: `/api/socket.io`,
        }
      );
      connection.on('connect', () => {
        resolve(connection);
        console.debug('connected to socket inside backroad package');
      });
    } else {
      resolve(connection);
    }
  });
};
export class sessionConnector {
  static async getValueOf<T extends InbuiltComponentTypes>(
    props: BackroadComponent<T, false>
  ) {
    const socket = await getConnection();
    return new Promise<ComponentPropsMapping[T]['value']>((resolve) => {
      socket.emit(
        'get_value',
        { id: props.id, sessionId: getSessionInformation().sessionId },
        (value: string) => {
          resolve(superjson.parse(value));
        }
      );
    });
  }
  static async setValueIfNotExists<T extends InbuiltComponentTypes>(props: {
    id: string;
    value: ComponentPropsMapping[T]['value'];
  }) {
    console.debug(
      'backroad sdk requesting setting value if not exists for id',
      props.id,
      'requested value:',
      props.value
    );
    const socket = await getConnection();
    return new Promise<boolean>((resolve) => {
      socket.emit(
        'set_value_if_not_exists',
        {
          id: props.id,
          data: superjson.stringify(props.value),
          sessionId: getSessionInformation().sessionId,
        },
        (val) => {
          console.log(
            'verdict for setting value if not exists for id:',
            props.id,
            'is:',
            val
          );
          resolve(val);
        }
      );
    });
  }
  static async requestRender(node: BackroadNode) {
    const socket = await getConnection();
    return new Promise<void>((resolve) => {
      socket.emit(
        'request_render',
        {
          node,
        },
        () => {
          resolve();
        }
      );
    });
  }
}
