import express from 'express';
import * as http from 'http';
import { Server } from 'socket.io';
import { getValue } from './server-socket-event-handlers/get_value';
import { requestRender } from './server-socket-event-handlers/request_render';
import { runScript } from './server-socket-event-handlers/run_script';
import { setValueAndReRun } from './server-socket-event-handlers/set_value';
import { setValueIfNotExists } from './server-socket-event-handlers/set_value_if_not_exists';
import { sessionManager } from './sessions/session-manager';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { ClientToServerEvents, ServerToClientEvents } from 'backroad-core';

export const startBackroadServer = (options: {
  port?: number;
  scriptPath: string;
}) => {
  const serverPort = options.port || 3333;
  const app = express();
  const server = http.createServer(app);
  const io = new Server<ClientToServerEvents, ServerToClientEvents>(server, {
    path: '/api/socket.io',
    cors: {},
  });

  io.of(/^\/.+$/).on('connection', (socket) => {
    console.log('connected to namespace', socket.nsp.name);
    const backroadSession = sessionManager.getSession(
      socket.nsp.name.slice(1),
      {
        upsert: true,
      }
    );

    socket.on('get_value', getValue(socket, backroadSession));
    socket.on('request_render', requestRender(socket, backroadSession));
    socket.on(
      'set_value_if_not_exists',
      setValueIfNotExists(socket, backroadSession)
    );
    socket.on(
      'run_script',
      runScript(socket, backroadSession, {
        serverPort,
        scriptPath: options.scriptPath,
      })
    );
    socket.on(
      'set_value',
      setValueAndReRun(socket, backroadSession, {
        serverPort,
        scriptPath: options.scriptPath,
      })
    );
    socket.on('disconnect', () => {
      console.log('user disconnected', backroadSession.sessionId);
    });
  });
  server.listen(serverPort);
};
