import type { ReactNode } from 'react';

const STORY_THEMES = [
  'default',
  'claude',
  'twitter',
  'supabase',
  'amethyst-haze',
] as const;

/**
 * Renders `children` once per theme × (light, dark) in a self-consistent
 * swatch: `data-theme` sets the palette variables and `bg-background
 * text-foreground` re-roots both the painted background and the inherited text
 * color so contrast resolves from one coherent palette. Used by the a11y
 * gate so every theme is scanned in BOTH modes — otherwise a broken mode rots
 * unnoticed.
 */
export const ThemeMatrix = ({ children }: { children: ReactNode }) => (
  <div style={{ padding: '2rem' }} className="space-y-8">
    {STORY_THEMES.flatMap((theme) =>
      (['light', 'dark'] as const).map((mode) => (
        <div
          key={`${theme}-${mode}`}
          data-theme={theme}
          className={`space-y-3 rounded-lg bg-background p-4 text-foreground${
            mode === 'dark' ? ' dark' : ''
          }`}
        >
          <h4 className="text-sm font-medium text-foreground">
            {theme} ({mode})
          </h4>
          {children}
        </div>
      ))
    )}
  </div>
);
