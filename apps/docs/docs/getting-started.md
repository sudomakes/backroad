---
title: Getting started
sidebar_position: 2
---

# Getting started

## Install

```bash
npm install @backroad/backroad
# or
pnpm add @backroad/backroad
```

`@backroad/backroad` carries the server runtime and the pre-built React
client. If you only need the shared types (for a custom frontend, or to
share an event type with another service), install `@backroad/core` instead.

## Your first app

Create `app.ts`:

```ts
import { run } from '@backroad/backroad';

run((br) => {
  br.write({ body: '# Hello, Backroad' });

  const name = br.textInput({ label: 'Your name', defaultValue: 'world' });

  if (name) {
    br.write({ body: `Hello, **${name}**!` });
  }
});
```

Run it:

```bash
npx tsx app.ts
```

Open [http://localhost:3333](http://localhost:3333). The page renders the markdown, the input, and
re-runs the script as you type — your latest value goes back into the
`textInput()` call, the script outputs the new tree, the React client
paints it.

## Configuration

`run()` takes a second argument:

```ts
run(
  (br) => {
    // …
  },
  {
    server: { port: 4000 },
    theme: 'dark',
    analytics: { google: 'G-XXXXXXX' },
    // Auth is optional — see the Authentication section.
    // auth: { instance: betterAuth(...) },
  }
);
```

| Option             | Default   | What it does                                                                 |
| ------------------ | --------- | ---------------------------------------------------------------------------- |
| `server.port`      | `3333`    | Port for Express + Socket.IO                                                 |
| `theme`            | `'light'` | Initial daisyUI theme — `light` or `dark`. User can override via the navbar. |
| `analytics.google` | none      | Google Analytics 4 measurement ID                                            |
| `auth.instance`    | none      | A `better-auth` instance. See [Authentication](./auth).                      |

## Where to go from here

- [Containers](./fundamentals/containers) — pages, columns, tabs
- [Components](./fundamentals/components) — full reference
- [Authentication](./auth) — guard your app with email/password or OAuth
- [Hosting](./hosting) — Docker + self-host recipe
