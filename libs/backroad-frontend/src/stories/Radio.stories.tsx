import type { Meta, StoryObj } from '@storybook/react-vite';
import { Label, RadioGroup, RadioGroupItem } from 'backroad-ui';

const RadioField = ({
  label,
  options,
  defaultValue,
}: {
  label: string;
  options: string[];
  defaultValue?: string;
}) => {
  const name = `r-${label.replace(/\W+/g, '-').toLowerCase()}`;
  return (
    <div className="flex w-full max-w-xs flex-col gap-3">
      <span className="backroad-label">{label}</span>
      <RadioGroup defaultValue={defaultValue}>
        {options.map((opt) => {
          const id = `${name}-${opt.replace(/\W+/g, '-').toLowerCase()}`;
          return (
            <div key={opt} className="flex items-center gap-2">
              <RadioGroupItem value={opt} id={id} />
              <Label htmlFor={id} className="font-normal">
                {opt}
              </Label>
            </div>
          );
        })}
      </RadioGroup>
    </div>
  );
};

const meta: Meta<typeof RadioField> = {
  title: 'Components/Radio',
  component: RadioField,
  parameters: { layout: 'centered' },
};
export default meta;
type Story = StoryObj<typeof RadioField>;

export const Default: Story = {
  args: {
    label: 'Plan',
    options: ['Free', 'Pro', 'Enterprise'],
    defaultValue: 'Pro',
  },
};
