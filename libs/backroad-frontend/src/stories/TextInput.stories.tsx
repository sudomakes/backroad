import type { Meta, StoryObj } from '@storybook/react-vite';

const TextInput = ({
  label,
  placeholder,
  defaultValue,
}: {
  label: string;
  placeholder?: string;
  defaultValue?: string;
}) => {
  const id = `ti-${label.replace(/\W+/g, '-').toLowerCase()}`;
  return (
    <div className="form-control w-full max-w-xs">
      <label className="label" htmlFor={id}>
        <span className="backroad-label">{label}</span>
      </label>
      <input
        id={id}
        type="text"
        defaultValue={defaultValue}
        placeholder={placeholder}
        className="input input-bordered w-full max-w-xs"
      />
    </div>
  );
};

const meta: Meta<typeof TextInput> = {
  title: 'Components/TextInput',
  component: TextInput,
  parameters: { layout: 'centered' },
};
export default meta;
type Story = StoryObj<typeof TextInput>;

export const Empty: Story = {
  args: { label: 'Name', placeholder: 'Enter your name' },
};
export const WithValue: Story = {
  args: {
    label: 'Email',
    placeholder: 'you@example.com',
    defaultValue: 'demo@example.com',
  },
};
