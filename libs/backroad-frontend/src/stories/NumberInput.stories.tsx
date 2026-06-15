import type { Meta, StoryObj } from '@storybook/react-vite';
import { backroadClientComponents } from 'backroad-components';
import { ThemeMatrix } from './theme-matrix';

// The real `number_input` renderer (shadcn Input flanked by +/- icon buttons).
const NumberInput = backroadClientComponents.number_input;
const numberInput = (
  args: { label: string; min?: number; max?: number; step?: number },
  value = 0
) => ({
  path: 'story',
  id: 'story',
  type: 'number_input' as const,
  value,
  args,
});

const meta: Meta<typeof NumberInput> = {
  title: 'Components/NumberInput',
  component: NumberInput,
  parameters: { layout: 'centered' },
};
export default meta;
type Story = StoryObj<typeof NumberInput>;

export const Default: Story = {
  render: () => <NumberInput {...numberInput({ label: 'Quantity' }, 1)} />,
};
export const WithRange: Story = {
  render: () => (
    <NumberInput {...numberInput({ label: 'Age', min: 0, max: 120 }, 30)} />
  ),
};
export const AllThemes: Story = {
  render: () => (
    <ThemeMatrix>
      <NumberInput {...numberInput({ label: 'Quantity' }, 1)} />
    </ThemeMatrix>
  ),
};
