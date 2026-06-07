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

const SIGNIN_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>Sign in</title>
<style>
  body { font-family: system-ui, sans-serif; max-width: 360px; margin: 4rem auto; padding: 0 1rem; }
  h1 { font-size: 1.25rem; margin-bottom: 1rem; }
  label { display: block; font-size: 0.875rem; margin-top: 0.75rem; }
  input { width: 100%; padding: 0.5rem; margin-top: 0.25rem; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box; }
  button { margin-top: 1rem; padding: 0.5rem 1rem; cursor: pointer; border: 0; border-radius: 4px; background: #2563eb; color: #fff; }
  button.secondary { background: transparent; color: #2563eb; padding-left: 0; }
  #status { margin-top: 1rem; font-size: 0.875rem; color: #b91c1c; }
</style>
</head>
<body>
<h1 id="title">Sign in</h1>
<form id="form">
  <label data-name>Name<input name="name" autocomplete="name" /></label>
  <label>Email<input name="email" type="email" autocomplete="email" required /></label>
  <label>Password<input name="password" type="password" autocomplete="current-password" minlength="8" required /></label>
  <button id="submit" type="submit">Sign in</button>
  <button id="toggle" type="button" class="secondary">Need an account? Sign up</button>
</form>
<div id="status" role="alert"></div>
<script>
  let mode = 'signin';
  const nameLabel = document.querySelector('[data-name]');
  const titleEl = document.getElementById('title');
  const submitBtn = document.getElementById('submit');
  const toggleBtn = document.getElementById('toggle');
  const statusEl = document.getElementById('status');
  const passwordInput = document.querySelector('input[name="password"]');
  const applyMode = () => {
    if (mode === 'signup') {
      titleEl.textContent = 'Create account';
      submitBtn.textContent = 'Sign up';
      toggleBtn.textContent = 'Have an account? Sign in';
      nameLabel.style.display = '';
      passwordInput.autocomplete = 'new-password';
    } else {
      titleEl.textContent = 'Sign in';
      submitBtn.textContent = 'Sign in';
      toggleBtn.textContent = 'Need an account? Sign up';
      nameLabel.style.display = 'none';
      passwordInput.autocomplete = 'current-password';
    }
  };
  applyMode();
  toggleBtn.addEventListener('click', () => {
    mode = mode === 'signin' ? 'signup' : 'signin';
    statusEl.textContent = '';
    applyMode();
  });
  document.getElementById('form').addEventListener('submit', async (e) => {
    e.preventDefault();
    statusEl.textContent = '';
    submitBtn.disabled = true;
    const data = new FormData(e.target);
    const payload = {
      email: data.get('email'),
      password: data.get('password'),
    };
    if (mode === 'signup') {
      payload.name = data.get('name') || data.get('email');
    }
    const url = mode === 'signup' ? '/api/auth/sign-up/email' : '/api/auth/sign-in/email';
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        window.location.assign('/');
        return;
      }
      const body = await res.json().catch(() => ({}));
      statusEl.textContent = body?.message || ('Request failed (' + res.status + ')');
    } catch (err) {
      statusEl.textContent = String(err);
    } finally {
      submitBtn.disabled = false;
    }
  });
</script>
</body>
</html>`;

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
    // without auth never need to install better-auth.
    if (options.auth) {
      const authInstance = options.auth.instance;
      const { toNodeHandler } =
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        require('better-auth/node') as typeof import('better-auth/node');
      app.all('/api/auth/*', toNodeHandler(authInstance));

      // Built-in email/password signin page. Backroad-served because devs
      // shouldn't have to write HTML for the default flow. Lives under /api/
      // so vite's dev proxy forwards it to the backend.
      app.get('/api/signin', (_req, res) => {
        res.type('html').send(SIGNIN_HTML);
      });

      // GET /api/signout — invokes better-auth's POST sign-out for browsers
      // that navigated via window.location, then redirects home. signOut
      // isn't on the minimal BackroadAuthInstance contract so we cast.
      app.get('/api/signout', async (req, res) => {
        try {
          const { fromNodeHeaders } =
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            require('better-auth/node') as typeof import('better-auth/node');
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const result = await (authInstance.api as any).signOut({
            headers: fromNodeHeaders(req.headers),
            asResponse: true,
          });
          if (result instanceof Response) {
            result.headers.forEach((v, k) => res.append(k, v));
          }
        } catch (err) {
          console.error('Sign-out failed', err);
        }
        res.redirect('/');
      });
    }

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
