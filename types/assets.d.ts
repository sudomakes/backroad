declare module '*.module.css' {
  const classes: Record<string, string>;
  export default classes;
}

declare module '*.module.scss' {
  const classes: Record<string, string>;
  export default classes;
}

declare module '*.svg' {
  const src: string;
  export default src;
}

// Side-effect CSS imports (e.g. `import 'streamdown/styles.css'`). The more
// specific `*.module.css` declaration above still wins for CSS-module imports.
declare module '*.css';
