import { useEffect, useRef, useState } from 'react';
import useIsBrowser from '@docusaurus/useIsBrowser';
import BrowserOnly from '@docusaurus/BrowserOnly';

/**
 * Embeds an editable, live-running Backroad app via WebContainer API.
 * The user can tweak the `app.ts` source on the left and see Backroad's
 * rendered output on the right in a real Node runtime that runs in the browser.
 *
 * Caveats inherited from the WebContainer runtime:
 *  - No native deps: better-sqlite3 etc. won't work. Use better-auth's
 *    memory adapter if you want to demo auth.
 *  - First boot is ~5–10s (downloads + installs the dep tree).
 *  - Requires COOP/COEP headers on the hosting page.
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
      {() => (
        <WebContainerSandbox
          code={code}
          dependencies={dependencies}
          height={height}
        />
      )}
    </BrowserOnly>
  );
}

function WebContainerSandbox({ code, dependencies, height }: Props) {
  const [running, setRunning] = useState(false);
  const [status, setStatus] = useState<
    'idle' | 'booting' | 'installing' | 'starting' | 'ready' | 'error'
  >('idle');
  const [statusMessage, setStatusMessage] = useState('');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [currentCode, setCurrentCode] = useState(code);
  const [logs, setLogs] = useState<string[]>([]);
  const webcontainerRef = useRef<any>(null);
  const abortRef = useRef(false);

  const startSandbox = async () => {
    setRunning(true);
    setStatus('booting');
    setStatusMessage('Booting WebContainer...');
    setLogs([]);
    abortRef.current = false;

    try {
      // Sanity check: WebContainer needs crossOriginIsolated
      if (!window.crossOriginIsolated) {
        setStatus('error');
        setStatusMessage(
          'This page is not cross-origin isolated.\n' +
            'WebContainer requires COOP/COEP headers.'
        );
        return;
      }

      // Dynamic import so WebContainer code only ships on pages with a sandbox
      const { WebContainer } = await import('@webcontainer/api');

      if (abortRef.current) return;

      const wc = await WebContainer.boot();
      webcontainerRef.current = wc;

      if (abortRef.current) return;

      // Mount files
      setStatus('installing');
      setStatusMessage('Installing dependencies...');

      const pkg = {
        name: 'backroad-sandbox',
        type: 'module',
        scripts: { start: 'tsx app.ts' },
        dependencies: {
          '@backroad/backroad': 'latest',
          tsx: 'latest',
          ...dependencies,
        },
      };

      await wc.mount({
        'package.json': {
          file: {
            contents: JSON.stringify(pkg, null, 2),
          },
        },
        'app.ts': {
          file: {
            contents: currentCode,
          },
        },
      });

      if (abortRef.current) return;

      // Listen for server-ready
      wc.on('server-ready', (port: number, url: string) => {
        setPreviewUrl(url);
        setStatus('ready');
        setStatusMessage('Server ready');
      });

      // Stream install logs with a timeout so the UI doesn't freeze silently
      const install = await wc.spawn('npm', ['install']);
      const installLogs: string[] = [];
      install.output.pipeTo(
        new WritableStream({
          write(data: string) {
            installLogs.push(data);
            setLogs((prev) => [...prev, data]);
          },
        })
      );

      // Race npm install against a 3-minute timeout
      const installExit = await Promise.race([
        install.exit,
        new Promise<number>((_, reject) =>
          setTimeout(
            () => reject(new Error('npm install timed out after 3 minutes')),
            180_000
          )
        ),
      ]);
      if (abortRef.current) return;

      if (installExit !== 0) {
        setStatus('error');
        setStatusMessage(
          `npm install failed (exit ${installExit}).\n` +
            installLogs.slice(-10).join('')
        );
        return;
      }

      setStatus('starting');
      setStatusMessage('Starting app...');

      // Start the app
      const start = await wc.spawn('npm', ['start']);
      const startLogs: string[] = [];
      start.output.pipeTo(
        new WritableStream({
          write(data: string) {
            startLogs.push(data);
            setLogs((prev) => [...prev, data]);
          },
        })
      );
    } catch (err: any) {
      if (abortRef.current) return;
      setStatus('error');
      setStatusMessage(err?.message || 'Failed to start sandbox');
      // eslint-disable-next-line no-console
      console.error('WebContainer error:', err);
    }
  };

  const stopSandbox = () => {
    abortRef.current = true;
    if (webcontainerRef.current) {
      try {
        webcontainerRef.current.teardown?.();
      } catch {
        // ignore
      }
      webcontainerRef.current = null;
    }
    setRunning(false);
    setStatus('idle');
    setStatusMessage('');
    setPreviewUrl(null);
    setLogs([]);
  };

  useEffect(() => {
    return () => {
      stopSandbox();
    };
  }, []);

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
          onClick={startSandbox}
          className="button button--primary"
        >
          ▶ Run the example
        </button>
      </div>
    );
  }

  return (
    <div
      style={{
        height,
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--ifm-background-surface-color)',
        border: '1px solid var(--ifm-color-emphasis-300)',
        borderRadius: 6,
        overflow: 'hidden',
      }}
    >
      {/* Toolbar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0.5rem 0.75rem',
          borderBottom: '1px solid var(--ifm-color-emphasis-300)',
          fontSize: '0.85rem',
          gap: '0.5rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background:
                status === 'ready'
                  ? '#22c55e'
                  : status === 'error'
                  ? '#ef4444'
                  : '#f59e0b',
            }}
          />
          <span style={{ opacity: 0.9 }}>
            {status === 'ready'
              ? 'Running'
              : status === 'error'
              ? 'Error'
              : statusMessage}
          </span>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            type="button"
            onClick={stopSandbox}
            className="button button--sm button--secondary"
          >
            Stop
          </button>
        </div>
      </div>

      {/* Main area */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Editor */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            minWidth: 0,
          }}
        >
          <div
            style={{
              padding: '0.25rem 0.75rem',
              fontSize: '0.75rem',
              borderBottom: '1px solid var(--ifm-color-emphasis-300)',
              opacity: 0.7,
              fontFamily: 'monospace',
            }}
          >
            app.ts
          </div>
          <textarea
            value={currentCode}
            onChange={(e) => setCurrentCode(e.target.value)}
            spellCheck={false}
            style={{
              flex: 1,
              width: '100%',
              border: 'none',
              padding: '0.75rem',
              fontFamily: 'monospace',
              fontSize: '0.85rem',
              lineHeight: 1.5,
              background: 'var(--ifm-background-surface-color)',
              color: 'var(--ifm-font-color-base)',
              resize: 'none',
              outline: 'none',
            }}
          />
        </div>

        {/* Preview */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            minWidth: 0,
            borderLeft: '1px solid var(--ifm-color-emphasis-300)',
          }}
        >
          {previewUrl ? (
            <iframe
              src={previewUrl}
              title="Backroad preview"
              style={{ flex: 1, border: 'none', width: '100%', height: '100%' }}
              sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
            />
          ) : (
            <div
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
                gap: '0.75rem',
                padding: '1rem',
              }}
            >
              <div
                style={{
                  width: 24,
                  height: 24,
                  border: '2px solid var(--ifm-color-emphasis-300)',
                  borderTopColor: 'var(--ifm-color-primary)',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite',
                }}
              />
              <style>{`
                @keyframes spin {
                  to { transform: rotate(360deg); }
                }
              `}</style>
              <p style={{ margin: 0, opacity: 0.7, textAlign: 'center' }}>
                {statusMessage}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Logs panel */}
      {logs.length > 0 && (
        <div
          style={{
            height: 120,
            borderTop: '1px solid var(--ifm-color-emphasis-300)',
            overflow: 'auto',
            fontFamily: 'monospace',
            fontSize: '0.75rem',
            padding: '0.5rem 0.75rem',
            background: 'var(--ifm-background-surface-color)',
            color: 'var(--ifm-font-color-base)',
          }}
        >
          {logs.map((log, i) => (
            <div key={i} style={{ whiteSpace: 'pre-wrap', opacity: 0.85 }}>
              {log}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default BackroadSandbox;
