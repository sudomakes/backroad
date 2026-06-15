import { SendHorizontal } from 'lucide-react';
import type { ComponentProps, KeyboardEventHandler } from 'react';
import { Button } from '../button';
import { Textarea } from '../textarea';
import { cn } from '../utils';

/**
 * Vercel AI Elements `PromptInput` — the chat composer. A bordered form shell
 * wrapping an auto-sizing textarea, a toolbar row, and a submit button. The
 * textarea submits the enclosing form on Enter (Shift+Enter for newline),
 * matching the AI SDK reference behaviour.
 */
export type PromptInputProps = ComponentProps<'form'>;

export const PromptInput = ({ className, ...props }: PromptInputProps) => (
  <form
    className={cn(
      'w-full divide-y divide-border overflow-hidden rounded-xl border border-input bg-background shadow-xs',
      'focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/50',
      className
    )}
    {...props}
  />
);

export type PromptInputTextareaProps = ComponentProps<typeof Textarea>;

export const PromptInputTextarea = ({
  className,
  onKeyDown,
  ...props
}: PromptInputTextareaProps) => {
  const handleKeyDown: KeyboardEventHandler<HTMLTextAreaElement> = (e) => {
    if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      e.currentTarget.form?.requestSubmit();
    }
    onKeyDown?.(e);
  };

  return (
    <Textarea
      className={cn(
        'w-full resize-none rounded-none border-none bg-transparent p-3 shadow-none outline-none ring-0',
        'field-sizing-content max-h-48 min-h-16',
        'focus-visible:ring-0 focus-visible:border-none',
        className
      )}
      name="message"
      onKeyDown={handleKeyDown}
      {...props}
    />
  );
};

export type PromptInputToolbarProps = ComponentProps<'div'>;

export const PromptInputToolbar = ({
  className,
  ...props
}: PromptInputToolbarProps) => (
  <div
    className={cn('flex items-center justify-between p-1', className)}
    {...props}
  />
);

export type PromptInputSubmitProps = ComponentProps<typeof Button>;

export const PromptInputSubmit = ({
  className,
  children,
  ...props
}: PromptInputSubmitProps) => (
  <Button
    className={cn('gap-1.5 rounded-lg', className)}
    size="icon"
    type="submit"
    aria-label="Send message"
    {...props}
  >
    {children ?? <SendHorizontal className="size-4" />}
  </Button>
);
