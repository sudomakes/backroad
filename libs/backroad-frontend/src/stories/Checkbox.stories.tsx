import type { Meta, StoryObj } from '@storybook/react-vite';
import { backroadClientComponents } from 'backroad-components';
import { ThemeMatrix } from './theme-matrix';

// The real `checkbox` renderer (shadcn Checkbox + Label).
const Checkbox = backroadClientComponents.checkbox;
const checkbox = (label: string, value = false) => ({
  path: 'story',
  id: 'story',
  type: 'checkbox' as const,
  value,
  args: { label },
});

const meta: Meta<typeof Checkbox> = {
  title: 'Components/Checkbox',
  component: Checkbox,
  parameters: { layout: 'centered' },
};
export default meta;
type Story = StoryObj<typeof Checkbox>;

export const Unchecked: Story = {
  render: () => <Checkbox {...checkbox('Accept terms')} />,
};
export const Checked: Story = {
  render: () => <Checkbox {...checkbox('Email me updates', true)} />,
};
export const AllThemes: Story = {
  render: () => (
    <ThemeMatrix>
      <Checkbox {...checkbox('Email me updates', true)} />
    </ThemeMatrix>
  ),
};
