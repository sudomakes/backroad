import type { Meta, StoryObj } from '@storybook/react-vite';
import { backroadClientComponents } from 'backroad-components';
import { ThemeMatrix } from './theme-matrix';

// The real `select` renderer. NOTE: backroad's select is react-select under the
// hood (not the shadcn Select primitive) — rendering the real renderer keeps the
// story honest about what the app actually shows.
const Select = backroadClientComponents.select;
const COUNTRIES = [
  { value: 'in', label: 'India' },
  { value: 'us', label: 'United States' },
  { value: 'de', label: 'Germany' },
  { value: 'jp', label: 'Japan' },
];
const select = (value: string) => ({
  path: 'story',
  id: 'story',
  type: 'select' as const,
  value,
  args: { label: 'Country', options: COUNTRIES },
});

const meta: Meta<typeof Select> = {
  title: 'Components/Select',
  component: Select,
  parameters: { layout: 'centered' },
};
export default meta;
type Story = StoryObj<typeof Select>;

export const Default: Story = { render: () => <Select {...select('in')} /> };
export const AllThemes: Story = {
  render: () => (
    <ThemeMatrix>
      <Select {...select('in')} />
    </ThemeMatrix>
  ),
};
