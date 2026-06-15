import type { Meta, StoryObj } from '@storybook/react-vite';
import { backroadClientComponents } from 'backroad-components';
import { ThemeMatrix } from './theme-matrix';

// The real `toggle` renderer (shadcn Switch + Label).
const Toggle = backroadClientComponents.toggle;
const toggle = (label: string, value = false) => ({
  path: 'story',
  id: 'story',
  type: 'toggle' as const,
  value,
  args: { label },
});

const meta: Meta<typeof Toggle> = {
  title: 'Components/Toggle',
  component: Toggle,
  parameters: { layout: 'centered' },
};
export default meta;
type Story = StoryObj<typeof Toggle>;

export const Off: Story = { render: () => <Toggle {...toggle('Notifications')} /> };
export const On: Story = {
  render: () => <Toggle {...toggle('Dark mode', true)} />,
};
export const AllThemes: Story = {
  render: () => (
    <ThemeMatrix>
      <Toggle {...toggle('Dark mode', true)} />
    </ThemeMatrix>
  ),
};
