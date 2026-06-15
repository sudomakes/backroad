import * as React from 'react';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { Check } from 'lucide-react';
import { cn } from './utils';

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    data-slot="checkbox"
    className={cn(
      'peer size-4 shrink-0 rounded-[4px] border border-input shadow-xs transition-shadow outline-none',
      'focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50',
      'data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground data-[state=checked]:border-primary',
      'disabled:cursor-not-allowed disabled:opacity-50',
      'aria-invalid:border-destructive aria-invalid:ring-destructive/20',
      className
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator
      data-slot="checkbox-indicator"
      className="flex items-center justify-center text-current"
    >
      <Check className="size-3.5" />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
));
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export { Checkbox };
