import type { Meta, StoryObj } from '@storybook/react-vite';
import { backroadClientComponents } from 'backroad-components';
import { ThemeMatrix } from './theme-matrix';

// The real `stats` renderer — including the up/down delta indicators (green ↗ /
// red ↘) that the old hand-written story dropped entirely.
const Stats = backroadClientComponents.stats;
type Item = { label: string; value: string | number; delta?: string | number };
const stats = (items: Item[]) => ({
  path: 'story',
  id: 'story',
  type: 'stats' as const,
  value: null,
  args: { items },
});

const meta: Meta<typeof Stats> = {
  title: 'Components/Stats',
  component: Stats,
  parameters: { layout: 'centered' },
};
export default meta;
type Story = StoryObj<typeof Stats>;

const ITEMS: Item[] = [
  { label: 'Downloads', value: '31K' },
  { label: 'New users', value: '4,200', delta: '+22%' },
  { label: 'New registers', value: '1,200', delta: '-14%' },
];

export const Triple: Story = { render: () => <Stats {...stats(ITEMS)} /> };
export const AllThemes: Story = {
  render: () => (
    <ThemeMatrix>
      <Stats {...stats(ITEMS)} />
    </ThemeMatrix>
  ),
};
