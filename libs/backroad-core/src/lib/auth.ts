/**
 * Minimal contract Backroad uses against a better-auth instance.
 * Typed loosely so @backroad/core stays free of the better-auth
 * dependency — the server lib casts to its full type when it imports
 * better-auth at runtime.
 */
export type BackroadAuthInstance = {
  handler: (request: Request) => Promise<Response>;
  api: {
    getSession: (input: { headers: Headers }) => Promise<{
      user?: {
        id: string;
        name?: string | null;
        email?: string | null;
        image?: string | null;
      };
      session?: unknown;
    } | null>;
  };
};

/**
 * Discriminated union returned by `br.user`. Always check `isLoggedIn`
 * before accessing user properties.
 */
export type BackroadUser =
  | { isLoggedIn: false }
  | {
      isLoggedIn: true;
      id: string;
      name: string;
      email: string;
      image?: string;
      raw: unknown;
    };
