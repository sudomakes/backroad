import type { Meta, StoryObj } from '@storybook/react-vite';

const LoadingSpinner = ({ label }: { label: string }) => (
  <div role="status" className="flex items-center gap-3">
    <span
      className="loading loading-spinner loading-md"
      aria-hidden="true"
    ></span>
    <span>{label}</span>
  </div>
);

const meta: Meta<typeof LoadingSpinner> = {
  title: 'Components/LoadingSpinner',
  component: LoadingSpinner,
  parameters: { layout: 'centered' },
};
export default meta;
type Story = StoryObj<typeof LoadingSpinner>;

export const Default: Story = { args: { label: 'Generating response…' } };
