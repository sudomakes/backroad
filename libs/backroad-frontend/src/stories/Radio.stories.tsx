import type { Meta, StoryObj } from '@storybook/react-vite';
import { backroadClientComponents } from 'backroad-components';
import { ThemeMatrix } from './theme-matrix';

// The real `radio` renderer (shadcn RadioGroup + Label).
const Radio = backroadClientComponents.radio;
const radio = (label: string, options: string[], value = options[0]) => ({
  path: 'story',
  id: 'story',
  type: 'radio' as const,
  value,
  args: { label, options },
});

const meta: Meta<typeof Radio> = {
  title: 'Components/Radio',
  component: Radio,
  parameters: { layout: 'centered' },
};
export default meta;
type Story = StoryObj<typeof Radio>;

const PLANS = ['Free', 'Pro', 'Enterprise'];

export const Default: Story = {
  render: () => <Radio {...radio('Plan', PLANS, 'Pro')} />,
};
export const AllThemes: Story = {
  render: () => (
    <ThemeMatrix>
      <Radio {...radio('Plan', PLANS, 'Pro')} />
    </ThemeMatrix>
  ),
};
