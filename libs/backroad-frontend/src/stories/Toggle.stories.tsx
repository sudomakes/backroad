import type { Meta, StoryObj } from '@storybook/react-vite';

const Toggle = ({
  label,
  defaultChecked,
}: {
  label: string;
  defaultChecked?: boolean;
}) => {
  const id = `tg-${label.replace(/\W+/g, '-').toLowerCase()}`;
  return (
    <div className="flex gap-3 items-center">
      <input
        id={id}
        type="checkbox"
        className="toggle toggle-primary"
        defaultChecked={defaultChecked}
      />
      <label htmlFor={id} className="flex-1">
        {label}
      </label>
    </div>
  );
};

const meta: Meta<typeof Toggle> = {
  title: 'Components/Toggle',
  component: Toggle,
  parameters: { layout: 'centered' },
};
export default meta;
type Story = StoryObj<typeof Toggle>;

export const Off: Story = { args: { label: 'Notifications' } };
export const On: Story = { args: { label: 'Dark mode', defaultChecked: true } };
