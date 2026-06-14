// `@wterm/dom/css` is a CSS side-effect entry point exposed via the package's
// `exports` map; it ships no type declarations, so TS needs this stub to accept
// the side-effect import in BackroadSandbox.tsx.
declare module '@wterm/dom/css';
