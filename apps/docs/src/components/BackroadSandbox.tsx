import { useState } from 'react';
import useIsBrowser from '@docusaurus/useIsBrowser';
import BrowserOnly from '@docusaurus/BrowserOnly';

/**
 * Embeds an editable, live-running Backroad app via Sandpack 2's node
 * template (browser-side Node runtime). The user can tweak the
 * `app.ts` source on the left and see Backroad's rendered output on
 * the right.
 *
 * Caveats inherited from the WebContainer-class runtime:
 *  - No native deps: better-sqlite3 etc. won't work. Use better-auth's
 *    memory adapter if you want to demo auth.
 *  - First boot is ~5–10s (downloads + installs the dep tree).
 *  - Big bundle: this component dynamic-imports @codesandbox/sandpack-react
 *    so the docs site doesn't pay for it unless a page actually uses it.
 */
type Props = {
  /** The contents of the user's `app.ts` (the Backroad script). */
  code: string;
  /** Extra runtime deps beyond `@backroad/backroad`. */
  dependencies?: Record<string, string>;
  /** Height of the sandbox iframe. */
  height?: number | string;
};

export function BackroadSandbox({
  code,
  dependencies = {},
  height = 480,
}: Props) {
  const isBrowser = useIsBrowser();
  if (!isBrowser) return null;

  return (
    <BrowserOnly fallback={<div style={{ height, background: '#1e1e1e' }} />}>
      {() => {
        // Lazy require so the ~MB of sandpack code only ships on pages
        // that embed a sandbox.
        /* eslint-disable @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires */
        const {
          SandpackProvider,
          SandpackLayout,
          SandpackCodeEditor,
          SandpackPreview,
        } = require('@codesandbox/sandpack-react');
        /* eslint-enable @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires */

        return (
          <SandpackOuter
            SandpackProvider={SandpackProvider}
            SandpackLayout={SandpackLayout}
            SandpackCodeEditor={SandpackCodeEditor}
            SandpackPreview={SandpackPreview}
            code={code}
            dependencies={dependencies}
            height={height}
          />
        );
      }}
    </BrowserOnly>
  );
}

function SandpackOuter({
  SandpackProvider,
  SandpackLayout,
  SandpackCodeEditor,
  SandpackPreview,
  code,
  dependencies,
  height,
}: {
  SandpackProvider: React.ComponentType<Record<string, unknown>>;
  SandpackLayout: React.ComponentType<{ children: React.ReactNode }>;
  SandpackCodeEditor: React.ComponentType<Record<string, unknown>>;
  SandpackPreview: React.ComponentType<Record<string, unknown>>;
  code: string;
  dependencies: Record<string, string>;
  height: number | string;
}) {
  const [running, setRunning] = useState(false);

  if (!running) {
    return (
      <div
        style={{
          height,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: '1rem',
          background: 'var(--ifm-background-surface-color)',
          border: '1px solid var(--ifm-color-emphasis-300)',
          borderRadius: 6,
          padding: '2rem',
        }}
      >
        <p style={{ margin: 0, textAlign: 'center', maxWidth: 380 }}>
          Live sandbox — boots a real Node runtime in your browser. First start
          takes ~10s while the deps install.
        </p>
        <button
          type="button"
          onClick={() => setRunning(true)}
          className="button button--primary"
        >
          ▶ Run the example
        </button>
      </div>
    );
  }

  return (
    <SandpackProvider
      template="node"
      files={{
        '/app.ts': code,
        '/package.json': JSON.stringify(
          {
            name: 'backroad-sandbox',
            type: 'module',
            scripts: { start: 'tsx app.ts' },
            dependencies: {
              '@backroad/backroad': 'latest',
              tsx: 'latest',
              ...dependencies,
            },
          },
          null,
          2
        ),
      }}
      options={{ visibleFiles: ['/app.ts'], activeFile: '/app.ts' }}
      customSetup={{ entry: '/app.ts' }}
    >
      <SandpackLayout>
        <SandpackCodeEditor showLineNumbers style={{ height }} />
        <SandpackPreview style={{ height }} showOpenInCodeSandbox={false} />
      </SandpackLayout>
    </SandpackProvider>
  );
}

export default BackroadSandbox;
