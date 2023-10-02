import express from 'express';
import * as http from 'http';
import { Namespace, Server } from 'socket.io';
// import { runScript } from './server-socket-event-handlers/run_script';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { ClientToServerEvents, ServerToClientEvents } from 'backroad-core';
import open from 'open';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';
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
      open(`http://localhost:${options.port}/`);
      console.log(
        `server started. App can be accessed on http://localhost:${options.port}/`
      );
      resolve(io.of(/^\/.+$/));
    });
  });

  // .on('connection',
  // (socket) => {
  //   console.log('connected to namespace', socket.nsp.name);
  //   const backroadSession = sessionManager.getSession(
  //     socket.nsp.name.slice(1),
  //     {
  //       upsert: true,
  //     }
  //   );

  //   socket.on('get_value', getValue(socket, backroadSession));
  //   socket.on('request_render', requestRender(socket, backroadSession));
  //   socket.on(
  //     'set_value_if_not_exists',
  //     setValueIfNotExists(socket, backroadSession)
  //   );
  //   socket.on(
  //     'run_script',
  //     runScript(socket, backroadSession, {
  //       serverPort,
  //       scriptPath: options.scriptPath,
  //     })
  //   );
  //   socket.on(
  //     'set_value',
  //     setValueAndReRun(socket, backroadSession, {
  //       serverPort,
  //       scriptPath: options.scriptPath,
  //     })
  //   );
  //   socket.on('disconnect', () => {
  //     console.log('user disconnected', backroadSession.sessionId);
  //   });
  // });
};
