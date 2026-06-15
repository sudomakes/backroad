import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import {
  MODE_STORAGE_KEY,
  THEME_STORAGE_KEY,
  type ThemeMode,
  type ThemeName,
} from './themes';

type ThemeContextValue = {
  /** Selected colour palette (tweakcn theme). */
  theme: ThemeName;
  setTheme: (theme: ThemeName) => void;
  /** Light / dark / follow-system. */
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  /**
   * Apply app-maker defaults (from the backroad config). Only seeds a
   * dimension the user has NOT already chosen — a persisted localStorage value
   * from a past run always wins — and does NOT persist, so it stays a default
   * (the app can change it for return users until they pick their own).
   */
  seedDefaults: (defaults: { theme?: ThemeName; mode?: ThemeMode }) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

const prefersDark = () =>
  window.matchMedia('(prefers-color-scheme: dark)').matches;

/**
 * Apply the palette (`data-theme` attribute) and resolved light/dark state
 * (`.dark` class) to the document root. `default` uses the bare `:root`
 * tokens, so we strip the attribute rather than set `data-theme="default"`.
 */
const applyTheme = (theme: ThemeName, mode: ThemeMode) => {
  const root = document.documentElement;
  if (theme === 'default') {
    root.removeAttribute('data-theme');
  } else {
    root.setAttribute('data-theme', theme);
  }
  const dark = mode === 'dark' || (mode === 'system' && prefersDark());
  root.classList.toggle('dark', dark);
};

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setThemeState] = useState<ThemeName>(
    () => (localStorage.getItem(THEME_STORAGE_KEY) as ThemeName) || 'default'
  );
  const [mode, setModeState] = useState<ThemeMode>(
    () => (localStorage.getItem(MODE_STORAGE_KEY) as ThemeMode) || 'system'
  );

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

  const setTheme = useCallback((next: ThemeName) => {
    localStorage.setItem(THEME_STORAGE_KEY, next);
    setThemeState(next);
  }, []);

  const setMode = useCallback((next: ThemeMode) => {
    localStorage.setItem(MODE_STORAGE_KEY, next);
    setModeState(next);
  }, []);

  const seedDefaults = useCallback(
    (defaults: { theme?: ThemeName; mode?: ThemeMode }) => {
      // localStorage (a past user choice) dominates: only seed dimensions the
      // user hasn't set, and never persist — keep it a default, not a choice.
      if (defaults.theme && !localStorage.getItem(THEME_STORAGE_KEY)) {
        setThemeState(defaults.theme);
      }
      if (defaults.mode && !localStorage.getItem(MODE_STORAGE_KEY)) {
        setModeState(defaults.mode);
      }
    },
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
