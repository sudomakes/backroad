import { ArrowDown } from 'lucide-react';
import type { ComponentProps } from 'react';
import { useCallback } from 'react';
import { StickToBottom, useStickToBottomContext } from 'use-stick-to-bottom';
import { Button } from '../button';
import { cn } from '../utils';

/**
 * Vercel AI Elements `Conversation` — a scroll container that auto-sticks to
 * the latest message and surfaces a "scroll to bottom" affordance when the
 * user scrolls up. Used to wrap a run of Backroad chat messages.
 */
export type ConversationProps = ComponentProps<typeof StickToBottom>;

export const Conversation = ({ className, ...props }: ConversationProps) => (
  <StickToBottom
    className={cn('relative flex-1 overflow-y-auto', className)}
    initial="smooth"
    resize="smooth"
    role="log"
    {...props}
  />
);

export type ConversationContentProps = ComponentProps<
  typeof StickToBottom.Content
>;

export const ConversationContent = ({
  className,
  ...props
}: ConversationContentProps) => (
  <StickToBottom.Content className={cn('p-4', className)} {...props} />
);

export type ConversationScrollButtonProps = ComponentProps<typeof Button>;

export const ConversationScrollButton = ({
  className,
  ...props
}: ConversationScrollButtonProps) => {
  const { isAtBottom, scrollToBottom } = useStickToBottomContext();

  const handleScrollToBottom = useCallback(
    () => scrollToBottom(),
    [scrollToBottom]
  );

  if (isAtBottom) return null;

  return (
    <Button
      className={cn(
        'absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full',
        className
      )}
      onClick={handleScrollToBottom}
      size="icon"
      type="button"
      variant="outline"
      {...props}
    >
      <ArrowDown className="size-4" />
    </Button>
  );
};
