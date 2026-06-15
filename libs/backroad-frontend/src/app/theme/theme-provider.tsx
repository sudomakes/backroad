import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import { useLocalStorageState } from '../hooks/use-local-storage-state';
import {
  PREFERENCES_STORAGE_KEY,
  type ThemeMode,
  type ThemeName,
} from './themes';

type ThemeContextValue = {
  /** Effective colour palette (tweakcn theme). */
  theme: ThemeName;
  setTheme: (theme: ThemeName) => void;
  /** Effective light / dark / follow-system. */
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  /**
   * Register app-maker defaults (from the backroad config). They apply only
   * while the user hasn't made their own choice — a persisted preference always
   * wins — and are never written to storage, so the app can keep recommending
   * them to return users until they pick their own.
   */
  seedDefaults: (defaults: { theme?: ThemeName; mode?: ThemeMode }) => void;
};

// `null` = the user hasn't chosen this dimension; fall back to the app-maker
// default, then the built-in default.
type Preferences = { theme: ThemeName | null; mode: ThemeMode | null };
const NO_PREFERENCES: Preferences = { theme: null, mode: null };

const ThemeContext = createContext<ThemeContextValue | null>(null);

const prefersDark = () =>
  window.matchMedia('(prefers-color-scheme: dark)').matches;

/**
 * Apply the palette (`data-theme`) and resolved light/dark (`.dark` class) to
 * the document root. `default` uses the bare `:root` tokens, so strip the
 * attribute rather than set `data-theme="default"`.
 */
const applyTheme = (theme: ThemeName, mode: ThemeMode) => {
  const root = document.documentElement;
  if (theme === 'default') root.removeAttribute('data-theme');
  else root.setAttribute('data-theme', theme);
  root.classList.toggle(
    'dark',
    mode === 'dark' || (mode === 'system' && prefersDark())
  );
};

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  // Persisted user choices (one JSON blob; the hook owns all localStorage I/O).
  const [prefs, setPrefs] = useLocalStorageState<Preferences>(
    PREFERENCES_STORAGE_KEY,
    NO_PREFERENCES
  );
  // App-maker recommendations from the config — in-memory, never persisted.
  const [appDefaults, setAppDefaults] = useState<{
    theme?: ThemeName;
    mode?: ThemeMode;
  }>({});

  // Effective value = user choice → app default → built-in. The `??` chain is
  // why a saved preference dominates the app-maker default.
  const theme = prefs.theme ?? appDefaults.theme ?? 'default';
  const mode = prefs.mode ?? appDefaults.mode ?? 'system';

  useEffect(() => {
    applyTheme(theme, mode);
  }, [theme, mode]);

  // Track the OS preference while following the system.
  useEffect(() => {
    if (mode !== 'system') return;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = () => applyTheme(theme, mode);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [theme, mode]);

  const setTheme = useCallback(
    (next: ThemeName) => setPrefs((p) => ({ ...p, theme: next })),
    [setPrefs]
  );
  const setMode = useCallback(
    (next: ThemeMode) => setPrefs((p) => ({ ...p, mode: next })),
    [setPrefs]
  );
  const seedDefaults = useCallback(
    (defaults: { theme?: ThemeName; mode?: ThemeMode }) =>
      setAppDefaults((prev) => ({ ...prev, ...defaults })),
    []
  );

  return (
    <ThemeContext.Provider
      value={{ theme, setTheme, mode, setMode, seedDefaults }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return ctx;
};
