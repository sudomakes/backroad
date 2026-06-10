import type { Plugin } from '@docusaurus/types';

export default function webcontainerWebpackPlugin(): Plugin {
  return {
    name: 'webcontainer-webpack-plugin',
    configureWebpack(_config, isServer) {
      if (isServer) {
        return {
          externals: ['@webcontainer/api'],
        };
      }
      return {};
    },
  };
}
