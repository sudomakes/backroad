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
export default function rawLoaderPlugin(): Plugin {
  return {
    name: 'raw-loader-plugin',
    configureWebpack() {
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
