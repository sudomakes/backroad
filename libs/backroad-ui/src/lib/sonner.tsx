import { Toaster as Sonner, toast, type ToasterProps } from 'sonner';
import type { CSSProperties } from 'react';

// shadcn's sonner wrapper. No next-themes here — light/dark is driven by the
// `.dark` class on <html>, and sonner reads its own surface colours from these
// CSS variables, so we point them at the design tokens. That makes the toast
// track the active palette + mode without a `theme` prop.
//
// Variants are differentiated by a coloured type icon (sonner's default) plus a
// coloured left-accent stripe — NOT a fully coloured background. sonner's
// `richColors` surfaces fail WCAG AA on the error variant in light mode, and
// the design system has no AA-safe success/warning/info surface tokens (only
// `destructive`), so we keep the readable popover surface and accent the edge.
const Toaster = ({ ...props }: ToasterProps) => (
  <Sonner
    className="toaster group"
    toastOptions={{
      classNames: {
        toast: 'group toast border-l-4 group-[.toaster]:shadow-lg',
        success: '!border-l-emerald-500',
        warning: '!border-l-amber-500',
        error: '!border-l-destructive',
        info: '!border-l-sky-500',
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
