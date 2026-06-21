// Lazily require an optional peer dependency, throwing a friendly install hint
// when it is missing. Shared across the framework adapters (express, hono, …) so
// apps that only use run() never need the adapter-specific peers installed.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const lazyRequire = (name: string, hint?: string): any => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    return require(name);
  } catch {
    throw new Error(hint ?? `This adapter requires "${name}". Install it.`);
  }
};
