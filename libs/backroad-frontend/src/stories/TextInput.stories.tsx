import type { Meta, StoryObj } from '@storybook/react-vite';
import { backroadClientComponents } from 'backroad-components';
import { ThemeMatrix } from './theme-matrix';

// The real `text_input` renderer (shadcn Input + Label, commits on blur).
const TextInput = backroadClientComponents.text_input;
const textInput = (
  args: { label: string; placeholder?: string },
  value = ''
) => ({ path: 'story', id: 'story', type: 'text_input' as const, value, args });

const meta: Meta<typeof TextInput> = {
  title: 'Components/TextInput',
  component: TextInput,
  parameters: { layout: 'centered' },
};
export default meta;
type Story = StoryObj<typeof TextInput>;

export const Empty: Story = {
  render: () => (
    <TextInput {...textInput({ label: 'Name', placeholder: 'Enter your name' })} />
  ),
};
export const WithValue: Story = {
  render: () => (
    <TextInput
      {...textInput(
        { label: 'Email', placeholder: 'you@example.com' },
        'demo@example.com'
      )}
    />
  ),
};
export const AllThemes: Story = {
  render: () => (
    <ThemeMatrix>
      <TextInput
        {...textInput({ label: 'Name', placeholder: 'Enter your name' })}
      />
    </ThemeMatrix>
  ),
};
