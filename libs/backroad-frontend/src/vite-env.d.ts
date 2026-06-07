/// <reference types="vite/client" />

// Ambient declarations for asset side-effect imports (CSS / SCSS / images
// / fonts). Vite handles these at runtime; TypeScript needs the module
// shape declared explicitly under TS 6 strict module resolution.
declare module '*.scss';
declare module '*.css';

// Package subpath that's a stylesheet — TS subpath resolution doesn't
// match it via the generic '*.css' glob above.
declare module '@daveyplate/better-auth-ui/css';
declare module '*.sass';
declare module '*.less';
declare module '*.svg' {
  const src: string;
  export default src;
}
declare module '*.png' {
  const src: string;
  export default src;
}
declare module '*.jpg' {
  const src: string;
  export default src;
}
declare module '*.jpeg' {
  const src: string;
  export default src;
}
declare module '*.gif' {
  const src: string;
  export default src;
}
declare module '*.webp' {
  const src: string;
  export default src;
}
