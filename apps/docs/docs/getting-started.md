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

The executor receives a second argument with run-time context:

```ts
run((br, { currentPath }) => {
  // currentPath is the URL pathname that triggered this run, e.g. '/settings'
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
    appearance: { theme: 'claude', mode: 'light' },
    analytics: { google: 'G-XXXXXXX' },
    // Auth is optional — see the Authentication section.
    // auth: { instance: betterAuth(...) },
  }
);
```

| Option             | Default     | What it does                                                                                                             |
| ------------------ | ----------- | ------------------------------------------------------------------------------------------------------------------------ |
| `server.port`      | `3333`      | Port for Express + Socket.IO                                                                                             |
| `appearance.theme` | `'default'` | Recommended palette — `default`, `claude`, `twitter`, `supabase`, `amethyst-haze`. See [Themes](./configuration/themes). |
| `appearance.mode`  | `'system'`  | Recommended mode — `light`, `dark`, or `system`. User's choice wins.                                                     |
| `analytics.google` | none        | Google Analytics 4 measurement ID. See [Analytics](./configuration/analytics).                                           |
| `auth.instance`    | none        | A `better-auth` instance. See [Authentication](./auth).                                                                  |

## Where to go from here

- [Containers](./fundamentals/containers) — pages, columns, tabs
- [Components](./fundamentals/components) — full reference
- [Authentication](./auth) — guard your app with email/password or OAuth
- [Hosting](./hosting) — Docker + self-host recipe
