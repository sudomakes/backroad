// eslint-disable-next-line @nx/enforce-module-boundaries
import { InbuiltComponentTypes, isBackroadComponent } from 'backroad-core';
import { IServerSocketEventHandler } from './base';
import superjson from 'superjson';
export const requestRender: IServerSocketEventHandler<'request_render'> =
  (socket, backroadSession) => (props, callback) => {
    // console.log(
    //   'sending render request to client',
    //   props,
    //   'current value',
    //   backroadSession.valueOf(props.node.id)
    // );
    // frontend client will be part of the room with id same as its own session id
    if (isBackroadComponent(props.node, false)) {
      socket.broadcast.emit(
        'render',
        superjson.stringify({
          ...props.node,
          value: backroadSession.valueOf<InbuiltComponentTypes>(props.node.id),
        }),
        () => {
          callback();
        }
      );
    } else {
      socket.broadcast.emit('render', superjson.stringify(props.node), () => {
        callback();
      });
    }
    // notify everyone (only client listens to this)
  };
