import * as React from 'react';
import * as SliderPrimitive from '@radix-ui/react-slider';
import { cn } from './utils';

// shadcn Slider on Radix. Radix gives the thumb a full ARIA slider role
// (aria-valuenow/min/max, arrow-key + Home/End/PageUp-Down support) for free;
// we only style the track/range/thumb with the design tokens.
const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(
  (
    {
      className,
      // Radix renders `role="slider"` on the Thumb, so the accessible name has
      // to land there — on the Root it leaves the thumb unnamed (axe
      // aria-input-field-name). Forward it to the thumb instead.
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledby,
      ...props
    },
    ref
  ) => (
    <SliderPrimitive.Root
      ref={ref}
      data-slot="slider"
      className={cn(
        'relative flex w-full touch-none select-none items-center data-[disabled]:opacity-50',
        className
      )}
      {...props}
    >
      <SliderPrimitive.Track className="relative h-1.5 w-full grow overflow-hidden rounded-full bg-muted">
        <SliderPrimitive.Range className="absolute h-full bg-primary" />
      </SliderPrimitive.Track>
      <SliderPrimitive.Thumb
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledby}
        className="block size-4 rounded-full border border-primary/50 bg-background shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none"
      />
    </SliderPrimitive.Root>
  )
);
Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };
