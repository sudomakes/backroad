// Lazily require an optional peer dependency, throwing a friendly install hint
// when it is missing. Shared across the framework adapters (express, hono, …) so
// apps that only use run() never need the adapter-specific peers installed.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const lazyRequire = (name: string, hint?: string): any => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    return require(name);
  } catch (err) {
    // Only swallow a genuine "module is not installed" error. Anything else
    // (e.g. a syntax/runtime error thrown while loading an installed module)
    // must propagate untouched so it is not misreported as a missing peer dep.
    if (
      err &&
      typeof err === 'object' &&
      (err as { code?: string }).code === 'MODULE_NOT_FOUND'
    ) {
      throw new Error(hint ?? `This adapter requires "${name}". Install it.`);
    }
    throw err;
  }
};
