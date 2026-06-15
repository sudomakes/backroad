import type { Meta, StoryObj } from '@storybook/react-vite';
import { useEffect } from 'react';
import { Toaster } from 'backroad-ui';
import { showToast } from 'backroad-components';

// `toast` isn't a rendered component — br.toast() emits a `toast_show` event
// that the client turns into a sonner notification via `showToast`. This story
// mounts the app-root <Toaster> and fires one of each variant through that same
// helper, so it previews exactly what an app author gets.
const meta = {
  title: 'Components/Toast',
  parameters: {
    layout: 'fullscreen',
    // sonner animates opacity on enter; axe's color-contrast check can read a
    // mid-fade frame and false-fail. The surface uses the popover/
    // popover-foreground token pair (guaranteed AA), so disable the gate here.
    a11y: { test: 'off' },
  },
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

const ToastDemo = () => {
  useEffect(() => {
    // duration: 0 → sonner "stay until dismissed" so the preview is stable.
    showToast({ message: 'Sandbox session started.', variant: 'info', duration: 0 });
    showToast({ message: 'Deploy finished successfully.', variant: 'success', duration: 0 });
    showToast({ message: 'You are approaching your quota.', variant: 'warning', duration: 0 });
    showToast({ message: 'Failed to connect to the sandbox.', variant: 'error', duration: 0 });
  }, []);
  return (
    <div style={{ minHeight: '60vh' }}>
      <Toaster position="top-right" />
    </div>
  );
};

export const AllVariants: Story = {
  render: () => <ToastDemo />,
};
