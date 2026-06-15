// Vitest setup (jsdom). jsdom doesn't implement window.matchMedia, but the
// ThemeProvider calls it on mount to detect the OS color scheme. Provide a
// no-op stub so components that read media queries can render in tests.
if (typeof window !== 'undefined' && typeof window.matchMedia !== 'function') {
  window.matchMedia = (query: string) =>
    ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => undefined,
      removeListener: () => undefined,
      addEventListener: () => undefined,
      removeEventListener: () => undefined,
      dispatchEvent: () => false,
    } as MediaQueryList);
}
