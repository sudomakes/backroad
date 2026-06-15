// The selectable tweakcn palettes. Each `value` matches a `[data-theme="…"]`
// block in styles.css (except `default`, which is the bare `:root`). Adding a
// palette here + a matching CSS block is all it takes to surface a new theme
// in the settings panel.
export const THEMES = [
  { value: 'default', label: 'Default' },
  { value: 'claude', label: 'Claude' },
  { value: 'twitter', label: 'Twitter' },
  { value: 'supabase', label: 'Supabase' },
  { value: 'amethyst-haze', label: 'Amethyst Haze' },
] as const;

export type ThemeName = (typeof THEMES)[number]['value'];
export type ThemeMode = 'light' | 'dark' | 'system';

// Kept in sync with the pre-paint script in index.html.
export const THEME_STORAGE_KEY = 'backroad-theme';
export const MODE_STORAGE_KEY = 'backroad-mode';
