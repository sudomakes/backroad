import type { Meta, StoryObj } from '@storybook/react-vite';

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
    <div className="form-control w-full max-w-xs">
      <label className="label" htmlFor={id}>
        <span className="backroad-label">{label}</span>
      </label>
      <input
        id={id}
        type="number"
        defaultValue={defaultValue}
        min={min}
        max={max}
        className="input input-bordered w-full max-w-xs"
      />
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
