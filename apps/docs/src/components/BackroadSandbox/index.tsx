import type { CSSProperties } from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';
import useIsBrowser from '@docusaurus/useIsBrowser';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { oneDark } from '@codemirror/theme-one-dark';
// wterm renders the raw install/build stream like a real TTY — it interprets
// carriage returns and CSI escape codes (e.g. `\x1b[1G`, `\x1b[0K`) so npm's
// progress spinner animates in place instead of spilling one line per frame.
// CSS is safe to import at module scope (extracted by webpack, no DOM side
// effects); the WTerm class itself is imported dynamically (in useSandbox) to
// keep WASM off the SSR path.
import '@wterm/dom/css';
import { useSandbox, type SandboxStatus } from './useSandbox';

/**
 * Embeds an editable, live-running Backroad app via the WebContainer API. Tweak
 * the `app.ts` source on the left, see Backroad's rendered output on the right,
 * with install/build logs in a terminal strip below — all in a real Node
 * runtime running in the browser.
 *
 * Caveats inherited from the WebContainer runtime:
 *  - No native deps: better-sqlite3 etc. won't work. Use better-auth's memory
 *    adapter if you want to demo auth.
 *  - First boot is ~30–60s (downloads + installs the dep tree). Downloaded
 *    packages are persisted to a shared npm store (IndexedDB) and reused across
 *    every sandbox on the site, so later installs run offline — see ./idbStore.
 *  - Requires COOP/COEP headers on the hosting page.
 */
type Props = {
  /** The contents of the user's `app.ts` (the Backroad script). */
  code: string;
  /** Extra runtime deps beyond `@backroad/backroad`. */
  dependencies?: Record<string, string>;
  /** Height of the sandbox. */
  height?: number | string;
};

const BORDER = '1px solid var(--ifm-color-emphasis-300)';
const SURFACE = 'var(--ifm-background-surface-color)';
const SPINNER_KEYFRAMES =
  '@keyframes br-sandbox-spin { to { transform: rotate(360deg); } }';

const styles = {
  shell: {
    display: 'flex',
    flexDirection: 'column',
    background: SURFACE,
    border: BORDER,
    borderRadius: 6,
    overflow: 'hidden',
  },
  idle: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    gap: '1rem',
    background: SURFACE,
    border: BORDER,
    borderRadius: 6,
    padding: '2rem',
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0.5rem 0.75rem',
    borderBottom: BORDER,
    fontSize: '0.85rem',
    gap: '0.5rem',
  },
  toolbarStatus: { display: 'flex', alignItems: 'center', gap: '0.5rem' },
  statusDot: { width: 8, height: 8, borderRadius: '50%' },
  main: { display: 'flex', flex: 1, overflow: 'hidden' },
  pane: { flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 },
  editorLabel: {
    padding: '0.25rem 0.75rem',
    fontSize: '0.75rem',
    borderBottom: BORDER,
    opacity: 0.7,
    fontFamily: 'monospace',
  },
  previewPane: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    minWidth: 0,
    borderLeft: BORDER,
  },
  iframe: { flex: 1, border: 'none', width: '100%', height: '100%' },
  previewPlaceholder: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    gap: '0.75rem',
    padding: '1rem',
  },
  spinner: {
    width: 24,
    height: 24,
    border: BORDER,
    borderTopColor: 'var(--ifm-color-primary)',
    borderRadius: '50%',
    animation: 'br-sandbox-spin 1s linear infinite',
  },
  // wterm adds its `.wterm` class (and its dark VS Code theme) to this element,
  // so we set layout only: an inline `background`/`padding` would override
  // wterm's theme and leave light-gray text on a white panel. We flatten its
  // default border-radius/shadow so it sits flush as a strip.
  console: {
    height: 140,
    borderTop: BORDER,
    borderRadius: 0,
    boxShadow: 'none',
  },
} satisfies Record<string, CSSProperties>;

function statusDotColor(status: SandboxStatus): string {
  if (status === 'ready') return '#22c55e';
  if (status === 'error') return '#ef4444';
  return '#f59e0b';
}

function statusLabel(status: SandboxStatus, message: string): string {
  if (status === 'ready') return 'Running';
  if (status === 'error') return 'Error';
  return message;
}

function PreviewPane({
  previewUrl,
  statusMessage,
}: {
  previewUrl: string | null;
  statusMessage: string;
}) {
  return (
    <div style={styles.previewPane}>
      {previewUrl ? (
        <iframe
          src={previewUrl}
          title="Backroad preview"
          style={styles.iframe}
          sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
        />
      ) : (
        <div style={styles.previewPlaceholder}>
          <div style={styles.spinner} />
          <style>{SPINNER_KEYFRAMES}</style>
          <p style={{ margin: 0, opacity: 0.7, textAlign: 'center' }}>
            {statusMessage}
          </p>
        </div>
      )}
    </div>
  );
}

function Sandbox({ code, dependencies = {}, height = 480 }: Props) {
  const {
    running,
    status,
    statusMessage,
    previewUrl,
    currentCode,
    setCurrentCode,
    termElRef,
    start,
    stop,
  } = useSandbox({ code, dependencies });

  if (!running) {
    return (
      <div style={{ ...styles.idle, height }}>
        <p style={{ margin: 0, textAlign: 'center', maxWidth: 380 }}>
          Live sandbox — boots a real Node runtime in your browser. First start
          takes ~10s while the deps install.
        </p>
        <button
          type="button"
          onClick={start}
          className="button button--primary"
        >
          ▶ Run the example
        </button>
      </div>
    );
  }

  return (
    <div style={{ ...styles.shell, height }}>
      <div style={styles.toolbar}>
        <div style={styles.toolbarStatus}>
          <span
            style={{ ...styles.statusDot, background: statusDotColor(status) }}
          />
          <span style={{ opacity: 0.9 }}>
            {statusLabel(status, statusMessage)}
          </span>
        </div>
        <button
          type="button"
          onClick={stop}
          className="button button--sm button--secondary"
        >
          Stop
        </button>
      </div>

      <div style={styles.main}>
        <div style={styles.pane}>
          <div style={styles.editorLabel}>app.ts</div>
          <CodeMirror
            value={currentCode}
            onChange={setCurrentCode}
            extensions={[javascript({ typescript: true })]}
            theme={oneDark}
            basicSetup={{
              lineNumbers: true,
              indentOnInput: true,
              bracketMatching: true,
              foldGutter: false,
              highlightActiveLine: true,
            }}
            style={{ flex: 1, fontSize: '0.85rem' }}
          />
        </div>

        <PreviewPane previewUrl={previewUrl} statusMessage={statusMessage} />
      </div>

      {/* Console — wterm interprets the raw TTY stream so the npm spinner
          animates in place instead of spamming a line per frame. */}
      <div ref={termElRef} style={styles.console} />
    </div>
  );
}

export function BackroadSandbox(props: Props) {
  // The whole runtime is browser-only (WebContainer + WASM); render nothing
  // until we're in the browser to keep it off the SSR/prerender path.
  const isBrowser = useIsBrowser();
  if (!isBrowser) return null;
  return (
    <BrowserOnly
      fallback={
        <div style={{ height: props.height ?? 480, background: '#1e1e1e' }} />
      }
    >
      {() => <Sandbox {...props} />}
    </BrowserOnly>
  );
}

export default BackroadSandbox;
