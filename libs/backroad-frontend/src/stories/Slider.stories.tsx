import type { Meta, StoryObj } from '@storybook/react-vite';
import { backroadClientComponents } from 'backroad-components';
import { ThemeMatrix } from './theme-matrix';

// The real `slider` renderer (native range, commits on release).
const Slider = backroadClientComponents.slider;
const slider = (
  args: { label: string; min?: number; max?: number; step?: number },
  value = 0
) => ({ path: 'story', id: 'story', type: 'slider' as const, value, args });

const meta: Meta<typeof Slider> = {
  title: 'Components/Slider',
  component: Slider,
  parameters: { layout: 'centered' },
};
export default meta;
type Story = StoryObj<typeof Slider>;

export const Default: Story = {
  render: () => <Slider {...slider({ label: 'Volume' }, 40)} />,
};
export const WithRange: Story = {
  render: () => (
    <Slider {...slider({ label: 'Temperature', min: 16, max: 30, step: 0.5 }, 22)} />
  ),
};
export const AllThemes: Story = {
  render: () => (
    <ThemeMatrix>
      <Slider {...slider({ label: 'Volume', min: 0, max: 100 }, 65)} />
    </ThemeMatrix>
  ),
};
