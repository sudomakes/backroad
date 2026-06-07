import type { Meta, StoryObj } from '@storybook/react-vite';

const Checkbox = ({
  label,
  defaultChecked,
}: {
  label: string;
  defaultChecked?: boolean;
}) => {
  const id = `cb-${label.replace(/\W+/g, '-').toLowerCase()}`;
  return (
    <div className="flex gap-3 items-center">
      <input
        id={id}
        type="checkbox"
        className="checkbox checkbox-primary"
        defaultChecked={defaultChecked}
      />
      <label htmlFor={id} className="flex-1">
        {label}
      </label>
    </div>
  );
};

const meta: Meta<typeof Checkbox> = {
  title: 'Components/Checkbox',
  component: Checkbox,
  parameters: { layout: 'centered' },
};
export default meta;
type Story = StoryObj<typeof Checkbox>;

export const Unchecked: Story = { args: { label: 'Accept terms' } };
export const Checked: Story = {
  args: { label: 'Email me updates', defaultChecked: true },
};
