// Public surface of the design-system primitive layer (shadcn + AI Elements).
// Pure presentational components with no dependency on the socket runtime or
// chart registry — consumers (the app shell, stories, and the renderer layer
// in backroad-components) pull primitives from here.
export * from './lib/utils';
export * from './lib/button';
export * from './lib/input';
export * from './lib/textarea';
export * from './lib/label';
export * from './lib/checkbox';
export * from './lib/switch';
export * from './lib/radio-group';
export * from './lib/tabs';
export * from './lib/card';
export * from './lib/badge';
export * from './lib/select';
export * from './lib/dialog';
export * from './lib/dropdown-menu';
export * from './lib/tooltip';

export * from './lib/ai-elements/message';
export * from './lib/ai-elements/conversation';
export * from './lib/ai-elements/prompt-input';
