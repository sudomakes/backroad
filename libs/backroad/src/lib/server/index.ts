import express from 'express';
import formidable from 'formidable';
import * as http from 'http';
import path from 'path';
import { Namespace, Server } from 'socket.io';
// const upload = multer();
import type {
  ClientToServerEvents,
  ServerToClientEvents,
} from '@backroad/core';
import { join } from 'path';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';
import { sessionManager } from './sessions/session-manager';
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

    app.use(express.static(join(__dirname, 'public')));

    app.post('/api/uploads', (req, res) => {
      const form = formidable({});

      form.parse<'sessionId' | 'id', 'files'>(req, (err, fields, files) => {
        // if (err) {
        //   next(err);
        //   return;
        // }
        const sessionId = fields.sessionId?.[0];
        const id = fields.id?.[0];
        if (sessionId && id) {
          // const file = files.files?.[0]
          const session = sessionManager.getSession(sessionId);
          const value = files.files || [];
          session?.setValue(id, value);
          return res.json(value);
        }
      });
    });
    // app.post<
    //   '/api/uploads',
    //   any,
    //   any,
    //   {
    //     sessionId: string;
    //     id: string;
    //   }
    // >('/api/uploads', upload.array('files'), (req, res) => {
    //   const session = sessionManager.getSession(req.body.sessionId);
    //   console.log('received file upload request', req.files, req.files?.length);
    //   return res.json(
    //     session?.uploadManager.setFiles(
    //       req.body.id,
    //       req.files as Express.Multer.File[]
    //     )
    //   );
    // });

    app.get('*', (req, res) =>
      res.sendFile(path.resolve(__dirname, 'public', 'index.html'))
    );

    server.listen(options.port, () => {
      console.log(
        `Server started and can be accessed on http://localhost:${options.port}/`
      );
      if (process.env.BACKROAD_ENV === 'dev') {
        console.log(
          'Backroad is running in development mode. Frontend will be running on a separate address: http://localhost:4200/'
        );
      }

      resolve(io.of(/^\/.+$/));
    });
  });
};
