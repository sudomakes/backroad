export * from './lib/tree';
export * from './lib/socket';
// Renderers that wrap UI primitives but depend on the socket/types runtime, so
// they live here rather than in the primitive-only backroad-ui lib.
export { LoadingSpinner } from './lib/components/loading_spinner';
export { ChatInput } from './lib/components/chat_input';
export { Markdown } from './lib/components/markdown';
// The renderer registry the tree mounts for each component type. Exported so
// Storybook can render the exact components the app uses (not re-implementations).
export { backroadClientComponents } from './lib/components';
