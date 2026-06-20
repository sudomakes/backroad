import type { Plugin } from '@docusaurus/types';

// Lets MDX/TSX import a file's verbatim text with a `?raw` query, e.g.
//   import code from '@site/src/examples/try-it.ts?raw';
// We use this for the live `<BackroadSandbox code={...} />` samples: each
// example lives in a real `.ts` file (formatted by Prettier on commit, just
// like any other source) instead of an unindented template literal inlined in
// the MDX. webpack 5's built-in `asset/source` type returns the raw contents
// as a string, so no extra loader dependency is needed. The rule has to apply
// to both the client and server (prerender) bundles, since the MDX import is
// resolved in both.
//
// The catch: our example files are `.ts`, so Docusaurus's own `/\.[jt]sx?$/`
// babel-loader rule ALSO matches them. webpack runs loaders first and only then
// applies the module `type`, so without intervention babel would transpile (and
// in production minify) the source, and `asset/source` would capture that
// mangled JS — `import { run } from '...'` arrives in the editor as
// `import{run}from'...'`. We therefore exclude `?raw` resources from the
// JS/TS rule so only `asset/source` handles them, yielding the file verbatim.
export default function rawLoaderPlugin(): Plugin {
  return {
    name: 'raw-loader-plugin',
    configureWebpack(config) {
      // Stop the JS/TS loader (babel) from also matching our `?raw` imports;
      // otherwise it transpiles the file before `asset/source` reads it.
      for (const rule of config.module?.rules ?? []) {
        if (
          rule &&
          typeof rule === 'object' &&
          'test' in rule &&
          rule.test instanceof RegExp &&
          rule.test.test('example.ts')
        ) {
          rule.resourceQuery = { not: [/raw/] };
        }
      }
      return {
        module: {
          rules: [
            {
              resourceQuery: /raw/,
              type: 'asset/source',
            },
          ],
        },
      };
    },
  };
}
