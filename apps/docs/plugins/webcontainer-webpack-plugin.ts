import type { Plugin } from '@docusaurus/types';

// WebContainer relies on SharedArrayBuffer, which the browser only exposes when
// the page is cross-origin isolated (`self.crossOriginIsolated === true`). That
// requires COOP `same-origin` + COEP `require-corp` on the document. Production
// gets these from `public/_headers` (honored by the Pages host), but the dev
// server (`docusaurus start`) serves nothing of the sort — so the sandbox fails
// locally with "SharedArrayBuffer transfer requires self.crossOriginIsolated".
// Setting them on the webpack dev server makes the local sandbox work too.
const crossOriginIsolationHeaders = {
  'Cross-Origin-Opener-Policy': 'same-origin',
  'Cross-Origin-Embedder-Policy': 'require-corp',
};

export default function webcontainerWebpackPlugin(): Plugin {
  return {
    name: 'webcontainer-webpack-plugin',
    configureWebpack(_config, isServer) {
      if (isServer) {
        return {
          externals: ['@webcontainer/api'],
        };
      }
      return {
        devServer: {
          headers: crossOriginIsolationHeaders,
        },
      };
    },
  };
}
