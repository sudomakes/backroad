import { IServerSocketConfigHandler } from './types';
export const getConfig: IServerSocketConfigHandler<
  'get_config',
  () => Promise<void>
> = (socket, config, context) => () => {
  context();
  socket.emit('config', config, () => {
    console.log(`frontend config:\n${JSON.stringify(config, null, 2)}`);
  });
};
