import { createAuthClient } from 'better-auth/react';

// Same-origin client: the server mounts better-auth at /api/auth/* on the
// same port the browser is talking to. better-auth-ui calls into this
// client to perform sign-in / sign-up / session reads, etc.
export const authClient = createAuthClient({
  baseURL:
    typeof window !== 'undefined'
      ? window.location.origin
      : 'http://localhost:3333',
});

export type AuthSession = typeof authClient.$Infer.Session;
