---
title: Embedding in Express / Hono
sidebar_position: 7
---

# Embedding a Backroad app

`run()` starts a standalone server that owns a whole port. Sometimes you
instead want a Backroad app to live on a **sub-route of an existing server** —
e.g. an internal dashboard at `/backroad` next to your own API. The adapters
let you mount a Backroad app as a sub-app of an Express or Hono server.

```ts
// Instead of taking a whole port…
run(executor);

// …mount under a sub-route of an app you already have:
app.use('/backroad', backroadExpress(executor, { basePath: '/backroad' }));
```

The `basePath` option must match the path you mount at. It's how the prebuilt
frontend learns where it lives: the server injects it into the served HTML at
runtime, and every URL the client builds (asset paths, the Socket.IO handshake,
`/api/*` calls, the router) is prefixed with it. One published bundle therefore
works from the domain root **or** any sub-path.

## Express

```ts
import express from 'express';
import { backroadExpress } from '@backroad/backroad';

const app = express();

app.get('/', (_req, res) => res.send('my own home page'));

app.use(
  '/backroad',
  backroadExpress(
    async (br) => {
      const n = br.button({ label: 'Click me' });
      br.write({ body: n ? 'Clicked!' : 'Not yet.' });
    },
    { basePath: '/backroad' }
  )
);

app.listen(3000);
// Backroad UI:  http://localhost:3000/backroad
// Your route:   http://localhost:3000/
```

That's the whole integration. Socket.IO **auto-attaches** to the underlying
server on the first request, so there's no extra wiring step.

## Hono

Hono speaks the Web Fetch API, so run it on `@hono/node-server` and pass the
returned server to `attach()` (see [WebSockets](#websockets-and-attach) below):

```ts
import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { backroadHono } from '@backroad/backroad';

const app = new Hono();
app.get('/', (c) => c.text('my own home page'));

const br = backroadHono(
  async (br) => {
    const n = br.button({ label: 'Click me' });
    br.write({ body: n ? 'Clicked!' : 'Not yet.' });
  },
  { basePath: '/backroad' }
);
app.route('/backroad', br);

const server = serve({ fetch: app.fetch, port: 3000 });
br.attach(server); // bind Socket.IO to the Node server
```

Install the optional peer deps for the Hono adapter:

```bash
pnpm add hono @hono/node-server
```

## WebSockets and `attach`

Backroad uses Socket.IO, which binds at the **HTTP server** level — below the
request/response middleware that `app.use()` deals with. There are two ways to
give it the server:

- **Auto-attach (default).** The handler grabs the server off the first HTTP
  request it sees and attaches Socket.IO then. The browser always loads the
  page before it opens the websocket, so this is in place in time. This is the
  one-liner shown in the Express example — nothing else to do.

- **Explicit `attach(server)`.** Both adapters also expose `.attach(server)` for
  when the auto-attach can't reach the server — Hono on `@hono/node-server`, or
  any setup behind a proxy that hides the underlying server:

  ```ts
  const br = backroadExpress(executor, { basePath: '/backroad' });
  app.use('/backroad', br);
  const server = app.listen(3000);
  br.attach(server); // explicit — safe to also call; the first wins
  ```

  Calling `attach()` after auto-attach has already run is a harmless no-op.

## Multiple apps in one process

Each mounted app gets its own sessions and sockets, so you can run several side
by side. Give each a distinct `basePath`:

```ts
app.use('/admin', backroadExpress(adminApp, { basePath: '/admin' }));
app.use('/reports', backroadExpress(reportsApp, { basePath: '/reports' }));
```

State set in one never leaks into the other.

## Auth under a sub-path

If you enable [auth](./auth.md) on an embedded app, point better-auth's
`baseURL` at the mounted path so its callback URLs match where the handler
actually lives, e.g. `https://yourhost/backroad`. The Backroad frontend already
prefixes the mount path onto its `/api/auth/*` calls.

## Still want a standalone server?

`run()` is unchanged — it's exactly this machinery with `basePath: ''` on a
server it creates for you. Reach for the adapters only when you need to embed
into an existing app.
