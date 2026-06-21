import { getBasePath } from 'backroad-components';
import { createAuthClient } from 'better-auth/react';

let client: ReturnType<typeof createAuthClient> | undefined;

// Lazily build (and memoise) the better-auth client. Same-origin: the server
// mounts better-auth at ${basePath}/api/auth/* on the same port the browser is
// talking to. Resolving the base URL on first use — rather than at import —
// keeps the mount sub-path a runtime concern and avoids a side-effectful
// singleton constructed before window.__BACKROAD_BASE__ is meaningful.
export const getAuthClient = (): ReturnType<typeof createAuthClient> => {
  if (!client) {
    client = createAuthClient({
      baseURL:
        typeof window !== 'undefined'
          ? `${window.location.origin}${getBasePath()}`
          : 'http://localhost:3333',
    });
  }
  return client;
};

export type AuthSession = ReturnType<typeof getAuthClient>['$Infer']['Session'];
