import { BackroadNode } from '@backroad/core';
import { IServerSocketEventHandler } from './base';

export const requestRender: IServerSocketEventHandler =
  (socket) => (element: BackroadNode) => {
    console.log('requested render', element);
  };
