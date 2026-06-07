---
title: Authentication
sidebar_position: 5
---

# Authentication

Backroad ships an optional auth wrapper around
[better-auth](https://www.better-auth.com/). Pass a configured better-auth
instance to `run(...)` and you get:

- A typed `br.user` field on every script execution that tells you whether
  the connection is logged in.
- `br.login()` / `br.logout()` helpers that drive the browser to the auth
  pages.
- A pre-built React sign-in / sign-up UI mounted at `/auth/signin` and
  `/auth/signup`, themed alongside the rest of the app.

## Install

The auth pieces are an **optional peer dependency** so consumers who don't
need them pay nothing.

```bash
pnpm add better-auth
# Whatever DB adapter you want — better-sqlite3 for local dev, the
# postgres/mysql/etc. adapter for prod. Memory works in tests.
pnpm add better-sqlite3
```

## Wire it up

```ts
import { run } from '@backroad/backroad';
import { betterAuth } from 'better-auth';
import Database from 'better-sqlite3';

const auth = betterAuth({
  database: new Database('./auth.sqlite'),
  secret: process.env.BETTER_AUTH_SECRET!,
  baseURL: process.env.BETTER_AUTH_URL ?? 'http://localhost:3333',
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
  },
  // Add socialProviders / passkeys / 2FA per better-auth docs.
});

run(
  (br) => {
    if (!br.user.isLoggedIn) {
      br.write({ body: '## Please log in to continue' });
      const click = br.button({ label: 'Log in' });
      if (click) br.login();
      return;
    }

    br.write({ body: `Hello, **${br.user.name}** 👋` });
    if (br.button({ label: 'Log out' })) {
      br.logout();
      return;
    }

    // …rest of the gated app
  },
  { auth: { instance: auth } }
);
```

That's it. Visiting `/` shows the gate; clicking **Log in** redirects to
`/auth/signin` (the React UI from `@daveyplate/better-auth-ui`); after a
successful sign-up or sign-in the browser hard-reloads back to `/` and
`br.user.isLoggedIn` is now `true`.

## What lives where

| URL                     | Renders                                                |
| ----------------------- | ------------------------------------------------------ |
| `/auth/signin`          | Email + password sign-in form                          |
| `/auth/signup`          | Sign-up form (name + email + password)                 |
| `/auth/forgot-password` | Password reset request                                 |
| `/api/auth/*`           | better-auth's REST endpoints — used by the React forms |

## `br.user` shape

```ts
type BackroadUser =
  | { isLoggedIn: false }
  | {
      isLoggedIn: true;
      id: string;
      name: string;
      email: string;
      image?: string;
      raw: unknown; // the full better-auth session record
    };
```

Always check `isLoggedIn` before reading the user fields — TypeScript will
make you.

## Logging out

```ts
br.logout();
```

This emits an `auth_signout` event over the socket. The React client posts
to `/api/auth/sign-out` (clears the cookie) and navigates to `/auth/signin`.

## Session lifecycle — what the framework actually does

1. Browser sends an HTTP upgrade request to open the WebSocket. The cookie
   travels in the headers.
2. On connection open, Backroad calls
   `auth.api.getSession({ headers: fromNodeHeaders(req.headers) })` **once**
   and caches the result on the session object.
3. Every subsequent script execution on that connection reads `br.user` from
   the cache.
4. Logging out destroys the cookie and forces a page reload — a fresh
   WebSocket opens, gets re-resolved against the now-cleared cookie, and
   sees `isLoggedIn: false`.

The single per-connection resolution is a v1 simplification. If a user
signs out in another tab, this connection keeps its cached user until it
reconnects.

## Adding social providers

better-auth's social providers work transparently — register them on the
instance and call `br.login('google')` to deep-link to the OAuth flow:

```ts
const auth = betterAuth({
  // … database, secret, baseURL
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },
});

// In your run() callback:
if (br.button({ label: 'Sign in with Google' })) {
  br.login('google');
}
```

The button in the `/auth/signin` UI is wired automatically based on the
providers you registered.

## When _not_ to use it

- For a single-user internal tool behind your VPN or Cloudflare Access,
  skip the in-app auth and let your network layer gate access.
- For multi-tenant SaaS with per-org RBAC, your app probably needs more
  than Backroad's session resolution — use better-auth directly and roll
  your own RBAC layer; `br.user.raw` exposes the full session record.
