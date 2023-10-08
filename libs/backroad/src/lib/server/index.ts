import express from 'express';
import * as http from 'http';
import path from 'path';
import { Namespace, Server } from 'socket.io';
import type {
  ClientToServerEvents,
  ServerToClientEvents,
} from '@backroad/core';
import { join } from 'path';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';
export const startBackroadServer = (options: { port: number }) => {
  return new Promise<
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Namespace<ClientToServerEvents, ServerToClientEvents, DefaultEventsMap, any>
  >((resolve) => {
    const app = express();
    const server = http.createServer(app);
    const io = new Server<ClientToServerEvents, ServerToClientEvents>(server, {
      path: '/api/socket.io',
      cors: {},
    });
    server.listen(options.port, () => {
      // open(`http://localhost:${options.port}/`);
      console.log(
        `server started. App can be accessed on http://localhost:${options.port}/`
      );
      resolve(io.of(/^\/.+$/));
    });
    app.use(express.static(join(__dirname, 'public')));

    app.get('*', (req, res) =>
      res.sendFile(path.resolve(__dirname, 'public', 'index.html'))
    );
  });
};
