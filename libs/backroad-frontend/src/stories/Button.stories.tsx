import type { Meta, StoryObj } from '@storybook/react-vite';

// Mirror Backroad's button renderer markup so axe scans the actual
// DOM users see. The real component wires socket events on click;
// that's outside what a11y cares about.
const Button = ({
  label,
  variant = 'default',
  disabled,
}: {
  label: string;
  variant?: 'default' | 'primary' | 'ghost' | 'outline';
  disabled?: boolean;
}) => (
  <button
    type="button"
    disabled={disabled}
    className={`btn ${
      variant === 'primary'
        ? 'btn-primary'
        : variant === 'ghost'
        ? 'btn-ghost'
        : variant === 'outline'
        ? 'btn-outline'
        : ''
    }`}
  >
    {label}
  </button>
);

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  parameters: { layout: 'centered' },
};
export default meta;
type Story = StoryObj<typeof Button>;

export const Default: Story = { args: { label: 'Submit' } };
export const Primary: Story = {
  args: { label: 'Continue', variant: 'primary' },
};
export const Ghost: Story = { args: { label: 'Cancel', variant: 'ghost' } };
export const Outline: Story = {
  args: { label: 'Learn more', variant: 'outline' },
};
export const Disabled: Story = {
  args: { label: 'Unavailable', disabled: true },
};
export const LongLabel: Story = {
  args: { label: 'A label that is unusually long for a button' },
};
