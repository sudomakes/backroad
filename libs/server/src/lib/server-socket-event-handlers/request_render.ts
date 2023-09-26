import { BackroadNode } from 'backroad-core';
import { IServerSocketEventHandler } from './base';
import { sessionManager } from '../sessions/session-manager';

export const requestRender: IServerSocketEventHandler =
  (socket) => (props: { node: BackroadNode; sessionId: string }, callback) => {
    console.log('sending render request to client', props);
    socket.to(props.sessionId).emit(
      'render',
      {
        ...props.node,
        ...('type' in props.node && props.node.key
          ? {
              value: sessionManager
                .getSession(props.sessionId)
                .valueOf(props.node.key),
            }
          : {}),
      },
      () => {
        callback();
      }
    );
  };
