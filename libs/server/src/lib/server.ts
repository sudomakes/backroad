/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import * as childProcess from 'child_process';
import express from 'express';
import superjson from 'superjson';
// import { readFileSync } from 'fs';
import * as http from 'http';
import * as path from 'path';
import { Server } from 'socket.io';
import { sessionManager } from './sessions/session-manager';
import { BackroadSession } from './sessions/session';
import { handleInit } from './server-socket-event-handlers/init';
import { setValue } from './server-socket-event-handlers/set_value';
import { requestRender } from './server-socket-event-handlers/request-render';

// server.listen(port, () => {
//   console.log(`Listening at http://localhost:${port}/api`);
// });

let debugConnectionCount = 0;
export const startBackroadServer = (options: {
  port?: number;
  scriptPath: string;
}) => {
  const serverPort = options.port || 3333;
  const app = express();
  const server = http.createServer(app);
  const io = new Server(server, { path: '/api/socket.io' });
  app.use('/assets', express.static(path.join(__dirname, 'assets')));
  app.get('/api/:sessionId/:key', (req, res) => {
    const { sessionId, key } = req.params;
    const session = sessionManager.getSession(sessionId);
    if (session) {
      const value = session.valueOf(key);
      res.send({ data: superjson.stringify(value) });
    } else {
      res.status(400).send({ message: 'Session not found' });
    }
  });

  app.get('/api', (req, res) => {
    res.send({ message: 'Welcome to server!' });
  });

  io.on('connection', (socket) => {
    const backroadSession = new BackroadSession(socket);
    debugConnectionCount += 1;
    console.log('a user connected', debugConnectionCount, socket.id);
    const myDebugId = debugConnectionCount;
    socket.join(backroadSession.id);
    socket.on('set_value', setValue(socket));
    socket.on('init', handleInit(socket));
    socket.on('request-render', requestRender);
    socket.on('run_script', () => {
      console.log(
        'running script',
        options.scriptPath,
        'connectionCount',
        myDebugId
      );
      const scriptProcess = childProcess.spawn(
        `BACKROAD_SESSION=${backroadSession.id} BACKROAD_SERVER_PORT=${serverPort} npx -y tsx ${options.scriptPath}`,
        {
          shell: true,
          cwd: path.dirname(options.scriptPath),
        }
      );
      // const output = eval(ts.transpile(readFileSync(scriptPath).toString()))
      // console.log("here goes your output",output)
      scriptProcess.stdout.on('data', (data) => {
        console.log(`stdout (${myDebugId}): ${data}`);
        socket.emit('data', data.toString());
      });
      scriptProcess.stderr.on('data', (data) => {
        console.log(`stderr: ${data}`);
        // socket.emit('data', data.toString());
      });

      scriptProcess.on('error', (err) => {
        console.log('error', err);
      });
      scriptProcess.on('message', (message) => {
        console.log('message', message);
      });
      scriptProcess.on('exit', function (code, signal) {
        console.log(
          'child process exited with ' + `code ${code} and signal ${signal}`
        );
      });
    });
  });
  server.listen(serverPort);
};
