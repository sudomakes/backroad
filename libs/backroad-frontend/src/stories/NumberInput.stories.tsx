import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button, Input, Label } from 'backroad-ui';
import { Minus, Plus } from 'lucide-react';

// Mirrors libs/backroad-components/src/lib/components/number_input.tsx:
// a shadcn Input flanked by increment/decrement icon buttons.
const NumberInput = ({
  label,
  defaultValue,
  min,
  max,
}: {
  label: string;
  defaultValue?: number;
  min?: number;
  max?: number;
}) => {
  const id = `ni-${label.replace(/\W+/g, '-').toLowerCase()}`;
  return (
    <div className="flex w-full max-w-xs flex-col gap-2">
      <Label htmlFor={id}>{label}</Label>
      <div className="flex items-center gap-2">
        <Input
          id={id}
          type="number"
          defaultValue={defaultValue}
          min={min}
          max={max}
        />
        <Button
          type="button"
          variant="outline"
          size="icon"
          aria-label="Decrement"
        >
          <Minus className="size-4" />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="icon"
          aria-label="Increment"
        >
          <Plus className="size-4" />
        </Button>
      </div>
    </div>
  );
};

const meta: Meta<typeof NumberInput> = {
  title: 'Components/NumberInput',
  component: NumberInput,
  parameters: { layout: 'centered' },
};
export default meta;
type Story = StoryObj<typeof NumberInput>;

export const Default: Story = {
  args: { label: 'Quantity', defaultValue: 1, min: 0, max: 99 },
};
