import { Toaster as Sonner, toast, type ToasterProps } from 'sonner';
import type { CSSProperties } from 'react';

// shadcn's sonner wrapper. No next-themes here — light/dark is driven by the
// `.dark` class on <html>, and sonner reads its own surface colours from these
// CSS variables, so we point them at the design tokens. That makes the toast
// track the active palette + mode without a `theme` prop.
const Toaster = ({ ...props }: ToasterProps) => (
  <Sonner
    className="toaster group"
    toastOptions={{
      classNames: {
        toast:
          'group toast group-[.toaster]:border-border group-[.toaster]:shadow-lg',
      },
    }}
    style={
      {
        '--normal-bg': 'var(--popover)',
        '--normal-text': 'var(--popover-foreground)',
        '--normal-border': 'var(--border)',
      } as CSSProperties
    }
    {...props}
  />
);

export { Toaster, toast };
