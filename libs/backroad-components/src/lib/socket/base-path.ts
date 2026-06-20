/**
 * The sub-path this Backroad app is mounted under, e.g. '/backroad' — or '' at
 * the domain root. The server injects `window.__BACKROAD_BASE__` into the served
 * index.html (see buildBackroadHandler), and these helpers read it at call time
 * so nothing has to import a baked-in constant.
 */
const readBasePath = (): string =>
  (typeof window !== 'undefined' &&
    (window as { __BACKROAD_BASE__?: string }).__BACKROAD_BASE__) ||
  '';

/** The mount sub-path ('' at the domain root). Resolved from the runtime. */
export const getBasePath = (): string => readBasePath();

/**
 * Prefix a root-relative path with the mount sub-path, so one prebuilt bundle's
 * URLs work from any mount point. Absolute URLs, non-root-relative paths, and
 * already-prefixed paths are returned unchanged.
 */
export const withBasePath = (path: string): string => {
  const base = readBasePath();
  if (!base || !path.startsWith('/')) return path;
  if (
    path === base ||
    path.startsWith(`${base}/`) ||
    path.startsWith(`${base}?`) ||
    path.startsWith(`${base}#`)
  ) {
    return path;
  }
  return `${base}${path}`;
};
