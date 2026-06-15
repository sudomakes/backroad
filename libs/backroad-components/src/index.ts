export * from './lib/tree';
export * from './lib/socket';
// The renderer registry the tree mounts for each component type. The single
// entry point for reaching the real renderers (e.g. backroadClientComponents
// .loading_spinner / .chat_input / .markdown) so Storybook and tests exercise
// the exact components the app uses, not re-implementations.
export { backroadClientComponents } from './lib/components';
