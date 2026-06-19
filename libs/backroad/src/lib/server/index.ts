import express from 'express';
import formidable from 'formidable';
import * as http from 'http';
import path from 'path';
import { Namespace, Server } from 'socket.io';
// const upload = multer();
import type {
  BackroadAuthInstance,
  ClientToServerEvents,
  ServerToClientEvents,
} from '@backroad/core';
import { join } from 'path';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';
import { sessionManager } from './sessions/session-manager';

// Minimal extension → MIME map for download_button's auto-inference. Anything
// unknown falls back to application/octet-stream (a safe "just download it").
const MIME_BY_EXTENSION: Record<string, string> = {
  txt: 'text/plain',
  csv: 'text/csv',
  json: 'application/json',
  html: 'text/html',
  xml: 'application/xml',
  md: 'text/markdown',
  pdf: 'application/pdf',
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  gif: 'image/gif',
  svg: 'image/svg+xml',
  webp: 'image/webp',
  zip: 'application/zip',
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
};
const inferMimeType = (filename: string) => {
  const ext = filename.split('.').pop()?.toLowerCase() ?? '';
  return MIME_BY_EXTENSION[ext] ?? 'application/octet-stream';
};

export const startBackroadServer = (options: {
  port: number;
  auth?: { instance: BackroadAuthInstance };
}) => {
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

    // Mount better-auth handler BEFORE any body parser / static handler so
    // the raw request body reaches better-auth. Loaded lazily so users
    // without auth never need to install better-auth. The /api/auth/*
    // routes are the only auth endpoints — the React frontend
    // (libs/backroad-frontend) renders the signin / signup UI via
    // @daveyplate/better-auth-ui hitting these endpoints directly.
    if (options.auth) {
      const { toNodeHandler } =
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        require('better-auth/node') as typeof import('better-auth/node');
      app.all('/api/auth/*', toNodeHandler(options.auth.instance));
    }

    // Tiny readiness probe — handy for Docker/orchestrator health
    // checks and used by Playwright's webServer wait in CI.
    app.get('/api/health', (_req, res) => {
      res.json({ ok: true });
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

    // On-demand download for br.downloadButton. The payload lives in session
    // state (never in the component tree), so it crosses the wire only when the
    // user actually clicks — streamed here with an attachment disposition.
    app.get('/api/download/:sessionId/:id', async (req, res) => {
      const session = sessionManager.getSession(req.params.sessionId);
      const download = session?.getDownload(req.params.id);
      if (!download) {
        return res.status(404).json({ error: 'download not found' });
      }
      // Resolve the payload now — this is the first (and only) time the
      // contents are computed.
      let content: string | Uint8Array;
      try {
        content = await download.data();
      } catch (err) {
        console.error('download_button payload failed to generate', err);
        return res.status(500).json({ error: 'failed to generate download' });
      }
      const filename = download.filename ?? 'download';
      res.setHeader('Content-Type', download.mime ?? inferMimeType(filename));
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="${encodeURIComponent(filename)}"`
      );
      // express handles strings and Buffers natively; coerce a bare Uint8Array.
      return res.send(
        typeof content === 'string' || Buffer.isBuffer(content)
          ? content
          : Buffer.from(content)
      );
    });

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
