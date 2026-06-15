import { BackroadComponentRenderer } from '../types/components';

export const LoadingSpinner: BackroadComponentRenderer<'loading_spinner'> = (
  props
) => {
  const { fontSize, top, left, variant = 'dots' } = props.args;
  return (
    <span
      role="status"
      aria-live="polite"
      aria-label="Assistant is typing"
      style={{ fontSize, top, left }}
      className="inline-flex items-center gap-1"
    >
      <span className="sr-only">Assistant is typing</span>
      {variant === 'dots' && (
        <>
          <span
            className="size-[0.45em] rounded-full bg-current opacity-40 motion-safe:animate-typing-dot motion-reduce:animate-none"
            style={{ animationDelay: '-200ms' }}
          />
          <span
            className="size-[0.45em] rounded-full bg-current opacity-70 motion-safe:animate-typing-dot motion-reduce:animate-none"
            style={{ animationDelay: '-100ms' }}
          />
          <span className="size-[0.45em] rounded-full bg-current motion-safe:animate-typing-dot motion-reduce:animate-none" />
        </>
      )}
      {variant === 'bars' && (
        <>
          <span
            className="h-[0.65em] w-[0.15em] rounded-sm bg-current opacity-40 motion-safe:animate-typing-bar motion-reduce:animate-none"
            style={{ animationDelay: '-200ms' }}
          />
          <span
            className="h-[0.65em] w-[0.15em] rounded-sm bg-current opacity-70 motion-safe:animate-typing-bar motion-reduce:animate-none"
            style={{ animationDelay: '-100ms' }}
          />
          <span className="h-[0.65em] w-[0.15em] rounded-sm bg-current motion-safe:animate-typing-bar motion-reduce:animate-none" />
        </>
      )}
    </span>
  );
};
