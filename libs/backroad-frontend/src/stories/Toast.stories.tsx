import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ToastArgs } from '@backroad/core';
import { backroadClientComponents } from 'backroad-components';
import { Toaster } from 'backroad-ui';

// The real `toast` renderer fires a sonner notification on mount and draws
// nothing inline, so the story mounts a <Toaster> and one Toast node per
// variant. duration: 0 keeps them on screen (sonner → Infinity) for the
// preview instead of auto-dismissing.
const Toast = backroadClientComponents.toast;
const toast = (id: string, args: ToastArgs) => ({
  path: 'story',
  id,
  type: 'toast' as const,
  value: null,
  args,
});

const meta = {
  title: 'Components/Toast',
  parameters: { layout: 'fullscreen' },
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const AllVariants: Story = {
  render: () => (
    <div style={{ minHeight: '60vh' }}>
      <Toaster position="top-right" />
      <Toast
        {...toast('info', {
          message: 'Sandbox session started.',
          variant: 'info',
          duration: 0,
        })}
      />
      <Toast
        {...toast('success', {
          message: 'Deploy finished successfully.',
          variant: 'success',
          duration: 0,
        })}
      />
      <Toast
        {...toast('warning', {
          message: 'You are approaching your quota.',
          variant: 'warning',
          duration: 0,
        })}
      />
      <Toast
        {...toast('error', {
          message: 'Failed to connect to the sandbox.',
          variant: 'error',
          duration: 0,
        })}
      />
    </div>
  ),
};
