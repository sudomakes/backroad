import express from 'express';
import path from 'path';
import * as http from 'http';
import { Namespace, Server } from 'socket.io';
// import { runScript } from './server-socket-event-handlers/run_script';
// eslint-disable-next-line @nx/enforce-module-boundaries
import type { ClientToServerEvents, ServerToClientEvents } from 'backroad-core';
// import open from 'open';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';
import { join } from 'path';
export const startBackroadServer = (options: { port: number }) => {
  return new Promise<
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
