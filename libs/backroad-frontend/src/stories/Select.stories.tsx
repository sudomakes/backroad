import type { Meta, StoryObj } from '@storybook/react-vite';

const Select = ({
  label,
  options,
  defaultValue,
}: {
  label: string;
  options: string[];
  defaultValue?: string;
}) => {
  const id = `s-${label.replace(/\W+/g, '-').toLowerCase()}`;
  return (
    <div className="form-control w-full max-w-xs">
      <label className="label" htmlFor={id}>
        <span className="backroad-label">{label}</span>
      </label>
      <select
        id={id}
        defaultValue={defaultValue}
        className="select select-bordered w-full max-w-xs"
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </div>
  );
};

const meta: Meta<typeof Select> = {
  title: 'Components/Select',
  component: Select,
  parameters: { layout: 'centered' },
};
export default meta;
type Story = StoryObj<typeof Select>;

export const Default: Story = {
  args: {
    label: 'Country',
    options: ['India', 'United States', 'Germany', 'Japan'],
    defaultValue: 'India',
  },
};
