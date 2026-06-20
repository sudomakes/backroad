// `?raw` imports (see plugins/raw-loader-plugin.ts) resolve to the file's
// verbatim text as a string. Declared here so TS knows the shape.
declare module '*?raw' {
  const content: string;
  export default content;
}
