import type { Meta, StoryObj } from '@storybook/react-vite';
import { Input, Label } from 'backroad-ui';

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
    <div className="flex w-full max-w-xs flex-col gap-2">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        type="text"
        defaultValue={defaultValue}
        placeholder={placeholder}
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
