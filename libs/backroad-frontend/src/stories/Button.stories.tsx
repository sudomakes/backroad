import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from 'backroad-ui';

// Stories render the real shadcn Button shipped by backroad-components so
// axe scans the exact DOM users see. The production renderer also wires a
// socket event on click; that's outside what a11y cares about.
const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  parameters: { layout: 'centered' },
  args: { children: 'Submit' },
};
export default meta;
type Story = StoryObj<typeof Button>;

export const Default: Story = {};
export const Secondary: Story = {
  args: { children: 'Continue', variant: 'secondary' },
};
export const Destructive: Story = {
  args: { children: 'Delete', variant: 'destructive' },
};
export const Ghost: Story = { args: { children: 'Cancel', variant: 'ghost' } };
export const Outline: Story = {
  args: { children: 'Learn more', variant: 'outline' },
};
export const Disabled: Story = {
  args: { children: 'Unavailable', disabled: true },
};
export const LongLabel: Story = {
  args: { children: 'A label that is unusually long for a button' },
};
