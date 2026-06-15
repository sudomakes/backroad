import type { Meta, StoryObj } from '@storybook/react-vite';
import { backroadClientComponents } from 'backroad-components';
import { ThemeMatrix } from './theme-matrix';

// The real `date_input` renderer (shadcn Input type="date", native picker).
const DateInput = backroadClientComponents.date_input;
const dateInput = (
  args: { label: string; min?: string; max?: string },
  value = ''
) => ({ path: 'story', id: 'story', type: 'date_input' as const, value, args });

const meta: Meta<typeof DateInput> = {
  title: 'Components/DateInput',
  component: DateInput,
  parameters: { layout: 'centered' },
};
export default meta;
type Story = StoryObj<typeof DateInput>;

export const Empty: Story = {
  render: () => <DateInput {...dateInput({ label: 'Start date' })} />,
};
export const WithValue: Story = {
  render: () => (
    <DateInput
      {...dateInput(
        { label: 'Departure', min: '2026-01-01', max: '2026-12-31' },
        '2026-06-15'
      )}
    />
  ),
};
export const AllThemes: Story = {
  render: () => (
    <ThemeMatrix>
      <DateInput {...dateInput({ label: 'Start date' }, '2026-06-15')} />
    </ThemeMatrix>
  ),
};
