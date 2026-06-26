import { useCallback, useEffect, useRef, useState } from 'react';
import type {
  SpawnOptions,
  WebContainer,
  WebContainerProcess,
} from '@webcontainer/api';
import type { WTerm } from '@wterm/dom';
import { loadBlob, saveBlob } from './idbStore';

export type SandboxStatus =
  | 'idle'
  | 'booting'
  | 'installing'
  | 'starting'
  | 'ready'
  | 'error';

/** Deps every sandbox needs, on top of any the page passes in. */
const FIXED_DEPS: Record<string, string> = {
  '@backroad/backroad': '1.20.1',
  tsx: '4.22.4',
};

const INSTALL_TIMEOUT_MS = 180_000;

// npm's package cache, relative to the WebContainer workdir. We point npm here,
// snapshot it after each install, and restore it before the next — so it acts
// as a persistent, shared store across every sandbox on the site.
const NPM_CACHE_DIR = '.npm-cache';
// Single shared key (not per-dependency-set): the npm cache is content-
// addressed, so one blob serves every sandbox regardless of its deps.
const NPM_STORE_KEY = 'npm-store-v1';

// `--prefer-offline`: use the restored cache for anything already downloaded,
//   hit the network only for genuinely new packages (which npm then writes back
//   into the cache for next time).
// `--omit=optional`: skip optionalDependencies the sandbox never needs.
// `--loglevel verbose` + `--progress`: full per-package log with the in-place
//   progress bar (npm hides it at this loglevel); wterm renders both.
const INSTALL_ARGS = [
  'install',
  '--prefer-offline',
  '--omit=optional',
  '--no-audit',
  '--no-fund',
  '--loglevel',
  'verbose',
  '--progress',
];

function buildProjectFiles(dependencies: Record<string, string>, code: string) {
  const pkg = {
    name: 'backroad-sandbox',
    type: 'module',
    scripts: { start: 'tsx app.ts' },
    dependencies: { ...FIXED_DEPS, ...dependencies },
  };
  return {
    'package.json': { file: { contents: JSON.stringify(pkg, null, 2) } },
    'app.ts': { file: { contents: code } },
  };
}

type UseSandboxArgs = {
  code: string;
  dependencies: Record<string, string>;
};

/**
 * Owns the live-sandbox lifecycle: boot WebContainer, mount the project, restore
 * the shared npm store, install (offline-first), start the app, and stream all
 * process output into a wterm terminal.
 */
export function useSandbox({ code, dependencies }: UseSandboxArgs) {
  const [running, setRunning] = useState(false);
  const [status, setStatus] = useState<SandboxStatus>('idle');
  const [statusMessage, setStatusMessage] = useState('');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [currentCode, setCurrentCode] = useState(code);

  const wcRef = useRef<WebContainer | null>(null);
  const abortRef = useRef(false);
  const processesRef = useRef<Set<WebContainerProcess>>(new Set());

  // wterm instance + the element it mounts into. Output that arrives before the
  // terminal has finished its async init() is buffered and flushed once ready.
  const termRef = useRef<WTerm | null>(null);
  const termElRef = useRef<HTMLDivElement>(null);
  const pendingRef = useRef<string[]>([]);

  const writeToTerm = useCallback((data: string) => {
    if (termRef.current) termRef.current.write(data);
    else pendingRef.current.push(data);
  }, []);

  // Create the terminal once its container is in the DOM (i.e. once `running`).
  useEffect(() => {
    if (!running) return;
    let cancelled = false;
    (async () => {
      if (termRef.current || !termElRef.current) return;
      const { WTerm } = await import('@wterm/dom');
      if (cancelled || !termElRef.current) return;
      const term = new WTerm(termElRef.current, {
        autoResize: true,
        cursorBlink: false,
        // Start with a 1-row grid. wterm defaults to 24 rows; as npm output
        // streams in and the grid scrolls, that initial blank screen gets pushed
        // into scrollback, leaving ~24 blank lines above the first real line. A
        // 1-row grid has nothing blank to scroll up; autoResize then grows the
        // viewport by adding rows at the bottom, so the log starts at the top.
        rows: 1,
      });
      await term.init();
      if (cancelled) {
        term.destroy();
        return;
      }
      termRef.current = term;
      for (const chunk of pendingRef.current) term.write(chunk);
      pendingRef.current = [];
    })();
    return () => {
      cancelled = true;
    };
  }, [running]);

  /** Pipe a spawned process's output into the terminal. */
  const pipeToTerm = useCallback(
    (output: ReadableStream<string>) => {
      output
        .pipeTo(new WritableStream({ write: (data) => writeToTerm(data) }))
        .catch(() => {
          /* process output can close during stop/teardown */
        });
    },
    [writeToTerm]
  );

  const spawn = useCallback(
    async (
      wc: WebContainer,
      command: string,
      args: string[],
      options?: SpawnOptions
    ) => {
      const process = await wc.spawn(command, args, options);
      processesRef.current.add(process);
      process.exit.finally(() => {
        processesRef.current.delete(process);
      });
      pipeToTerm(process.output);
      return process;
    },
    [pipeToTerm]
  );

  /** Restore the shared npm store into the cache dir, if we have one cached.
   *  The binary snapshot is rooted at the cache dir's *contents*, and mount's
   *  `mountPoint` only restores into a directory that already exists. */
  const restoreNpmStore = useCallback(async (wc: WebContainer) => {
    const cached = await loadBlob(NPM_STORE_KEY);
    if (!cached) return false;
    await wc.fs.mkdir(NPM_CACHE_DIR, { recursive: true });
    await wc.mount(cached, { mountPoint: NPM_CACHE_DIR });
    return true;
  }, []);

  /** Snapshot the (now larger) npm store back to IndexedDB. Fire-and-forget so
   *  it never delays the preview. Last-writer-wins across concurrent tabs, which
   *  self-heals: a tab that loses an entry just re-downloads + re-caches it. */
  const persistNpmStore = useCallback((wc: WebContainer) => {
    wc.export(NPM_CACHE_DIR, { format: 'binary' })
      .then((blob) => saveBlob(NPM_STORE_KEY, blob))
      .catch(() => {
        /* caching is best-effort */
      });
  }, []);

  /** Run `npm install` pointed at the shared cache dir. Returns the exit code,
   *  or null on timeout. */
  const installDeps = useCallback(
    async (wc: WebContainer): Promise<number | null> => {
      const install = await spawn(wc, 'npm', INSTALL_ARGS, {
        env: { npm_config_cache: `${wc.workdir}/${NPM_CACHE_DIR}` },
      });
      let timeoutId: ReturnType<typeof setTimeout> | undefined;
      const exitCode = await Promise.race([
        install.exit,
        new Promise<null>((resolve) => {
          timeoutId = setTimeout(() => {
            install.kill();
            resolve(null);
          }, INSTALL_TIMEOUT_MS);
        }),
      ]);
      if (timeoutId) clearTimeout(timeoutId);
      return exitCode;
    },
    [spawn]
  );

  const stop = useCallback(() => {
    abortRef.current = true;
    for (const process of processesRef.current) {
      try {
        process.kill();
      } catch {
        // ignore
      }
    }
    processesRef.current.clear();
    if (wcRef.current) {
      try {
        wcRef.current.teardown?.();
      } catch {
        // ignore
      }
      wcRef.current = null;
    }
    if (termRef.current) {
      try {
        termRef.current.destroy();
      } catch {
        // ignore
      }
      termRef.current = null;
    }
    pendingRef.current = [];
    setRunning(false);
    setStatus('idle');
    setStatusMessage('');
    setPreviewUrl(null);
  }, []);

  const start = useCallback(async () => {
    setRunning(true);
    setStatus('booting');
    setStatusMessage('Booting WebContainer...');
    pendingRef.current = [];
    termRef.current?.write('\x1b[2J\x1b[H'); // clear screen + home cursor
    abortRef.current = false;

    try {
      // Dynamic import so WebContainer code only ships on pages with a sandbox.
      const { WebContainer } = await import('@webcontainer/api');
      if (abortRef.current) return;

      const wc = await WebContainer.boot();
      wcRef.current = wc;
      if (abortRef.current) return;

      await wc.mount(buildProjectFiles(dependencies, currentCode));
      if (abortRef.current) return;

      wc.on('server-ready', (_port, url) => {
        setPreviewUrl(url);
        setStatus('ready');
        setStatusMessage('Server ready');
      });

      // Warm the cache from the shared store before installing.
      let warmed = false;
      try {
        warmed = await restoreNpmStore(wc);
      } catch {
        warmed = false; // store missing/corrupt → install cold, repopulate
      }
      if (abortRef.current) return;

      setStatus('installing');
      setStatusMessage(
        warmed
          ? 'Installing dependencies (from cache)...'
          : 'Installing dependencies...'
      );

      const installExit = await installDeps(wc);
      if (abortRef.current) return;
      if (installExit !== 0) {
        setStatus('error');
        setStatusMessage(
          installExit === null
            ? 'npm install timed out after 3 minutes.'
            : `npm install failed (exit ${installExit}).`
        );
        return;
      }

      persistNpmStore(wc);

      setStatus('starting');
      setStatusMessage('Starting app...');
      await spawn(wc, 'npm', ['start']);
    } catch (err) {
      if (abortRef.current) return;
      setStatus('error');
      setStatusMessage(
        err instanceof Error ? err.message : 'Failed to start sandbox'
      );
      // eslint-disable-next-line no-console
      console.error('WebContainer error:', err);
    }
  }, [
    currentCode,
    dependencies,
    installDeps,
    persistNpmStore,
    restoreNpmStore,
    spawn,
  ]);

  // Tear everything down when the component unmounts.
  useEffect(() => stop, [stop]);

  return {
    running,
    status,
    statusMessage,
    previewUrl,
    currentCode,
    setCurrentCode,
    termElRef,
    start,
    stop,
  };
}
