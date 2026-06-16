import type { ComponentProps, HTMLAttributes, ReactNode } from 'react';
import { cn } from '../utils';

/**
 * Vercel AI Elements `Message` primitives, adapted for Backroad. The original
 * registry component keys its bubble styling off a `.is-user` / `.is-assistant`
 * group class set on the row, so MessageContent flips colours and the row
 * flips direction without prop drilling. We keep that contract but make the
 * avatar accept either an image `src` or arbitrary `children` (Backroad passes
 * a lucide icon), avoiding the extra Radix Avatar dependency.
 */
export type MessageProps = HTMLAttributes<HTMLDivElement> & {
  from: 'user' | 'assistant' | 'system';
};

export const Message = ({ className, from, ...props }: MessageProps) => (
  <div
    className={cn(
      'group flex w-full items-end gap-2 py-2 [&>div]:max-w-[80%]',
      from === 'user'
        ? 'is-user justify-end'
        : 'is-assistant flex-row-reverse justify-end',
      className
    )}
    {...props}
  />
);

export type MessageContentProps = HTMLAttributes<HTMLDivElement>;

export const MessageContent = ({
  children,
  className,
  ...props
}: MessageContentProps) => (
  <div
    className={cn(
      'flex flex-col gap-2 overflow-hidden rounded-lg px-4 py-3 text-sm',
      'group-[.is-user]:bg-primary group-[.is-user]:text-primary-foreground',
      // Assistant bubble must follow the page mode, not `secondary` — some
      // themes (e.g. claude) define `--secondary` as a light accent even in
      // dark mode, which left a cream bubble under `.dark`. The markdown
      // renderer styles its own surfaces (tables, code, inline code) with the
      // page-mode tokens (`bg-muted`, `border-border`, …), so a mismatched
      // bubble rendered dark-on-dark. `bg-muted` + a border keeps the bubble
      // and its rendered markdown in the same mode in every theme.
      'group-[.is-assistant]:bg-muted group-[.is-assistant]:text-foreground group-[.is-assistant]:border group-[.is-assistant]:border-border',
      className
    )}
    {...props}
  >
    {children}
  </div>
);

export type MessageAvatarProps = ComponentProps<'div'> & {
  src?: string;
  name?: string;
  children?: ReactNode;
};

export const MessageAvatar = ({
  src,
  name,
  children,
  className,
  ...props
}: MessageAvatarProps) => (
  <div
    className={cn(
      'flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary text-primary-foreground ring-1 ring-border',
      className
    )}
    {...props}
  >
    {src ? (
      <img src={src} alt={name ?? ''} className="size-full object-cover" />
    ) : (
      children ?? (
        <span className="text-xs font-medium">{name?.slice(0, 2)}</span>
      )
    )}
  </div>
);
