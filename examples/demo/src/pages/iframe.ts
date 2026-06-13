import { BackroadNodeManager } from '@backroad/backroad';

export const backroadIframeExample = async (br: BackroadNodeManager) => {
  br.write({ body: '## Iframe Demo' });

  br.iframe({
    title: 'Backroad docs iframe embed',
    src: 'http://localhost:3001',
    width: '100%',
    height: 400,
    loading: 'lazy',
  });

  br.write({ body: '### Sandboxed embed' });

  br.iframe({
    title: 'Sandboxed docs embed',
    src: 'http://localhost:3001',
    width: '100%',
    height: 300,
    loading: 'lazy',
    sandbox: 'allow-scripts',
  });
};
