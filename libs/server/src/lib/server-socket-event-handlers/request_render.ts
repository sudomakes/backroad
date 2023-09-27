import { sessionManager } from '../sessions/session-manager';
import { IServerSocketEventHandler } from './base';

export const requestRender: IServerSocketEventHandler<'request_render'> =
  (socket) => (props, callback) => {
    console.log('sending render request to client', props);
    // frontend client will be part of the room with id same as its own session id
    socket.to(props.sessionId).emit(
      'render',
      {
        ...props.node,
        ...('type' in props.node && props.node.id
          ? {
              value: sessionManager
                .getSession(props.sessionId)
                .valueOf(props.node.id),
            }
          : {}),
      },
      () => {
        callback();
      }
    );
  };
