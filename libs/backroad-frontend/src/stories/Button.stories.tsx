import type { Meta, StoryObj } from '@storybook/react-vite';
import { backroadClientComponents } from 'backroad-components';
import { ThemeMatrix } from './theme-matrix';

// The real `button` renderer the backroad tree mounts (wraps the shadcn Button
// and wires a socket event on click). Rendering it directly keeps the story in
// lockstep with what the app actually ships.
const Button = backroadClientComponents.button;
const button = (label: string) =>
  ({
    path: 'story',
    id: 'story',
    type: 'button' as const,
    value: false,
    args: { label },
  });

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  parameters: { layout: 'centered' },
};
export default meta;
type Story = StoryObj<typeof Button>;

export const Default: Story = { render: () => <Button {...button('Submit')} /> };
export const LongLabel: Story = {
  render: () => (
    <Button {...button('A label that is unusually long for a button')} />
  ),
};
export const AllThemes: Story = {
  render: () => (
    <ThemeMatrix>
      <Button {...button('Submit')} />
    </ThemeMatrix>
  ),
};
