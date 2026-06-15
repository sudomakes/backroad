import type { Meta, StoryObj } from '@storybook/react-vite';
import { backroadClientComponents } from 'backroad-components';
import { ThemeMatrix } from './theme-matrix';

// The real `time_input` renderer (shadcn Input type="time", native picker).
const TimeInput = backroadClientComponents.time_input;
const timeInput = (
  args: { label: string; step?: number },
  value = ''
) => ({ path: 'story', id: 'story', type: 'time_input' as const, value, args });

const meta: Meta<typeof TimeInput> = {
  title: 'Components/TimeInput',
  component: TimeInput,
  parameters: { layout: 'centered' },
};
export default meta;
type Story = StoryObj<typeof TimeInput>;

export const Empty: Story = {
  render: () => <TimeInput {...timeInput({ label: 'Reminder at' })} />,
};
export const WithValue: Story = {
  render: () => (
    <TimeInput {...timeInput({ label: 'Standup', step: 60 }, '09:30')} />
  ),
};
export const AllThemes: Story = {
  render: () => (
    <ThemeMatrix>
      <TimeInput {...timeInput({ label: 'Reminder at' }, '14:00')} />
    </ThemeMatrix>
  ),
};
