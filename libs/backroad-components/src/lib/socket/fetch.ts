/**
 * A drop-in `fetch` that automatically prefixes root-relative request paths
 * with the app's mount sub-path (see {@link withBasePath}). One prebuilt bundle
 * can talk to its server from any mount point ('' at the domain root,
 * '/backroad' when embedded) without every call site remembering to wrap its
 * URL. Absolute URLs, `URL`/`Request` inputs, and already-prefixed paths are
 * passed through untouched.
 */
import { withBasePath } from './base-path';

export const backroadFetch = (
  input: RequestInfo | URL,
  init?: RequestInit
): Promise<Response> =>
  fetch(typeof input === 'string' ? withBasePath(input) : input, init);
