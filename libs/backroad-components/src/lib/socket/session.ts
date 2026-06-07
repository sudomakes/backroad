/** Owns the per-tab session identifier used to namespace the socket connection. */
export const sessionId: string = sessionStorage.tabID
  ? sessionStorage.tabID
  : (sessionStorage.tabID = `${crypto.randomUUID()}`);
