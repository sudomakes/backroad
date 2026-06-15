import * as React from 'react';
import * as RadioGroupPrimitive from '@radix-ui/react-radio-group';
import { Circle } from 'lucide-react';
import { cn } from './utils';

const RadioGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
>(({ className, ...props }, ref) => (
  <RadioGroupPrimitive.Root
    ref={ref}
    data-slot="radio-group"
    className={cn('grid gap-3', className)}
    {...props}
  />
));
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName;

const RadioGroupItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>
>(({ className, ...props }, ref) => (
  <RadioGroupPrimitive.Item
    ref={ref}
    data-slot="radio-group-item"
    className={cn(
      'aspect-square size-4 shrink-0 rounded-full border border-input text-primary shadow-xs transition-[color,box-shadow] outline-none',
      'focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50',
      'disabled:cursor-not-allowed disabled:opacity-50',
      'aria-invalid:border-destructive aria-invalid:ring-destructive/20',
      className
    )}
    {...props}
  >
    <RadioGroupPrimitive.Indicator className="relative flex items-center justify-center">
      <Circle className="size-2 fill-primary text-primary" />
    </RadioGroupPrimitive.Indicator>
  </RadioGroupPrimitive.Item>
));
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName;

export { RadioGroup, RadioGroupItem };
